from django.db import models
from django.contrib.auth import get_user_model

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
    
    panchayath_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    district = models.CharField(max_length=100)
    
    aadhaar_image = models.ImageField(upload_to="panchayath/aadhaar/")
    selfie_image = models.ImageField(upload_to="panchayath/selfie/")
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="PENDING")
    reject_reason = models.TextField(blank=True,null=True)
    
    def __str__(self):
        return f"{self.panchayath_name}-{self.status}"
    
    
    
    
    