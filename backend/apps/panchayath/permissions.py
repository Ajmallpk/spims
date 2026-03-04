from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()


class IsPanchayath(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.PANCHAYATH
        )


class IsActivePanchayath(BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False
        user = User.objects.get(id=request.user.id)
        return (
            user.role == User.Role.PANCHAYATH
            and user.status == User.Status.ACTIVE
            and user.is_verified is True
        )
        
        
