from django.db import models
from apps.complaints.models import Complaint
from django.contrib.auth import get_user_model
import uuid
import os
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
from cloudinary.models import CloudinaryField
# Create your models here.


User = get_user_model()



class Chat(models.Model):
    
    CHAT_TYPE_CHOICES = [
        ("COMPLAINT","Complaint chat"),
        ("AUTHORITY","Authority chat"),
    ]
    
    
    chat_type = models.CharField(max_length=20,choices=CHAT_TYPE_CHOICES)
    
    complaint = models.OneToOneField(
        Complaint,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="chat_room"
    )
    
    
    citizen = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="citizen_chats"
    )
    
    
    authority = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="authority_chats"
    )
    
    
    sender_authority = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="send_authority_chats"
    )
    
    
    
    receiver_authority = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="received_authority_chats"
    )
    
    is_closed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        if self.chat_type == "COMPLAINT":
            return f"Complaint chat {self.complaint.id}"
        return f"Authority Chat {self.id}"
    


def chat_file_upload_path(instance, filename):

    extension = os.path.splitext(
        filename
    )[1]

    random_filename = f"{uuid.uuid4()}{extension}"

    return os.path.join(
        "chat_files",
        random_filename
    )
    
    
    
    
    
    
class Message(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages",
        
    )
    
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    
    message = models.TextField(blank=True)
    
    reply_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies"
    )
    
    is_forwarded = models.BooleanField(
        default=False
    )

    forwarded_from = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="forwarded_messages"
    )
    
    # file = models.FileField(
    # upload_to=chat_file_upload_path,
    # null=True,
    # blank=True
    # )
    
    file = CloudinaryField(
        resource_type="auto",
        null=True,
        blank=True
    )
    
    # thumbnail = models.ImageField(
    #     upload_to="chat_thumbnails/",
    #     null=True,
    #     blank=True
    # )

    thumbnail = CloudinaryField(
        resource_type="image",
        null=True,
        blank=True
    )
    
    
    file_type = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )
    
    
    voice_duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duration in seconds"
    )
    
    is_read = models.BooleanField(default=False)

    read_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    is_deleted = models.BooleanField(
        default=False
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    is_delivered = models.BooleanField(default=False)

    delivered_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    
    class Meta:

        indexes = [

            models.Index(
                fields=["chat"]
            ),

            models.Index(
                fields=["created_at"]
            ),

            models.Index(
                fields=[
                    "chat",
                    "is_read",
                    ]
            ),

            models.Index(
                fields=["is_deleted"]
            ),

            models.Index(
                fields=["file_type"]
            ),
            
            
        ]
        
        
        
    