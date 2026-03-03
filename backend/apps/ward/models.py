from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class WardVerification(models.Model):

    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="ward_verification"
    )

    panchayath = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="wards"
    )

    ward_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    district = models.CharField(max_length=100)

    aadhaar_image = models.ImageField(upload_to="ward/aadhaar/")
    selfie_image = models.ImageField(upload_to="ward/selfie/")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    reject_reason = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ward_name} - {self.status}"