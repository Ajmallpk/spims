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
        
# class CitizenProfileSerializer(serializers.ModelSerializer):

#     email = serializers.CharField(source="user.email", read_only=True)
#     username = serializers.CharField(source="user.username", read_only=True)
#     is_verified = serializers.BooleanField(source="user.is_verified", read_only=True)

#     class Meta:
#         model = CitizenProfile
#         fields = [
#             "username",
#             "email",
#             "profile_image",
#             "bio",
#             "is_verified",
#         ]


# class CitizenProfileSerializer(serializers.ModelSerializer):

#     email = serializers.CharField(source="user.email", read_only=True)
#     username = serializers.CharField(source="user.username", read_only=True)
#     is_verified = serializers.BooleanField(source="user.is_verified", read_only=True)

#     class Meta:
#         model = CitizenProfile
#         fields = [
#             "username",
#             "email",
#             "profile_image",
#             "bio",
#             "is_verified",

#             "full_name",
#             "phone",
#             "ward",
#             "house_number",
#             "street_name",
#             "address",
#         ]




class CitizenProfileSerializer(serializers.ModelSerializer):

    email = serializers.CharField(source="user.email", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    is_verified = serializers.BooleanField(source="user.is_verified", read_only=True)
    ward_name = serializers.SerializerMethodField()
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
        
        
        
    def get_ward_name(self, obj):
        verification = CitizenVerification.objects.filter(
            user=obj.user,
            status="APPROVED"
        ).first()

        if verification and verification.ward:
            ward_verification = WardVerification.objects.filter(
                user=verification.ward
            ).first()

            if ward_verification:
                return ward_verification.ward_name

        return None