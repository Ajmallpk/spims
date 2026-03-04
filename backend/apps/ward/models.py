# from django.db import models
# from django.contrib.auth import get_user_model
# # Create your models here.

# User = get_user_model()

# class WardVerification(models.Model):

#     STATUS_CHOICES = (
#         ("PENDING", "Pending"),
#         ("APPROVED", "Approved"),
#         ("REJECTED", "Rejected"),
#     )

#     user = models.OneToOneField(
#         User,
#         on_delete=models.CASCADE,
#         related_name="ward_verification"
#     )

#     panchayath = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="wards"
#     )

#     officer_full_name = models.CharField(max_length=255)
#     official_email = models.EmailField()
#     official_contact = models.CharField(max_length=15)
#     ward_name = models.CharField(max_length=255)
#     office_address = models.TextField()
#     aadhaar_image = models.ImageField(upload_to="ward/aadhaar/")
#     selfie_image = models.ImageField(upload_to="ward/selfie/")
#     supporting_document = models.FileField(
#         upload_to="ward/supporting/",
#         null=True,
#         blank=True
#     )

#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default="PENDING"
#     )

#     reject_reason = models.TextField(blank=True, null=True)
#     reviewed_at = models.DateTimeField(null=True, blank=True)
#     submitted_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.officer_full_name} - {self.status}"



from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class WardVerification(models.Model):

    class Status(models.TextChoices):
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
    )

    officer_full_name = models.CharField(max_length=255)
    official_email = models.EmailField()
    official_contact = models.CharField(max_length=15)

    ward_name = models.CharField(max_length=255)
    office_address = models.TextField()

    aadhaar_image = models.ImageField(upload_to="ward/aadhaar/")
    selfie_image = models.ImageField(upload_to="ward/selfie/")
    supporting_document = models.FileField(
        upload_to="ward/supporting/",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    reject_reason = models.TextField(blank=True, null=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.user.role != User.Role.WARD:
            raise ValidationError("User must have WARD role.")

        if self.panchayath.role != User.Role.PANCHAYATH:
            raise ValidationError("Selected user must have PANCHAYATH role.")

    def __str__(self):
        return f"{self.ward_name} - {self.status}"