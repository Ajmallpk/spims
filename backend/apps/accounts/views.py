from rest_framework.views  import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import EmailTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from .otp_utils import generate_otp,send_otp_email,store_signup_data,get_signup_data,delete_signup_data,store_reset_data,get_reset_data,delete_reset_data




"""Handles signup POST requests, validates user data through the serializer, creates the user, and returns success or error response."""

class SignupRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        User = get_user_model()
        
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")
        role = request.data.get("role")
        
        if not all([username,email,password,confirm_password,role]):
            return Response({"error":"All fields are requered"},status=400)
        
        if password != confirm_password:
            return Response({"error":"password do not match"},status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({"error":"Email already registered"},status=400)
    
        otp = generate_otp()
        signup_data = {
            "username":username,
            "email":email,
            "password":password,
            "role":role,
            "otp":otp,
            "resend_count":0,
        }

        store_signup_data(email,signup_data)
        send_otp_email(email,otp)
        return Response({"message":"OTP sent to your email.Verify within 5 minutes."},status=200)
        
        
        
        
class VerifyOTPView(APIView):
    permission_classes =[AllowAny]
    
    def post(self,request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        
        if not email or not otp:
            return Response({"error":"Email and OTP are requered"},status=400)
        
        signup_data = get_signup_data(email)
        
        if not signup_data:
            return Response({"error": "OTP expired or invalid request. Please signup again."},status=400)
        
        if str(signup_data["otp"]) != str(otp):
            return Response({"error":"invalid otp"},status=400)
        

        User = get_user_model()
        
        user = User.objects.create_user(
            username = signup_data["username"],
            email = signup_data["email"],
            password = signup_data["password"]
        )
        
        user.role = signup_data["role"]
        user.status = "PENDING"
        user.save()
        
        delete_signup_data(email)
        
        return Response(
            {"message":"Account created successfully. Awaiting verification approval."},
            status=201
        )
        
        
        
            
class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get("email")
        
        if not email:
            return Response({"error":"email requered"},status=400)

        signup_data  = get_signup_data(email)
        
        if not signup_data:
            return Response({"error":"OTP expired. Please signup again."},status=400)

        if signup_data["resend_count"] >=3 :
            return Response({"error":"Maximum resend limit reached."},status=400)
        
        new_otp = generate_otp()

        signup_data["otp"] = new_otp
        signup_data["resend_count"] += 1
        
        store_signup_data(email,signup_data)
        send_otp_email(email,new_otp)
        
        return Response({"message":"OTP resent successfully."},status=200)
    
        
    

class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer    
    
    
    
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        User = get_user_model()

        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=400)

        existing_reset = get_reset_data(email)
        if existing_reset:
            return Response(
                {"error": "OTP already sent. Please verify or wait for expiry."},
                status=400
            )

        otp = generate_otp()

        reset_data = {
            "otp": otp,
            "verified": False,
            "resend_count": 0,
        }

        store_reset_data(email, reset_data)

        send_otp_email(email, otp)

        return Response(
            {"message": "Password reset OTP sent successfully."},
            status=200
        )


        
class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        
        if not email or not otp:
            return Response({"error":"Email and OTP are requered"},status=400)
        
        reset_data = get_reset_data(email)
        if not reset_data:
            return Response(
                {"error":"OTP expired or invalid request"},
                status=400
            )
        
        reset_data["verified"] =  True
        store_reset_data(email,reset_data)
        return Response(
            {"message":"OTP verified successfully. you can now reset your password"},
            status=200
        )
        
        
        
class ResetPasswordView(APIView):
    permission_classes  = [AllowAny]
    
    
    def post(self,request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        
        if not email or not new_password or not confirm_password:
            return Response(
                {"error":"All fields are requered"},
                status=400
            )
            
        if new_password != confirm_password:
            return Response(
                {"error":"passwords do not match"},
                status=400
            )

        reset_data = get_reset_data(email)
        
        if not reset_data:
            return Response(
                {"error":"OTP expired or invaid request"},
                status=400
            )

        if not reset_data.get("verified"):
            return Response(
                {"error":"OTP not verified"},
                status=400
            )
            
        User = get_user_model()
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error":"User does not exists"},
                status=400
            )
            
        user.set_password(new_password)
        user.save()
        
        delete_reset_data(email)
        return Response(
            {"message":"password reset Successfully"},
            status=200
        )
    
    
    
    
    
    
    
    


    
    
    