from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.accounts.models import LocationRequest
from apps.accounts.models import (
    District,
    Panchayath,
    User,
)

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
    
    
    
class LocationRequestListSerializer(serializers.ModelSerializer):

    requested_by = serializers.CharField(
        source="requested_by.username",
        read_only=True
    )

    role = serializers.CharField(
        source="requested_by.role",
        read_only=True
    )

    class Meta:
        model = LocationRequest
        fields = [
            "id",
            "request_type",
            "district_name",
            "panchayath_name",
            "ward_number",
            "ward_name",
            "message",
            "status",
            "admin_note",
            "requested_by",
            "role",
            "created_at",
        ]
        
        
class CreatePanchayathSerializer(
    serializers.Serializer
):

    district_id = serializers.IntegerField()

    panchayath_id = serializers.IntegerField()

    official_email = serializers.EmailField()

    official_phone = serializers.CharField(
        max_length=15
    )

    officer_personal_email = serializers.EmailField()
    
    role = serializers.CharField(
        default="PANCHAYATH",
        read_only=True
    )

    def validate(self, attrs):

        district = District.objects.filter(
            id=attrs["district_id"]
        ).first()

        if not district:
            raise serializers.ValidationError(
                "District not found."
            )

        panchayath = Panchayath.objects.filter(
            id=attrs["panchayath_id"],
            district=district
        ).first()

        if not panchayath:
            raise serializers.ValidationError(
                "Invalid Panchayath."
            )

        if User.objects.filter(
            email=attrs["official_email"]
        ).exists():

            raise serializers.ValidationError(
                "Official email already exists."
            )

        if User.objects.filter(
            role=User.Role.PANCHAYATH,
            panchayath=panchayath
        ).exists():

            raise serializers.ValidationError(
                "This Panchayath already has an office account."
            )

        attrs["district"] = district
        attrs["panchayath"] = panchayath

        return attrs
    
    
    
class AuthorityPanchayathListSerializer(serializers.ModelSerializer):

    district = serializers.CharField(
        source="district.name",
        read_only=True
    )

    panchayath = serializers.CharField(
        source="panchayath.name",
        read_only=True
    )

    official_email = serializers.EmailField(
        source="email",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "district",
            "panchayath",
            "official_email",
            "official_phone",
            "officer_personal_email",
            "status",
            "is_verified",
        ]