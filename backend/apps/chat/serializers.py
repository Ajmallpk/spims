from rest_framework import serializers
from .models import Message,Chat



class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.IntegerField(
        source="sender.id",
        read_only=True
    )
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    reply_data = serializers.SerializerMethodField()
    display_message = serializers.SerializerMethodField()
    forwarded_from = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = [
            "id",
            "sender"
            "sender_name",
            "display_message",
            "reply_data",
            "file",
            "file_type",
            "voice_duration",
            "file_url",
            "thumbnail_url",
            "is_delivered",
            "delivered_at",
            "is_read",
            "read_at",
            "created_at",
            "is_deleted",
            "deleted_at",
            "is_forwarded",
            "forwarded_from",
        ]
        
        
    def get_file_url(self, obj):

        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.file.url
            )

        return obj.file.url
    
    
    def get_thumbnail_url(self, obj):

        if obj.thumbnail:
            return obj.thumbnail.url

        return None
    
    
    
    def get_reply_data(self, obj):

        if not obj.reply_to:
            return None
        
        
        reply_message = obj.reply_to.message

        if obj.reply_to.is_deleted:
            reply_message = "This message was deleted"

        return {
            "id": obj.reply_to.id,
            "sender": obj.reply_to.sender.username,
            "message": reply_message,
        }
        
        
    def get_display_message(self, obj):

        if obj.is_deleted:
            return "This message was deleted"

        return obj.message
    
    
    def get_forwarded_from(self, obj):

        if not obj.forwarded_from:
            return None

        return obj.forwarded_from.username
        
        
        
class ChatListSerializer(serializers.ModelSerializer):

    complaint_title = serializers.CharField(
        source="complaint.title",
        read_only=True
    )

    last_message = serializers.SerializerMethodField()
    unread_count = serializers.IntegerField(
    read_only=True
    )
    chat_user = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "complaint",
            "complaint_title",
            "chat_user",
            "is_closed",
            "last_message",
            "unread_count",
            "created_at",
            
        ]

    def get_last_message(self, obj):
        latest_messages = getattr(
            obj,
            "latest_message",
            []
        )

        last_msg = (
            latest_messages[0]
            if latest_messages
            else None
        )

        if not last_msg:
            return None

        return {
            "sender": last_msg.sender.username,
            "message": last_msg.message,
            "created_at": last_msg.created_at
        }
        
    def get_chat_user(self, obj):

        request = self.context.get("request")

        if not request:
            return None

        user = request.user

        if obj.chat_type == "COMPLAINT":

            if user == obj.citizen:
                return obj.authority.username

            return obj.citizen.username

        if obj.chat_type == "AUTHORITY":

            if user == obj.sender_authority:
                return obj.receiver_authority.username

            return obj.sender_authority.username

        return None
        
        

        
        
        
