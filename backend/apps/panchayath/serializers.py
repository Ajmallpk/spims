from rest_framework import serializers
from .models import PanchayathVerification
from apps.ward.models import WardVerification


class PanchayathVerificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PanchayathVerification
        fields = [
            "panchayath_name",
            "full_name",
            "phone",
            "district",
            "email",
            "aadhaar_image",
            "selfie_image",
        ]

    def validate_aadhaar_image(self, file):
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        max_size = 5 * 1024 * 1024

        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Aadhaar image must be JPG or PNG")

        if file.size > max_size:
            raise serializers.ValidationError("Aadhaar image must be smaller than 5MB")

        return file

    def validate_selfie_image(self, file):
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        max_size = 5 * 1024 * 1024

        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Selfie must be JPG or PNG")

        if file.size > max_size:
            raise serializers.ValidationError("Selfie image must be smaller than 5MB")

        return file
    
class WardVerificationSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="official_email")
    phone = serializers.CharField(source="official_contact")

    class Meta:
        model = WardVerification
        fields = [
            "id",
            "ward_name",
            "username",
            "email",
            "phone",
            "status",
            "submitted_at",
            "reviewed_at"
        ]