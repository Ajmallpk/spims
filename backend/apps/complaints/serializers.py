from rest_framework import serializers
from .models import Complaint,ComplaintComment,ComplaintChatMessage,ComplaintResolution,ComplaintChat,Notification
from django.contrib.auth import get_user_model

User = get_user_model()


class ComplaintCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = [
            "title",
            "description",
            "category",
            "location",
            "ward",
            "image_proof",
            "video_proof",
        ]

    def validate_ward(self, value):
        if value.role != "WARD":
            raise serializers.ValidationError("Invalid ward selected")
        return value
    
    
    
    
class ComplaintFeedSerializer(serializers.ModelSerializer):

    citizen_name = serializers.CharField(source="citizen.username")
    ward_name = serializers.CharField(source="ward.username")

    upvotes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id",
            "title",
            "description",
            "category",
            "location",
            "image_proof",
            "video_proof",
            "status",
            "citizen_name",
            "ward_name",
            "upvotes_count",
            "comments_count",
            "created_at",
        ]

    
    
class ComplaintCommentSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ComplaintComment
        fields = [
            "id",
            "comment",
            "user_name",
            "created_at",
        ]
        
        
class ComplaintChatMessageSerializer(serializers.ModelSerializer):

    sender_name = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = ComplaintChatMessage
        fields = [
            "id",
            "sender_name",
            "message",
            "created_at",
        ]
        
        
class ComplaintResolutionSerializer(serializers.ModelSerializer):

    authority_name = serializers.CharField(source="authority.username", read_only=True)

    class Meta:
        model = ComplaintResolution
        fields = [
            "id",
            "authority_name",
            "message",
            "proof_image",
            "proof_video",
            "created_at",
        ]
        
        


class ComplaintDetailSerializer(serializers.ModelSerializer):

    citizen_name = serializers.CharField(source="citizen.username", read_only=True)
    ward_name = serializers.CharField(source="ward.username", read_only=True)

    upvotes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    resolution = ComplaintResolutionSerializer(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id",
            "title",
            "description",
            "category",
            "location",
            "image_proof",
            "video_proof",
            "status",
            "citizen_name",
            "ward_name",
            "created_at",
            "upvotes_count",
            "comments_count",
            "resolution",
        ]

    def get_upvotes_count(self, obj):
        return obj.upvotes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    
    

class ComplaintChatListSerializer(serializers.ModelSerializer):

    complaint_title = serializers.CharField(source="complaint.title", read_only=True)
    ward_name = serializers.CharField(source="complaint.ward.username", read_only=True)

    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintChat
        fields = [
            "id",
            "complaint",
            "complaint_title",
            "ward_name",
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
            "created_at": last_msg.created_at,
        }
        
        
        
class NotificationSerializer(serializers.ModelSerializer):

    complaint_title = serializers.CharField(
        source="complaint.title",
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "message",
            "notification_type",
            "complaint",
            "complaint_title",
            "is_read",
            "created_at",
        ]