from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField
from apps.accounts.models import District, Panchayath
User = get_user_model()


class PanchayathVerification(models.Model):
    STATUS_CHOICES =(
        ("PENDING","Pending"),
        ("APPROVED","Approved"),
        ("REJECTED","Rejected")
    )
    
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
        resource_type="image"
    )

    selfie_image = CloudinaryField(
        resource_type="image"
    )
    
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="PENDING")
    reject_reason = models.TextField(blank=True,null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.panchayath_name}-{self.status}"
    
    
    
    
