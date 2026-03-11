from rest_framework.views  import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import EmailTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from .otp_utils import (generate_otp,verify_otp,get_cache_key,resend_otp,store_signup_data,
                       store_otp,RESEND_LIMIT,clear_otp,get_signup_data,delete_signup_data,send_otp_email)


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
                
            otp = generate_otp()

            store_signup_data(email, serializer.validated_data, role="CITIZEN")
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp)
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

            store_signup_data(email, serializer.validated_data, role=role)
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp)
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

        send_otp_email(email, result["otp"])

        return Response({
            "message": "OTP resent successfully",
            "remaining": result["remaining"]
        }, status=200)
            
        
    
    

class EmailLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer    
    
    
    
    
    
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email required"}, status=400)
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        otp = generate_otp()
        store_otp(email, otp, purpose="reset")
        send_otp_email(email, otp)
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
    
    
    
    
    


    
    
    