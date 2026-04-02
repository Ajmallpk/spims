from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PanchayathVerification
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=PanchayathVerification)
def update_user_on_verification(sender, instance, **kwargs):

    if instance.status == "APPROVED":
        user = instance.user
        user.status = User.Status.ACTIVE
        user.is_verified = True
        user.save()