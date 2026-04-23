from django.db import models
from django.contrib.auth import get_user_model
from apps.complaints.models import Complaint



# Create your models here.
User = get_user_model()




class Notification(models.Model):

    TYPE_CHOICES = [
        ("COMPLAINT_STATUS", "Complaint Status"),
        ("UPVOTE", "Upvote"),
        ("COMMENT", "Comment"),
        ("REPLY", "Reply"),
        ("CHAT", "Chat Message"),

        ("CITIZEN_VERIFICATION", "Citizen Verification"),
        ("WARD_VERIFICATION", "Ward Verification"),
        ("PANCHAYATH_VERIFICATION", "Panchayath Verification"),

        ("ESCALATION", "Escalation"),
        ("REASSIGN", "Reassign"),
        ("RESOLUTION", "Resolution"),

        ("ALERT", "System Alert"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_notifications"
    )

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255,default="Notification")
    message = models.TextField()

    notification_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES
    )

    is_read = models.BooleanField(default=False)

    extra_data = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.notification_type}"