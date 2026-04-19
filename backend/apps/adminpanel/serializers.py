from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminLoginSerializer(TokenObtainPairSerializer):

    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        
        attrs["username"] = attrs.get("email")

        data = super().validate(attrs)

        user = self.user

        if not user.is_superuser:
            raise serializers.ValidationError(
                "You are not authorized as system administrator."
            )

        data["role"] = "ADMIN"
        data["status"] = "ACTIVE"
        data["username"] = user.username

        return data