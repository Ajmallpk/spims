from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings


User = get_user_model()


class Complaint(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
        ("REJECTED", "Rejected"),
        ("ESCALATED", "Escalated"),
    ]

    CATEGORY_CHOICES = [
        ("ROAD", "Road Issue"),
        ("WATER", "Water Issue"),
        ("ELECTRICITY", "Electricity"),
        ("WASTE", "Waste Management"),
        ("OTHER", "Other"),
    ]

    citizen = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="citizen_complaints",
        limit_choices_to={"role": "CITIZEN"}
    )

    ward = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ward_complaints",
        limit_choices_to={"role": "WARD"}
    )

    panchayath = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="panchayath_complaints",
        limit_choices_to={"role": "PANCHAYATH"},
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    location = models.CharField(max_length=255)

    image_proof = models.ImageField(
        upload_to="complaints/images/",
        blank=True,
        null=True
    )

    video_proof = models.FileField(
        upload_to="complaints/videos/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    
    
    escalation_reason = models.TextField(null=True, blank=True)
    
    reassign_note = models.TextField(null=True, blank=True)

    chat_closed = models.BooleanField(default=False)

    resolved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)
    
    is_reassigned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.status}"
    
    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["ward"]),
            models.Index(fields=["panchayath"]),
            models.Index(fields=["created_at"]),
        ]
    
    
    
    
class ComplaintUpvote(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="upvotes"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("complaint", "user")

    def __str__(self):
        return f"{self.user} upvoted {self.complaint.id}"
    
    class Meta:
        unique_together = ("complaint", "user")
        indexes = [
            models.Index(fields=["complaint"]),
        ]
    
    
    
    
    
class ComplaintComment(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.complaint.id}"
    
    
    
class ComplaintChat(models.Model):

    complaint = models.OneToOneField(
        Complaint,
        on_delete=models.CASCADE,
        related_name="chat"
    )

    citizen = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="citizen_chats"
    )

    authority = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="authority_chats",
        limit_choices_to={"role__in": ["WARD", "PANCHAYATH"]}
    )

    is_closed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat for Complaint {self.complaint.id}"
    
    
    
    
    
class ComplaintChatMessage(models.Model):

    chat = models.ForeignKey(
        ComplaintChat,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message by {self.sender}"
    
    
class ComplaintResolution(models.Model):

    complaint = models.OneToOneField(
        Complaint,
        on_delete=models.CASCADE,
        related_name="resolution"
    )

    authority = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resolved_complaints"
    )

    message = models.TextField()

    proof_image = models.ImageField(
        upload_to="complaints/resolution_images/",
        blank=True,
        null=True
    )

    proof_video = models.FileField(
        upload_to="complaints/resolution_videos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resolution for Complaint {self.complaint.id}"
    
    

class Notification(models.Model):

    TYPE_CHOICES = [
        ("COMMENT", "Comment"),
        ("UPVOTE", "Upvote"),
        ("RESOLUTION", "Resolution"),
        ("CHAT", "Chat Message"),
        ("ESCALATION", "Escalation"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    message = models.CharField(max_length=255)

    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user}"
    
    
    
    
    
class ComplaintHistory(models.Model):
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="history"
    )
    
    action = models.CharField(max_length=50)
    
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null = True
    )
    
    note = models.TextField(null=True,blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.action}-{self.complaint.id}"
    
    

class ComplaintMedia(models.Model):
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="media"
    )
    
    file = models.FileField(upload_to="complaints/media/")
    
    file_type  = models.CharField(
        max_length= 10,
        choices=[
            ("IMAGE","Image"),
            ("VIDEO","Video")
        ]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class ResolutionMedia(models.Model):
    resolution = models.ForeignKey(
        ComplaintResolution,
        on_delete=models.CASCADE,
        related_name="media"
    ) 
    
    file = models.FileField(upload_to="complaint/resolution_media/")
    
    file_type = models.CharField(
        max_length=10,
        choices=[
            ("IMAGE","Image"),
            ("VIDEO","Video")
        ]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    