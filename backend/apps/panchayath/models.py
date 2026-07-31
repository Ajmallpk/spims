from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from apps.accounts.models import District, Panchayath
from django.conf import settings

User = get_user_model()


class PanchayathVerification(models.Model):
    class Status(models.TextChoices):
        NOT_SUBMITTED = "NOT_SUBMITTED", "Not Submitted"
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="panchayath_verification"
    )
    
    district_master = models.ForeignKey(
        District,
        on_delete=models.PROTECT,
        related_name="panchayath_verifications",
        null=True,
        blank=True
    )

    panchayath_master = models.ForeignKey(
        Panchayath,
        on_delete=models.PROTECT,
        related_name="verification_requests",
        null=True,
        blank=True
    )
    panchayath_name = models.CharField(max_length=50)
    full_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15,unique=True)
    district = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # aadhaar_image = models.ImageField(upload_to="panchayath/aadhaar/")
    # selfie_image = models.ImageField(upload_to="panchayath/selfie/")
    
    aadhaar_image = CloudinaryField(
        resource_type="image",
        null=True,
        blank=True,
    )

    selfie_image = CloudinaryField(
        resource_type="image",
        null=True,
        blank=True,
    )
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_SUBMITTED,
    )
    reject_reason = models.TextField(blank=True,null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.panchayath_name}-{self.status}"
    
    
    
    



class PanchayathOfficerHistory(models.Model):

    office = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="panchayath_officer_history",
        limit_choices_to={"role": User.Role.PANCHAYATH},
    )

    full_name = models.CharField(
        max_length=255
    )

    official_email = models.EmailField()

    personal_email = models.EmailField(
        blank=True,
        null=True
    )

    official_phone = models.CharField(
        max_length=15
    )

    status = models.CharField(
        max_length=20
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    replaced_at = models.DateTimeField(
        auto_now_add=True
    )

    replaced_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replaced_panchayath_officers"
    )

    replacement_reason = models.TextField(
        blank=True,
        null=True
    )

    snapshot = models.JSONField(
        default=dict
    )

    class Meta:
        ordering = ["-replaced_at"]

    def __str__(self):
        return f"{self.full_name} ({self.official_email})"
