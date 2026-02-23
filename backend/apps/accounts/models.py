from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    
    
    email = models.EmailField(unique=True)
    
    ROLE_CHOICES = (
        ('CITIZEN','Citizen'),
        ('WARD','Ward'),
        ('PANCHAYATH','Panchayath'),
        ('BLOCK','Block'),
    )
    
    STATUS_CHOICES = (
        ('PENDING','Pending'),
        ('ACTIVE','Active'),
        ('SUSPENDED','Suspended'),
    )
    
    role = models.CharField(
        max_length=50,
        choices = ROLE_CHOICES,
        default='CITIZEN'
    )
    
    status = models.CharField(
        max_length=50,
        choices = STATUS_CHOICES,
        default='PENDING',
    )
    
    is_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    
    def __str__(self):
        return self.email