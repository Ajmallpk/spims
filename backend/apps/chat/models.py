from django.db import models
from apps.complaints.models import Complaint
from django.contrib.auth import get_user_model

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
    
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    
    
