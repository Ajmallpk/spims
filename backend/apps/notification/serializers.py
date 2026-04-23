from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", default=None)
    
    
    class Meta:
        model = Notification
        
        fields = [
            
            "id",
            "title",
            "message",
            "notification_type",
            "is_read",
            "created_at",
            "sender_name",
            "complaint",
        ]