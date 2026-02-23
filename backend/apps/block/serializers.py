from rest_framework import serializers
from .models import BlockVerification


class BlockVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockVerification
        fields = [
            "full_name",
            "phone_number",
            "aadhaar_image",
            "appointment_letter",
            "live_selfie",
        ]