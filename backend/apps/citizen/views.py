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

        profile = CitizenProfile.objects.get(user=request.user)

        serializer = CitizenProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

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

        if CitizenVerification.objects.filter(user=user).exists():
            return Response(
                {"error": "Verification already submitted"},
                status=400
            )

        serializer = CitizenVerificationSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=user)

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

        return Response({
            "message": "Avatar uploaded successfully",
            "avatar_url": request.build_absolute_uri(profile.profile_image.url)
        })
        
        
        



class WardListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        wards = User.objects.filter(role="WARD", is_active=True)

        data = [
            {
                "id": ward.id,
                "name": ward.username
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

        if not user.check_password(password):
            return Response({"message": "Password incorrect"}, status=400)

        if User.objects.filter(email=new_email).exists():
            return Response({"message": "Email already exists"}, status=400)

        token = str(uuid.uuid4())

        cache.set(
            f"change_email_{token}",
            {
                "user_id": user.id,
                "new_email": new_email
            },
            timeout=600  # 10 minutes
        )

        verify_link = f"http://localhost:8000/api/citizen/change-email/verify/{token}/"

        send_mail(
            subject="Confirm your email change",
            message=f"Click the link to confirm your email change:\n{verify_link}",
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

        cache.delete(f"change_email_{token}")

        return Response(
            {"message": "Email updated successfully"},
            status=200
        )