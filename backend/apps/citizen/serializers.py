from rest_framework import serializers
from .models import CitizenVerification,CitizenProfile
from django.contrib.auth import get_user_model
from apps.ward.models import WardVerification

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
    ward_name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model = CitizenProfile
        fields = [
            "username",
            "email",
            "profile_image",
            "bio",
            "is_verified",
            "full_name",
            "phone",
            "ward_name",
            "house_number",
            "street_name",
            "address",
            "created_at",
        ]
        
        
    def get_profile_image(self,obj):

        if obj.profile_image:
            return obj.profile_image.url

        return None
        
        
        
    def get_ward_name(self, obj):
        verification = CitizenVerification.objects.filter(
            user=obj.user,
            status="APPROVED"
        ).first()

        if verification and verification.ward:
            return (
                verification.ward.ward_name
                or f"Ward {verification.ward.ward_number}"
            )

        return None