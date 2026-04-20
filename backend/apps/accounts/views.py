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
from .utils.responses import success_response,error_response
from rest_framework import serializers




logger = logging.getLogger(__name__)



User = get_user_model()

"""Handles signup POST requests, validates user data through the serializer, creates the user, and returns success or error response."""



class CitizenSignupRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = SignupSerializer(data=request.data)

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            email = serializer.validated_data["email"]

            if User.objects.filter(email=email).exists():
                return error_response(
                    message="User with this email already exists",
                    status=400
                )

            otp = generate_otp()
            username = serializer.validated_data["username"]

            store_signup_data(email, serializer.validated_data, role="CITIZEN")
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp, username)

            logger.info(f"Signup OTP sent to {email}")

            return success_response(
                message="OTP sent to email"
            )

        except Exception as e:
            logger.error(f"CitizenSignup error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
        
class AuthoritySignupRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            role = request.data.get("role")

            if role not in ["WARD", "PANCHAYATH"]:
                return error_response(
                    message="Invalid authority role",
                    status=400
                )

            serializer = SignupSerializer(data=request.data)

            
            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            email = serializer.validated_data["email"]

            
            if User.objects.filter(email=email).exists():
                return error_response(
                    message="User with this email already exists",
                    status=400
                )

            
            otp = generate_otp()
            username = serializer.validated_data["username"]

            store_signup_data(email, serializer.validated_data, role=role)
            store_otp(email, otp, purpose="signup")
            send_otp_email(email, otp, username)

            logger.info(f"{role} signup OTP sent to {email}")

            return success_response(
                message="OTP sent to email"
            )

        except Exception as e:
            logger.error(f"AuthoritySignup error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            otp = request.data.get("otp")

            if not email or not otp:
                return error_response(
                    message="Email and OTP are required",
                    status=400
                )

            valid, message = verify_otp(email, otp, purpose="signup")

            if not valid:
                return error_response(
                    message=message,
                    status=400
                )

            signup_data = get_signup_data(email)

            if not signup_data:
                return error_response(
                    message="Signup expired",
                    status=400
                )

            role = signup_data.get("role")

            user = User.objects.create_user(
                username=signup_data.get("username"),
                email=signup_data.get("email"),
                password=signup_data.get("password"),
                role=role,
                status=User.Status.ACTIVE,
                is_verified=False
            )

            clear_otp(email, "signup")
            delete_signup_data(email)

            logger.info(f"User created successfully: {email}, role: {role}")

            return success_response(
                message="Account created successfully",
                status=201
            )

        except Exception as e:
            logger.error(f"VerifyOTP error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
            


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")

            if not email:
                return error_response(
                    message="Email is required",
                    status=400
                )

            
            success, result = resend_otp(email, purpose="signup")

            if not success:
                return error_response(
                    message=result,
                    status=400
                )

            
            signup_data = get_signup_data(email)
            username = signup_data.get("username") if signup_data else "User"

            send_otp_email(email, result["otp"], username)

            logger.info(f"OTP resent to {email}")

            return success_response(
                message="OTP resent successfully",
                data={
                    "remaining": result.get("remaining")
                }
            )

        except Exception as e:
            logger.error(f"ResendOTP error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
            
        
    
    



class EmailLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = EmailTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)

            serializer.is_valid(raise_exception=True)

            user = serializer.user

            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            response = success_response(
                message="Login successful",
                data={
                    "role": serializer.validated_data.get("role"),
                    "status": serializer.validated_data.get("status"),
                    "is_superuser": serializer.validated_data.get("is_superuser"),
                    "is_verified": serializer.validated_data.get("is_verified"),
                }
            )

           
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

            logger.info(f"User logged in: {user.email}")

            return response

        except serializers.ValidationError as e:
            logger.warning(f"Login failed: {str(e)}")

            return error_response(
                message="Invalid email or password",
                errors=e.detail,
                status=400
            )

        except Exception as e:
            logger.error(f"Login error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if not refresh_token:
                return error_response(
                    message="No refresh token provided",
                    status=400
                )

            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as token_error:
                logger.warning(f"Invalid or expired token during logout: {str(token_error)}")

                return error_response(
                    message="Invalid or expired token",
                    status=400
                )

            response = success_response(
                message="Logged out successfully"
            )

            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")

            logger.info(f"User logged out: {request.user.email}")

            return response

        except Exception as e:
            logger.error(f"Logout error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            ) 
    
    
    
    
    
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")

            if not email:
                return error_response(
                    message="Email is required",
                    status=400
                )

            user = User.objects.filter(email=email).first()

            if not user:
                logger.warning(f"Password reset attempted for non-existing email: {email}")

                return error_response(
                    message="User not found",
                    status=400
                )

            otp = generate_otp()
            store_otp(email, otp, purpose="reset")
            send_otp_email(email, otp, user.username)

            logger.info(f"Password reset OTP sent to {email}")

            return success_response(
                message="Reset OTP sent"
            )

        except Exception as e:
            logger.error(f"ForgotPassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )




        
class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            otp = request.data.get("otp")

            if not email or not otp:
                return error_response(
                    message="Email and OTP are required",
                    status=400
                )

            valid, message = verify_otp(email, otp, purpose="reset")

            if not valid:
                logger.warning(f"Invalid reset OTP attempt for {email}")

                return error_response(
                    message=message,
                    status=400
                )

            logger.info(f"Reset OTP verified for {email}")

            return success_response(
                message="OTP verified"
            )

        except Exception as e:
            logger.error(f"VerifyResetOTP error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
        
        
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get("email")
            new_password = request.data.get("new_password")
            confirm_password = request.data.get("confirm_password")

            if not email or not new_password or not confirm_password:
                return error_response(
                    message="All fields are required",
                    status=400
                )

            if new_password != confirm_password:
                return error_response(
                    message="Passwords do not match",
                    status=400
                )

            key = get_cache_key(email, "reset")
            data = cache.get(key)

            if not data or not data.get("verified"):
                return error_response(
                    message="OTP not verified",
                    status=400
                )

            user = User.objects.filter(email=email).first()

            if not user:
                return error_response(
                    message="User not found",
                    status=400
                )

            user.set_password(new_password)
            user.save()

            clear_otp(email, "reset")

            logger.info(f"Password reset successful for {email}")

            return success_response(
                message="Password reset successful"
            )

        except Exception as e:
            logger.error(f"ResetPassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    




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
    
    
    