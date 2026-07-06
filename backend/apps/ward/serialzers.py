from rest_framework import serializers
from django.utils import timezone
from apps.complaints.models import Complaint,ComplaintHistory
from apps.complaints.utils import can_change_status
from apps.notification.models import Notification
from .models import WardVerification
from apps.accounts.models import District, Panchayath, Ward
from apps.complaints.serializers import HoldComplaintSerializer
    
class EscalateComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["escalation_reason"]
        
    def validate_escalation_reason(self,value):
        if len(value.strip()) < 10 :
            raise serializers.ValidationError("Minimum 10 charecters requeired")
        
        return value
    
    def update(self,instance,validated_date):
        if not can_change_status(instance.status,"ESCALATED"):
            raise serializers.ValidationError(
                f"Cannot escalate from {instance.status}"
            )
        
        
        instance.status = "ESCALATED"
        instance.escalation_reason = validated_date.get("escalation_reason")
        instance.save()
        
        ComplaintHistory.objects.create(
            complaint=instance,
            action="ESCALATED",
            performed_by=self.context["request"].user,
            note=instance.escalation_reason
        )
        
        if instance.panchayath:
            Notification.objects.create(
                user=instance.panchayath,
                complaint = instance,
                message = "A complaint has been escalated to you ",
                notification_type = "ESCALATION"
            )
        return instance
    
    
    
    
    
class WardVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WardVerification
        fields = [
            "officer_full_name",

            "district",

            "panchayath_master",

            "ward_master",

            "official_email",

            "official_contact",

            "office_address",

            "aadhaar_image",

            "selfie_image",

            "supporting_document",
        ]
        
    def validate(self, attrs):

        district = attrs.get("district")
        panchayath = attrs.get("panchayath_master")
        ward = attrs.get("ward_master")

        if panchayath and district:

            if panchayath.district_id != district.id:
                raise serializers.ValidationError({
                    "panchayath_master":
                    "Selected Panchayath doesn't belong to selected District."
                })

        if ward and panchayath:

            if ward.panchayath_id != panchayath.id:
                raise serializers.ValidationError({
                    "ward_master":
                    "Selected Ward doesn't belong to selected Panchayath."
                })

        return attrs
    
    
    
    