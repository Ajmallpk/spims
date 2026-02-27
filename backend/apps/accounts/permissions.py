from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()


class IsCitizen(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.CITIZEN and
            request.user.status == User.Status.ACTIVE
        )


class IsWard(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.WARD
        )


class IsActiveWard(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.WARD and
            request.user.status == User.Status.ACTIVE
        )


class IsPanchayath(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.PANCHAYATH
        )


class IsActivePanchayath(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.PANCHAYATH and
            request.user.status == User.Status.ACTIVE
        )


class IsActiveUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.status == User.Status.ACTIVE
        )