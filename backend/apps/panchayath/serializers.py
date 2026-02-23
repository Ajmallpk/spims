from rest_framework import serializers
from .models import PanchayathVerification


class PanchayathVerificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PanchayathVerification
        fields = [
            "full_name",
            "phone_number",
            "aadhaar_image",
            "appointment_letter",
            "live_selfie",
        ]