from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = User.EMAIL_FIELD
    role = serializers.CharField(required=False)

    # def validate(self, attrs):

    #     requested_role = attrs.get("role")

    #     data = super().validate(attrs)
    #     user = self.user
    #     if user.is_locked():
    #         raise serializers.ValidationError("Account temporarily locked")

    #     if requested_role:
    #         if user.is_superuser:
    #             if requested_role != "ADMIN":
    #                 raise serializers.ValidationError("Invalid role selected")
    #         else:
    #             if requested_role != user.role:
    #                 raise serializers.ValidationError("Invalid role selected")

    #     if user.status in [User.Status.SUSPENDED, User.Status.REJECTED]:
    #         raise serializers.ValidationError("Account is suspended or rejected")

    #     data["role"] = "ADMIN" if user.is_superuser else user.role
    #     data["status"] = user.status
    #     data["is_superuser"] = user.is_superuser
    #     data["is_verified"] = user.is_verified

    #     return data
    
    def validate(self, attrs):

        try:
            data = super().validate(attrs)
        except Exception:
            raise serializers.ValidationError({
                "error": "Invalid email or password"
            })

        user = self.user
        requested_role = attrs.get("role")

        if user.is_locked():
            raise serializers.ValidationError({
                "error": "Account temporarily locked"
            })

        if requested_role:
            if user.is_superuser:
                if requested_role != "ADMIN":
                    raise serializers.ValidationError({
                        "error": "Invalid role selected"
                    })
            else:
                if requested_role != user.role:
                    raise serializers.ValidationError({
                        "error": "Invalid role selected"
                    })

        if user.status in [User.Status.SUSPENDED, User.Status.REJECTED]:
            raise serializers.ValidationError({
                "error": "ACCOUNT_SUSPENDED",
                "message": "Your account has been suspended."
            })
        data["role"] = "ADMIN" if user.is_superuser else user.role
        data["status"] = user.status
        data["is_superuser"] = user.is_superuser
        data["is_verified"] = user.is_verified

        return data