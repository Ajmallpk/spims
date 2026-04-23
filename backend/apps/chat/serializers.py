from rest_framework import serializers
from .models import Message,Chat



class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender_name",
            "message",
            "created_at",
        ]
        
        
        
class ChatListSerializer(serializers.ModelSerializer):

    complaint_title = serializers.CharField(
        source="complaint.title",
        read_only=True
    )

    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "complaint",
            "complaint_title",
            "is_closed",
            "last_message",
            "created_at",
        ]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-created_at").first()

        if not last_msg:
            return None

        return {
            "sender": last_msg.sender.username,
            "message": last_msg.message,
            "created_at": last_msg.created_at
        }