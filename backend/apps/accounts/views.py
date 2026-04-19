from rest_framework.views  import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import EmailTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.permissions import AllowAny
import logging
logger = logging.getLogger(__name__)
from .otp_utils import (generate_otp,verify_otp,get_cache_key,resend_otp,store_signup_data,
                       store_otp,RESEND_LIMIT,clear_otp,get_signup_data,delete_signup_data,send_otp_email)

from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator






logger = logging.getLogger(__name__)



User = get_user_model()

"""Handles signup POST requests, validates user data through the serializer, creates the user, and returns success or error response."""



class CitizenSignupRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "User with this email already exists"},
                    status=400
                )
            
            logger.info(f"Signup OTP requested for {email}")
            otp = generate_otp()
            username = serializer.validated_data["username"]

            store_signup_data(email, serializer.validated_data, role="CITIZEN")
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp, username)
            return Response({"message": "OTP sent to email"}, status=200)
        return Response(serializer.errors, status=400)
        
        
        
        
class AuthoritySignupRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        role = request.data.get("role")

        if role not in ["WARD", "PANCHAYATH"]:
            return Response({"error": "Invalid authority role"}, status=400)
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "User with this email already exists"},
                    status=400
                )
            otp = generate_otp()
            username = serializer.validated_data["username"]

            store_signup_data(email, serializer.validated_data, role=role)
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp, username)
            return Response({"message": "OTP sent to email"}, status=200)
        return Response(serializer.errors, status=400)
    
    
    
    
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        valid, message = verify_otp(email, otp, purpose="signup")
        if not valid:
            return Response({"error": message}, status=400)

        signup_data = get_signup_data(email)
        if not signup_data:
            return Response({"error": "Signup expired"}, status=400)

        role = signup_data["role"]
        logger.info(f"User account created for {email} with role {role}")
        user = User.objects.create_user(
            username=signup_data["username"],  
            email=signup_data["email"],
            password=signup_data["password"],
            role=role,
            status=User.Status.ACTIVE,
            is_verified=False
        )

        clear_otp(email, "signup")
        delete_signup_data(email)
        return Response({"message": "Account created successfully"}, status=201)
        
        
            


class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        success, result = resend_otp(email, purpose="signup")

        if not success:
            return Response({"error": result}, status=400)

        signup_data = get_signup_data(email)
        username = signup_data["username"] if signup_data else "User"

        send_otp_email(email, result["otp"], username)

        return Response({
            "message": "OTP resent successfully",
            "remaining": result["remaining"]
        }, status=200)
            
        
    
    



class EmailLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({
            "message": "Login successful",
            "role": serializer.validated_data.get("role"),
            "status": serializer.validated_data.get("status"),
            "is_superuser": serializer.validated_data.get("is_superuser"),
            "is_verified": serializer.validated_data.get("is_verified"),
        })

        
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=False,  
            samesite="Lax"
        )

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return response 
    
    
    
    
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if not refresh_token:
                return Response({"error": "No refresh token"}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist() 

            response = Response({"message": "Logged out successfully"})

            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")

            return response

        except Exception:
            return Response({"error": "Invalid token"}, status=400)  
    
    
    
    
    
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email required"}, status=400)
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Password reset attempted for non-existing email: {email}")
            return Response({"error": "User not found"}, status=400)

        otp = generate_otp()
        store_otp(email, otp, purpose="reset")
        user = User.objects.get(email=email)
        send_otp_email(email, otp, user.username)
        return Response({"message": "Reset OTP sent"}, status=200)



        
class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        valid, message = verify_otp(email, otp, purpose="reset")
        if not valid:
            return Response({"error": message}, status=400)
        return Response({"message": "OTP verified"}, status=200)
        
        
        
        
        
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        key = get_cache_key(email, "reset")
        data = cache.get(key)

        if not data or not data.get("verified"):
            return Response({"error": "OTP not verified"}, status=400)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        user.set_password(new_password)
        user.save()
        clear_otp(email, "reset")
        return Response({"message": "Password reset successful"}, status=200)
    
    
    




@method_decorator(ensure_csrf_cookie, name='dispatch')
class SetCSRFTokenView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({"message": "CSRF cookie set"})   
    




from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
        "id": request.user.id,
        "email": request.user.email,
        "role": "ADMIN" if request.user.is_superuser else request.user.role,
    })
    
    
    