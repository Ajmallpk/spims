from rest_framework import serializers
from .models import CitizenVerification,CitizenProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class CitizenVerificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = CitizenVerification
        fields = [
            "full_name",
            "phone",
            "ward",
            "house_number",
            "street_name",
            "aadhaar_image",
            "selfie_image",
        ]
        
class CitizenProfileSerializer(serializers.ModelSerializer):

    email = serializers.CharField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    is_verified = serializers.BooleanField(source="user.is_verified", read_only=True)

    class Meta:
        model = CitizenProfile
        fields = [
            "username",
            "email",
            "profile_image",
            "bio",
            "is_verified",
        ]