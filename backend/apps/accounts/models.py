from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.db.models import UniqueConstraint


class User(AbstractUser):

    class Role(models.TextChoices):
        CITIZEN = "CITIZEN", "Citizen"
        WARD = "WARD", "Ward"
        PANCHAYATH = "PANCHAYATH", "Panchayath"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ACTIVE = "ACTIVE", "Active"
        SUSPENDED = "SUSPENDED", "Suspended"
        REJECTED = "REJECTED", "Rejected"

    email = models.EmailField(unique=True, db_index=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CITIZEN,
        db_index=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True
    )
    
    
    is_online = models.BooleanField(
        default=False
    )

    last_seen = models.DateTimeField(
        null=True,
        blank=True
    )

    is_verified = models.BooleanField(default=False)

    
    failed_attempts = models.IntegerField(default=0)
    lock_until = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def is_locked(self):
        if self.lock_until and self.lock_until > timezone.now():
            return True
        return False

    def __str__(self):
        return self.email
    
    
    
# ==========================================================
# Kerala Location Master Tables
# ==========================================================

class District(models.Model):
    code = models.CharField(
    max_length=20,
    unique=True,
    blank=True,
    null=True
    )

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Panchayath(models.Model):
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="panchayaths"
    )
    
    code = models.CharField(
        max_length=30,
        unique=True,
        null=True,
        blank=True
    )     
    
    
    
    html_page = models.URLField(
        max_length=500,
        blank=True,
        null=True
    )  

    name = models.CharField(max_length=150)

    class Meta:
        ordering = ["name"]
        constraints = [
            UniqueConstraint(
                fields=["district", "name"],
                name="unique_panchayath_per_district"
            )
        ]

    def __str__(self):
        return self.name


class Ward(models.Model):
    panchayath = models.ForeignKey(
        Panchayath,
        on_delete=models.CASCADE,
        related_name="wards"
    )
    
    
    
    code = models.CharField(
        max_length=40,
        unique=True,
        blank=True,
        null=True
    )

    ward_number = models.PositiveIntegerField()

    ward_name = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["ward_number"]
        constraints = [
            UniqueConstraint(
                fields=["panchayath", "ward_number"],
                name="unique_ward_per_panchayath"
            )
        ]

    def __str__(self):
        if self.ward_name:
            return f"Ward {self.ward_number} - {self.ward_name}"
        return f"Ward {self.ward_number}"
    
    
    
 # ==========================================================
# Location Request
# ==========================================================

class LocationRequest(models.Model):

    class RequestType(models.TextChoices):
        DISTRICT = "DISTRICT", "District"
        PANCHAYATH = "PANCHAYATH", "Panchayath"
        WARD = "WARD", "Ward"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        HOLD = "HOLD", "On Hold"
        COMPLETED = "COMPLETED", "Completed"
        REJECTED = "REJECTED", "Rejected"

    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="location_requests"
    )

    request_type = models.CharField(
        max_length=20,
        choices=RequestType.choices
    )

    district_name = models.CharField(
        max_length=150,
        blank=True
    )

    panchayath_name = models.CharField(
        max_length=150,
        blank=True
    )

    ward_number = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    ward_name = models.CharField(
        max_length=150,
        blank=True
    )

    message = models.TextField(
        blank=True
    )

    admin_note = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.request_type} - {self.requested_by.email}"