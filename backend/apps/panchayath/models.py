from django.db import models
from django.conf import settings

# Create your models here.
class PanchayathVerification(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="panchayath_verification"
    )

    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)

    aadhaar_image = models.ImageField(
        upload_to="panchayath_verification/aadhaar_images/"
    )

    appointment_letter = models.FileField(
        upload_to="panchayath_verification/appointment_letters/"
    )
    
    live_selfie = models.ImageField(
        upload_to="panchayath_verification/selfies/"
    )

    approved = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    rejection_reason = models.TextField(null=True, blank=True)

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reviewed_panchayaths"
    )

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Panchayath Verification - {self.user.email}"