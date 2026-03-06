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

        user = request.user

        if not user or not user.is_authenticated:
            return False

        return (
            user.role == User.Role.PANCHAYATH
            and user.status == User.Status.ACTIVE
            and user.is_verified
        )
        
        
