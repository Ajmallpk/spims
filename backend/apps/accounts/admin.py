
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin configuration for SPIMS User model.
    """

    model = User

    list_display = (
        "email",
        "username",
        "role",
        "status",
        "is_verified",
        "is_staff",
    )

    list_filter = (
        "role",
        "status",
        "is_verified",
    )

    fieldsets = UserAdmin.fieldsets + (
        ("SPIMS Role Info", {
            "fields": ("role", "status", "is_verified"),
        }),
    )