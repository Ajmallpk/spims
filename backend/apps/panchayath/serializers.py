from rest_framework import serializers
from .models import PanchayathVerification
from apps.ward.models import WardVerification
from apps.complaints.models import Complaint,ComplaintHistory
from django.utils import timezone
from apps.complaints.utils import can_change_status

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
        
        

# class PanchayathResoveSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Complaint
#         fields = ["resolution_description","image_proof"]
        
#     def update(self, instance, validated_data):
#         if not can_change_status(instance.status,"RESOLVED"):
#             raise serializers.ValidationError(
#                 f"Cannot reslove form {instance.status}"
#             )
        
#         instance.status = "RESOLVED"
#         instance.resolution_description = validated_data.get("resolution_description")
#         instance.image_proof = validated_data.get("image_proof",instance.image_proof)
#         instance.resolved_at = timezone.now()
#         instance.chat_closed = True
        
#         instance.save()
#         ComplaintHistory.objects.create(
#             complaint=instance,
#             action="RESOLVED_BY_PANCHAYATH",
#             performed_by=self.context["request"].user,
#             note=instance.resolution_description
#         )
#         return instance
    
    
    
    
class ReassignComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["reassign_note"]

    def validate_reassign_note(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Minimum 10 characters required")
        return value

    def update(self, instance, validated_data):
        
        if not can_change_status(instance.status,"IN_PROGRESS"):
            raise serializers.ValidationError(
                f"Cannot reassing from {instance.status}"
            )
        
        
        instance.status = "IN_PROGRESS"
        instance.reassign_note = validated_data.get("reassign_note")

        instance.save()

        ComplaintHistory.objects.create(
            complaint=instance,
            action="REASSIGNED",
            performed_by=self.context["request"].user,
            note=instance.reassign_note
        )

        return instance
        
            