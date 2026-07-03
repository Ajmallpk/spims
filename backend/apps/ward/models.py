
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from apps.complaints.models import Complaint
from cloudinary.models import CloudinaryField
from apps.accounts.models import District, Panchayath, Ward

User = get_user_model()


class WardVerification(models.Model):

    class Status(models.TextChoices):
        WAITING_FOR_PANCHAYATH = (
            "WAITING_FOR_PANCHAYATH",
            "Waiting for Panchayath Officer"
        )
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="ward_verification",
        limit_choices_to={"role": User.Role.WARD},
    )

    panchayath = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assigned_wards",
        limit_choices_to={"role": User.Role.PANCHAYATH},
        null=True,
        blank=True
    )
    
    
    
    district = models.ForeignKey(
        District,
        on_delete=models.PROTECT,
        related_name="ward_verifications",
        null=True,
        blank=True
    )

    panchayath_master = models.ForeignKey(
        Panchayath,
        on_delete=models.PROTECT,
        related_name="ward_verifications",
        null=True,
        blank=True
    )

    ward_master = models.ForeignKey(
        Ward,
        on_delete=models.PROTECT,
        related_name="ward_verifications",
        null=True,
        blank=True
    )

    officer_full_name = models.CharField(max_length=255)
    official_email = models.EmailField()
    official_contact = models.CharField(max_length=15)

    ward_name = models.CharField(max_length=255)
    office_address = models.TextField()

    # aadhaar_image = models.ImageField(upload_to="ward/aadhaar/")
    # selfie_image = models.ImageField(upload_to="ward/selfie/")
    # supporting_document = models.FileField(
    #     upload_to="ward/supporting/",
    #     null=True,
    #     blank=True
    # )

    
    aadhaar_image = CloudinaryField(
        resource_type="image"
    )

    selfie_image = CloudinaryField(
        resource_type="image"
    )
    
    
    supporting_document = CloudinaryField(
        resource_type="raw",
        null=True,
        blank=True
    )





    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.PENDING
    )

    reject_reason = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def clean(self):

        if self.user.role != User.Role.WARD:
            raise ValidationError(
                "User must have WARD role."
            )

        if (
            self.status != self.Status.WAITING_FOR_PANCHAYATH
            and not self.panchayath
        ):
            raise ValidationError(
                "Panchayath Officer is required."
            )

        if (
            self.panchayath
            and self.panchayath.role != User.Role.PANCHAYATH
        ):
            raise ValidationError(
                "Selected user must have PANCHAYATH role."
            )
        
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ward_name} - {self.status}"
    
    
    
class EscalationMedia(models.Model):
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="escalation_media"
    )

    # file = models.FileField(upload_to="complaints/escalation_media/")
    
    
    file = CloudinaryField(
        resource_type="auto"
    )

    file_type = models.CharField(
        max_length=10,
        choices=[
            ("IMAGE", "Image"),
            ("VIDEO", "Video")
        ]
    )