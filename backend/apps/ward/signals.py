from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.panchayath.models import PanchayathVerification
from apps.ward.models import WardVerification
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=WardVerification)
def update_ward_user(sender, instance, **kwargs):
    user = instance.user

    if instance.status == "APPROVED":
        user.status = User.Status.ACTIVE
        user.is_verified = True

    elif instance.status == "REJECTED":
        user.status = User.Status.SUSPENDED
        user.is_verified = False

    user.save()