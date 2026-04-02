from rest_framework import serializers
from django.utils import timezone
from apps.complaints.models import Complaint,ComplaintHistory
from apps.complaints.utils import can_change_status
from apps.complaints.models import Notification


# class ResolveComplaintSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Complaint
#         fields = ["resolution_description","image_proof"]
        
#     def validate_resolution_description(self,value):
#         if len(value.strip()) < 10:
#             raise serializers.ValidationError("Minimum 10 charecters requeired")
        
#         return value
    
#     def update(self,instance,validated_data):
#         if not can_change_status(instance.status,"RESOLVED"):
#             raise serializers.ValidationError(
#                 f"Cannot resolve from {instance.status}"
#             )
            
#         instance.status = "RESOLVED"
#         instance.resolution_description = validated_data.get("resolution_description")
#         instance.image_proof = validated_data.get("image_proof",instance.image_proof)
#         instance.resolved_at = timezone.now()
#         instance.chat_closed = True
        
#         instance.save()
        
#         ComplaintHistory.objects.create(
#             complaint=instance,
#             action="RESOLVED",
#             performed_by=self.context["request"].user,
#             note=instance.resolution_description
#         )
#         return instance
    
    
    
    
    
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
    
    
    
    