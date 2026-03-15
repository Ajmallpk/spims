from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CitizenProfile,CitizenVerification
from .serializers import CitizenProfileSerializer,CitizenVerificationSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
import uuid
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import AllowAny
from apps.ward.models import WardVerification
import re
from django.utils import timezone
import logging


logger = logging.getLogger(__name__)



User = get_user_model()


class CitizenProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        profile, created = CitizenProfile.objects.get_or_create(
            user=request.user
        )

        serializer = CitizenProfileSerializer(
            profile,
            context={"request": request}
        )

        return Response(serializer.data)
    


class UpdateCitizenProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        user = request.user
        profile = CitizenProfile.objects.get(user=user)

        username = request.data.get("username")
        if username and username != user.username:

            if len(username) < 3:
                return Response(
                    {"error": "Username must be at least 3 characters"},
                    status=400
                )

            if not re.match(r'^[A-Za-z0-9_]+$', username):
                return Response(
                    {"error": "Username can only contain letters, numbers and underscore"},
                    status=400
                )

            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already taken"},
                    status=400
                )

            user.username = username
            user.save()

        serializer = CitizenProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"Citizen {user.id} updated profile")
            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            })

        return Response(serializer.errors, status=400)
    
    
    
class CitizenVerificationSubmitView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        if user.role != "CITIZEN":
            return Response(
                {"error": "Only citizens can submit verification"},
                status=403
            )

        # if CitizenVerification.objects.filter(user=user).exists():
        #     return Response(
        #         {"error": "Verification already submitted"},
        #         status=400
        #     )
        existing = CitizenVerification.objects.filter(user=user).first()

        if existing:

            if existing.status == "PENDING":
                return Response(
                    {"error": "Verification already under review"},
                    status=400
                )

            existing.delete()

            user.is_verified = False
            user.save()

        serializer = CitizenVerificationSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=user)
            logger.info(f"Citizen {user.id} submitted verification request")
            return Response(
                {"message": "Verification submitted successfully"},
                status=201
            )

        return Response(serializer.errors, status=400)
    
    
    
class CitizenVerificationStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        try:

            verification = CitizenVerification.objects.get(user=user)

            return Response({
                "submitted": True,
                "status": verification.status,
                "reject_reason": verification.reject_reason
            })

        except CitizenVerification.DoesNotExist:

            return Response({
                "submitted": False,
                "status": None
            })
            
            
            
class UploadAvatarView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        try:
            profile = CitizenProfile.objects.get(user=request.user)
        except CitizenProfile.DoesNotExist:
            profile = CitizenProfile.objects.create(user=request.user)

        avatar = request.FILES.get("avatar")

        if not avatar:
            return Response({"error": "No image provided"}, status=400)

        profile.profile_image = avatar
        profile.save()
        logger.info(f"Citizen {request.user.id} updated profile avatar")
        return Response({
            "message": "Avatar uploaded successfully",
            "avatar_url": request.build_absolute_uri(profile.profile_image.url)
        })
        
        
        



class WardListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        wards = WardVerification.objects.filter(
            status="APPROVED"
        ).select_related("user")

        data = [
            {
                "id": ward.user.id,          
                "name": ward.ward_name      
            }
            for ward in wards
        ]

        return Response(data)
    
    
    

class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        if not current_password or not new_password:
            return Response(
                {"message": "Both passwords are required"},
                status=400
            )
        if not user.check_password(current_password):
            return Response(
                {"message": "Current password is incorrect"},
                status=400
            )
        user.set_password(new_password)
        user.save()
        logger.warning(f"Citizen {user.id} changed password")
        return Response(
            {"message": "Password changed successfully"},
            status=200
        )
        
        
        
        
class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        new_email = request.data.get("new_email")
        password = request.data.get("password")

        if not new_email or not password:
            return Response(
                {"message": "Email and password required"},
                status=400
            )
        if not user.check_password(password):
            return Response(
                {"message": "Password incorrect"},
                status=400
            )
        if User.objects.filter(email=new_email).exists():
            return Response(
                {"message": "Email already exists"},
                status=400
            )
        user.email = new_email
        user.save()
        return Response(
            {"message": "Email updated successfully"},
            status=200
        )
        
        
        


class ChangeEmailRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        new_email = request.data.get("new_email")
        password = request.data.get("password")
        
        if not new_email or not password:
            return Response({"message": "Email and password required"}, status=400)

        if not user.check_password(password):
            return Response({"message": "Password incorrect"}, status=400)

        if User.objects.filter(email=new_email).exists():
            return Response({"message": "Email already exists"}, status=400)
        
        

        token = str(uuid.uuid4())
        logger.info(f"Citizen {user.id} requested email change")
        cache.set(
            f"change_email_{token}",
            {
                "user_id": user.id,
                "new_email": new_email
            },
            timeout=600  
        )

        verify_link = f"http://localhost:5173/email-change-confirm/{token}"

        generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

        send_mail(
            subject="SPIMS Email Change Confirmation",
            message=f"""
        Hello {user.username},

        You requested to change the email address for your SPIMS account.

        To confirm this request, please click the link below:

        {verify_link}

        This link will expire in 10 minutes.

        Generated at: {generated_time}
        System: SPIMS Security

        If you did not request this change, please ignore this email or contact support immediately.

        Regards,
        SPIMS Security Team
        """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )

        return Response(
            {"message": "Verification email sent to your current email"},
            status=200
        )
        
        
        

class ChangeEmailVerifyView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, token):

        data = cache.get(f"change_email_{token}")

        if not data:
            return Response({"message": "Invalid or expired token"}, status=400)

        user = User.objects.get(id=data["user_id"])
        user.email = data["new_email"]
        user.save()
        logger.info(f"Citizen {user.id} changed email successfully")
        cache.delete(f"change_email_{token}")

        return Response(
            {
                "message": "Email updated successfully",
                "email": user.email
            },
            status=200
        )