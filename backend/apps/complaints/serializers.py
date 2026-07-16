from rest_framework import serializers
from .models import Complaint,ComplaintComment,ComplaintResolution,ComplaintHistory,ComplaintMedia,ResolutionMedia
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.notification.models import Notification
from apps.accounts.models import Ward
from apps.notification.utils import send_notification
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
        if not Ward.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid ward.")
        return value
    

class ComplaintMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    
    class Meta:
        model = ComplaintMedia
        fields = ["id","file","file_type"]
        
        
    def get_file(self, obj):

        if obj.file:

            return obj.file.url

        return None
        
        
        
        
class ResolutionMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    class Meta:
        model = ResolutionMedia
        fields = ["id", "file", "file_type"]
        
        
    def get_file(self, obj):

        if obj.file:

            return obj.file.url

        return None
        
    
        

class ComplaintResolutionSerializer(serializers.ModelSerializer):

    authority_name = serializers.CharField(source="authority.username", read_only=True)
    media = ResolutionMediaSerializer(many=True, read_only=True)
    proof_image = serializers.SerializerMethodField()
    proof_video = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintResolution
        fields = [
            "id",
            "authority_name",
            "message",
            "proof_image",
            "proof_video",
            "created_at",
            "media",
        ]
        
    def get_proof_image(self, obj):

        if obj.proof_image:

            return obj.proof_image.url

        return None


    def get_proof_video(self, obj):

        if obj.proof_video:

            return obj.proof_video.url

        return None
    
    
class ComplaintFeedSerializer(serializers.ModelSerializer):

    citizen_name = serializers.CharField(source="citizen.username")
    ward_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    district = serializers.IntegerField(
        source="ward.panchayath.district.id",
        read_only=True
    )
    image_proof = serializers.SerializerMethodField()
    video_proof = serializers.SerializerMethodField()
    upvotes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    media = ComplaintMediaSerializer(many=True, read_only=True)
    resolution = ComplaintResolutionSerializer(read_only=True)
    panchayath_name = serializers.CharField(
        source="panchayath.username",
        read_only=True
    )
    
    hold_by_name = serializers.CharField(
        source="hold_by.username",
        read_only=True
    )

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
            "hold_reason",
            "hold_at",
            "hold_by_name",
            "citizen_name",
            "district",
            "district_name",
            "ward_name",
            "panchayath_name",
            "ward",
            "upvotes_count",
            "comments_count",
            "created_at",
            "media",
            "resolution",
        ]
        
    def get_image_proof(self, obj):

        if obj.image_proof:

            return obj.image_proof.url

        return None


    def get_video_proof(self, obj):

        if obj.video_proof:

            return obj.video_proof.url

        return None
    
    
    def get_ward_name(self, obj):
        if obj.ward.ward_name:
            return obj.ward.ward_name

        return f"Ward {obj.ward.ward_number}"
    
    
    def get_district_name(self, obj):
        return obj.ward.panchayath.district.name

    
    
class ComplaintCommentSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(source="user.username", read_only=True)
    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True
    )
    reply_to = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintComment
        fields = [
            "id",
            "comment",
            "user_name",
            "user_id",
            "created_at",
            "parent",
            "reply_to",
            "replies",
        ]

    def get_replies(self, obj):

        replies = obj.replies.all().order_by(
            "created_at"
        )

        return ComplaintCommentSerializer(
            replies,
            many=True
        ).data
    
    def get_reply_to(self, obj):

        if obj.reply_to_user:
            return {
                "user_name": obj.reply_to_user.username
            }

        return None
        
        
          

class ComplaintDetailSerializer(serializers.ModelSerializer):

    citizen_name = serializers.CharField(source="citizen.username", read_only=True)
    ward_name = serializers.SerializerMethodField()
    image_proof = serializers.SerializerMethodField()
    video_proof = serializers.SerializerMethodField()
    upvotes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    resolution = ComplaintResolutionSerializer(read_only=True)
    media = ComplaintMediaSerializer(many=True, read_only=True)
    hold_by_name = serializers.CharField(
        source="hold_by.username",
        read_only=True
    )

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
            "hold_reason",
            "hold_at",
            "hold_by_name",
            "citizen_name",
            "ward_name",
            "created_at",
            "upvotes_count",
            "comments_count",
            "resolution",
            "media",
        ]

    def get_upvotes_count(self, obj):
        return obj.upvotes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    
    def get_image_proof(self, obj):

        if obj.image_proof:

            return obj.image_proof.url

        return None


    def get_video_proof(self, obj):

        if obj.video_proof:

            return obj.video_proof.url

        return None
    
    def get_ward_name(self, obj):
        if obj.ward.ward_name:
            return obj.ward.ward_name

        return f"Ward {obj.ward.ward_number}"
    
    

        
    
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
        
        


class UpdateComplaintStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = ["status"]

    def validate_status(self, value):
        allowed_status = dict(Complaint.STATUS_CHOICES).keys()

        if value not in allowed_status:
            raise serializers.ValidationError("Invalid status")

        return value

    def update(self, instance, validated_data):
        request = self.context["request"]
        user = request.user
        new_status = validated_data.get("status")

        
        if user.role == "WARD":
            if instance.assigned_ward_officer != user:
                raise serializers.ValidationError("Not your complaint")

        elif user.role == "PANCHAYATH":
            if instance.panchayath != user:
                raise serializers.ValidationError("Not your complaint")

        else:
            raise serializers.ValidationError("Not allowed")

        
        if new_status == "ESCALATED" and user.role != "WARD":
            raise serializers.ValidationError("Only ward can escalate")

        old_status = instance.status

        
        instance.status = new_status

        if new_status == "RESOLVED":
            instance.resolved_at = timezone.now()

        instance.save()

        
        ComplaintHistory.objects.create(
            complaint=instance,
            action="STATUS_CHANGED",
            performed_by=user,
            note=f"{old_status} → {new_status}"
        )

        return instance
    
    
    
class ComplaintUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            "title",
            "description",
            "category",
            "location",
            "image_proof",
            "video_proof",
        ]
        
    def validate(self, data):
        if self.instance.status in ["RESOLVED", "ESCALATED"]:
            raise serializers.ValidationError("Cannot edit this complaint in the status of 'RESOLVE' or 'ESCALATED' ")
        return data
    
    
    
class HoldComplaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = ["hold_reason"]


    def validate_hold_reason(self, value):

        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Minimum 10 characters required."
            )

        return value


    def update(self, instance, validated_data):

        request = self.context["request"]
        user = request.user

        # Ward can only hold their own complaint
        if user.role == "WARD":

            if instance.assigned_ward_officer != user:
                raise serializers.ValidationError(
                    "Not your complaint."
                )

        # Panchayath can only hold assigned complaint
        elif user.role == "PANCHAYATH":

            if instance.panchayath != user:
                raise serializers.ValidationError(
                    "Not your complaint."
                )

        else:

            raise serializers.ValidationError(
                "Permission denied."
            )


        old_status = instance.status

        instance.status = "HOLD"

        instance.hold_reason = validated_data["hold_reason"]

        instance.hold_by = user

        instance.hold_at = timezone.now()

        instance.save()
        
        
        


        ComplaintHistory.objects.create(

            complaint=instance,

            action="HOLD",

            performed_by=user,

            note=instance.hold_reason

        )

        send_notification(
            user=instance.citizen,
            sender=user,
            complaint=instance,
            title="Complaint On Hold",
            message=f"Your complaint has been put on hold.\nReason: {instance.hold_reason}",
            n_type="COMPLAINT_STATUS",
        )

        return instance
    



class ResumeComplaintSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint
        fields = []

    def update(self, instance, validated_data):

        request = self.context["request"]
        user = request.user

        if user.role == "WARD":

            if instance.assigned_ward_officer != user:
                raise serializers.ValidationError("Not your complaint.")

        elif user.role == "PANCHAYATH":

            if instance.panchayath != user:
                raise serializers.ValidationError("Not your complaint.")

        else:
            raise serializers.ValidationError("Permission denied.")

        if instance.status != "HOLD":
            raise serializers.ValidationError("Complaint is not on hold.")

        instance.status = "IN_PROGRESS"

        instance.hold_reason = None
        instance.hold_by = None
        instance.hold_at = None

        instance.save()

        ComplaintHistory.objects.create(
            complaint=instance,
            action="RESUMED",
            performed_by=user,
            note="Complaint resumed."
        )

        send_notification(
            user=instance.citizen,
            sender=user,
            complaint=instance,
            title="Complaint Resumed",
            message="Work on your complaint has resumed.",
            n_type="COMPLAINT_STATUS",
        )

        return instance
