from rest_framework import serializers
from .models import PanchayathVerification
from apps.ward.models import WardVerification
from apps.complaints.models import Complaint,ComplaintHistory
from django.utils import timezone
from apps.complaints.utils import can_change_status

class PanchayathVerificationSerializer(serializers.ModelSerializer):
    
    aadhaar_image = serializers.SerializerMethodField()
    selfie_image = serializers.SerializerMethodField()

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
        
    def get_aadhaar_image(self,obj):

        if obj.aadhaar_image:
            return obj.aadhaar_image.url

        return None


    def get_selfie_image(self,obj):

        if obj.selfie_image:
            return obj.selfie_image.url

        return None
    

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
    complaint_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WardVerification
        fields = [
            "id",
            "ward_name",
            "username",
            "email",
            "phone",
            "complaint_count",
            "status",
            "submitted_at",
            "reviewed_at"
        ]
        
        

    
    
    
    
class ReassignComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["reassign_note"]

    def validate_reassign_note(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Minimum 10 characters required")
        return value

    def update(self, instance, validated_data):
        
        if instance.status not in ["ESCALATED", "IN_PROGRESS"]:
            raise serializers.ValidationError(
                f"cannot reassign from {instance.status}"
            )
        
        
        instance.status = "PENDING"
        instance.reassign_note = validated_data.get("reassign_note")

        instance.save()

        ComplaintHistory.objects.create(
            complaint=instance,
            action="REASSIGNED",
            performed_by=self.context["request"].user,
            note=instance.reassign_note
        )

        return instance
        
            