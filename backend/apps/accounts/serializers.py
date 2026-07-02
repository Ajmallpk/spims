from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import District, Panchayath, Ward,LocationRequest

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    
    
# ============================================
# Location Serializers
# ============================================

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ["id", "name"]


class PanchayathSerializer(serializers.ModelSerializer):

    district_name = serializers.CharField(
        source="district.name",
        read_only=True
    )

    class Meta:
        model = Panchayath
        fields = [
            "id",
            "name",
            "district",
            "district_name"
        ]


class WardSerializer(serializers.ModelSerializer):

    panchayath_name = serializers.CharField(
        source="panchayath.name",
        read_only=True
    )

    class Meta:
        model = Ward
        fields = [
            "id",
            "ward_number",
            "ward_name",
            "panchayath",
            "panchayath_name"
        ]
        
        
        
from .models import LocationRequest


class LocationRequestSerializer(serializers.ModelSerializer):
    
    ward_number = serializers.IntegerField(
        required=False,
        allow_null=True
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
            "created_at",
        ]
        
        
    def validate(self, attrs):

        request_type = attrs.get("request_type")

        if request_type == "DISTRICT":
            if not attrs.get("district_name"):
                raise serializers.ValidationError(
                    {
                        "district_name": "District name is required."
                    }
                )

        elif request_type == "PANCHAYATH":

            if not attrs.get("district_name"):
                raise serializers.ValidationError(
                    {
                        "district_name": "District is required."
                    }
                )

            if not attrs.get("panchayath_name"):
                raise serializers.ValidationError(
                    {
                        "panchayath_name": "Panchayath name is required."
                    }
                )

        elif request_type == "WARD":

            if not attrs.get("district_name"):
                raise serializers.ValidationError(
                    {
                        "district_name": "District is required."
                    }
                )

            if not attrs.get("panchayath_name"):
                raise serializers.ValidationError(
                    {
                        "panchayath_name": "Panchayath is required."
                    }
                )

            if not attrs.get("ward_number"):
                raise serializers.ValidationError(
                    {
                        "ward_number": "Ward number is required."
                    }
                )

        return attrs