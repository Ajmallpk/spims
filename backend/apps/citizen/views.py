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
from .utils.responses import success_response,error_response


logger = logging.getLogger(__name__)



User = get_user_model()


class CitizenProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile, created = CitizenProfile.objects.get_or_create(
                user=request.user
            )

            serializer = CitizenProfileSerializer(
                profile,
                context={"request": request}
            )

            logger.info(f"Citizen {request.user.id} fetched profile")

            return success_response(
                message="Profile fetched successfully",
                data=serializer.data
            )

        except Exception as e:
            logger.error(f"CitizenProfile error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    



class UpdateCitizenProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            profile, _ = CitizenProfile.objects.get_or_create(user=user)

            username = request.data.get("username")

            if username and username != user.username:
                if len(username) < 3:
                    return error_response(
                        message="Username must be at least 3 characters",
                        status=400
                    )

                if not re.match(r'^[A-Za-z0-9_]+$', username):
                    return error_response(
                        message="Username can only contain letters, numbers and underscore",
                        status=400
                    )

                if User.objects.filter(username=username).exists():
                    return error_response(
                        message="Username already taken",
                        status=400
                    )

                user.username = username
                user.save()

            serializer = CitizenProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            serializer.save()

            logger.info(f"Citizen {user.id} updated profile")

            return success_response(
                message="Profile updated successfully",
                data=serializer.data
            )

        except Exception as e:
            logger.error(f"UpdateCitizenProfile error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class CitizenVerificationSubmitView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = request.user

            if user.role != "CITIZEN":
                return error_response(
                    message="Only citizens can submit verification",
                    status=403
                )

            existing = CitizenVerification.objects.filter(user=user).first()

            if existing:
                if existing.status == "PENDING":
                    return error_response(
                        message="Verification already under review",
                        status=400
                    )

                existing.delete()
                user.is_verified = False
                user.save()

            serializer = CitizenVerificationSerializer(data=request.data)

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            # serializer.save(user=user)
            serializer.save(user=user, status="PENDING")

            logger.info(f"Citizen {user.id} submitted verification")

            return success_response(
                message="Verification submitted successfully",
                status=201
            )

        except Exception as e:
            logger.error(f"CitizenVerificationSubmit error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class CitizenVerificationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            verification = CitizenVerification.objects.filter(user=user).first()

            if not verification:
                return success_response(
                    message="Verification not submitted",
                    data={
                        "submitted": False,
                        "status": None,
                        "reject_reason": None
                    }
                )

            logger.info(f"Citizen {user.id} checked verification status")

            return success_response(
                message="Verification status fetched",
                data={
                    "submitted": True,
                    "status": verification.status,
                    "reject_reason": verification.reject_reason
                }
            )

        except Exception as e:
            logger.error(f"CitizenVerificationStatus error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
            
            
class UploadAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            profile, _ = CitizenProfile.objects.get_or_create(user=request.user)

            avatar = request.FILES.get("avatar")

            if not avatar:
                return error_response(
                    message="No image provided",
                    status=400
                )

            if not avatar.content_type.startswith("image/"):
                return error_response(
                    message="Only image files are allowed",
                    status=400
                )

            if avatar.size > 2 * 1024 * 1024:
                return error_response(
                    message="Image size must be less than 2MB",
                    status=400
                )

            profile.profile_image = avatar
            profile.save()

            logger.info(f"Citizen {request.user.id} updated avatar")

            return success_response(
                message="Avatar uploaded successfully",
                data={
                    "avatar_url": request.build_absolute_uri(profile.profile_image.url)
                }
            )

        except Exception as e:
            logger.error(f"UploadAvatar error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        



class WardListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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

            logger.info(f"Citizen {request.user.id} fetched ward list")

            return success_response(
                message="Ward list fetched successfully",
                data=data
            )

        except Exception as e:
            logger.error(f"WardList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            current_password = request.data.get("current_password")
            new_password = request.data.get("new_password")
            confirm_password = request.data.get("confirm_password")

            if not current_password or not new_password or not confirm_password:
                return error_response(
                    message="All password fields are required",
                    status=400
                )

            if not user.check_password(current_password):
                logger.warning(f"Wrong current password attempt by user {user.id}")

                return error_response(
                    message="Current password is incorrect",
                    status=400
                )

            if new_password != confirm_password:
                return error_response(
                    message="Passwords do not match",
                    status=400
                )

            if user.check_password(new_password):
                return error_response(
                    message="New password cannot be same as old password",
                    status=400
                )

            user.set_password(new_password)
            user.save()

            logger.info(f"Citizen {user.id} changed password successfully")

            return success_response(
                message="Password changed successfully"
            )

        except Exception as e:
            logger.error(f"ChangePassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
        
        
        
class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            new_email = request.data.get("new_email")
            password = request.data.get("password")

            if not new_email or not password:
                return error_response(
                    message="Email and password are required",
                    status=400
                )

            if not re.match(r"[^@]+@[^@]+\.[^@]+", new_email):
                return error_response(
                    message="Invalid email format",
                    status=400
                )

            if not user.check_password(password):
                logger.warning(f"Wrong password attempt for email change by user {user.id}")

                return error_response(
                    message="Password incorrect",
                    status=400
                )

            if User.objects.filter(email=new_email).exists():
                return error_response(
                    message="Email already exists",
                    status=400
                )

            user.email = new_email
            user.save()

            logger.info(f"Citizen {user.id} changed email successfully")

            return success_response(
                message="Email updated successfully"
            )

        except Exception as e:
            logger.error(f"ChangeEmail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        


class ChangeEmailRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            new_email = request.data.get("new_email")
            password = request.data.get("password")

            if not new_email or not password:
                return error_response(
                    message="Email and password are required",
                    status=400
                )

            if not re.match(r"[^@]+@[^@]+\.[^@]+", new_email):
                return error_response(
                    message="Invalid email format",
                    status=400
                )

            if not user.check_password(password):
                logger.warning(f"Wrong password for email change request by user {user.id}")

                return error_response(
                    message="Password incorrect",
                    status=400
                )

            if User.objects.filter(email=new_email).exists():
                return error_response(
                    message="Email already exists",
                    status=400
                )

            token = str(uuid.uuid4())

            cache.set(
                f"change_email_{token}",
                {
                    "user_id": user.id,
                    "new_email": new_email
                },
                timeout=600  
            )

            verify_link = f"http://localhost:5173/email-change-confirm/{token}"
            send_mail(
                subject="SPIMS Email Change Confirmation",
                message=f"""
Hello {user.username},

You requested to change your email.

Click the link below to confirm:

{verify_link}

This link will expire in 10 minutes.

If you didn’t request this, ignore this email.
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            logger.info(f"Citizen {user.id} requested email change")

            return success_response(
                message="Verification email sent to your current email"
            )

        except Exception as e:
            logger.error(f"ChangeEmailRequest error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        


class ChangeEmailVerifyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            data = cache.get(f"change_email_{token}")

            if not data:
                return error_response(
                    message="Invalid or expired token",
                    status=400
                )

            user = User.objects.filter(id=data.get("user_id")).first()

            if not user:
                return error_response(
                    message="User not found",
                    status=400
                )

            user.email = data.get("new_email")
            user.save()

            cache.delete(f"change_email_{token}")

            logger.info(f"Citizen {user.id} changed email successfully via verification")

            return success_response(
                message="Email updated successfully",
                data={
                    "email": user.email
                }
            )

        except Exception as e:
            logger.error(f"ChangeEmailVerify error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )