from django.db import models
from django.conf import settings
# Create your models here.


class BlockVerification(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="block_verification"
        
    )
    
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    block_name = models.CharField(max_length=20)
    district = models.CharField(max_length=20)
    aadhaar_image = models.ImageField(upload_to="block_verification/aadhaar_id/")
    appointment_letter = models.FileField(upload_to="block_verification/appointment_letters/")
    live_selfie = models.ImageField(upload_to="block_verification/selfies/")
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Verification - {self.user.email}"