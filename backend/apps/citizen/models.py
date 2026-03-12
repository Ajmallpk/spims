from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class CitizenVerification(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="citizen_verification"
    )

    ward = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ward_citizens",
        limit_choices_to={"role": "WARD"}
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    house_number = models.CharField(max_length=10)
    street_name = models.CharField(max_length=50)

    aadhaar_image = models.ImageField(upload_to="citizen/aadhaar/")
    selfie_image = models.ImageField(upload_to="citizen/selfie/")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    reject_reason = models.TextField(null=True, blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["ward"]),
            models.Index(fields=["status"]),
        ]

    def clean(self):
        if self.ward.role != "WARD":
            raise ValidationError("Citizen must belong to a Ward user.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {self.status}"
    
    
    
from django.db import models
from django.conf import settings


class CitizenProfile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="citizen_profile"
    )

    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    ward_name = models.CharField(max_length=50, blank=True)
    house_number = models.CharField(max_length=20, blank=True)
    street_name = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)

    profile_image = models.ImageField(
        upload_to="citizen/profile/",
        null=True,
        blank=True
    )

    bio = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)