from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = User.EMAIL_FIELD   # 🔥 THIS IS THE REAL FIX

    role = serializers.CharField(required=False)

    def validate(self, attrs):

        requested_role = attrs.get("role")

        # Let SimpleJWT handle authentication using email automatically
        data = super().validate(attrs)

        user = self.user

        # Role validation
        if requested_role and requested_role != user.role:
            raise serializers.ValidationError("Invalid role selected")

        data["role"] = user.role
        data["status"] = user.status
        data["username"] = user.username

        return data