from rest_framework import serializers
from .models import PanchayathVerification
from apps.ward.models import WardVerification
from apps.complaints.models import Complaint,ComplaintHistory
from django.utils import timezone
from apps.complaints.utils import can_change_status
from apps.complaints.serializers import HoldComplaintSerializer


from django.contrib.auth import get_user_model
from apps.accounts.models import Ward
import re

User = get_user_model()

class PanchayathVerificationSerializer(serializers.ModelSerializer):
    
    aadhaar_image = serializers.ImageField(required=True)
    selfie_image = serializers.ImageField(required=True)

    class Meta:
        model = PanchayathVerification
        fields = [
            "panchayath_name",
            "full_name",
            "phone",
            "district",
            "email",
            "aadhaar_image",
            "selfie_image",
        ]
        
        
        extra_kwargs = {
            "email": {"validators": []},
            "phone": {"validators": []},
        }
        
    
    
    def validate(self, attrs):
        email = attrs.get("email")
        phone = attrs.get("phone")

        queryset = PanchayathVerification.objects.all()

        # Ignore the current record when resubmitting
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "This email is already used by another Panchayath."
            })

        if queryset.filter(phone=phone).exists():
            raise serializers.ValidationError({
                "phone": "This phone number is already used by another Panchayath."
            })

        return attrs

    def validate_aadhaar_image(self, file):
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        max_size = 5 * 1024 * 1024

        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Aadhaar image must be JPG or PNG")

        if file.size > max_size:
            raise serializers.ValidationError("Aadhaar image must be smaller than 5MB")

        return file

    def validate_selfie_image(self, file):
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        max_size = 5 * 1024 * 1024

        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Selfie must be JPG or PNG")

        if file.size > max_size:
            raise serializers.ValidationError("Selfie image must be smaller than 5MB")

        return file
    
class WardVerificationSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username")
    email = serializers.CharField(source="official_email")
    phone = serializers.CharField(source="official_contact")
    complaint_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = WardVerification
        fields = [
            "id",
            "ward_name",
            "username",
            "email",
            "phone",
            "complaint_count",
            "status",
            "submitted_at",
            "reviewed_at"
        ]
        
        

    
    
    
    
class ReassignComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["reassign_note"]

    def validate_reassign_note(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Minimum 10 characters required")
        return value

    def update(self, instance, validated_data):
        
        if instance.status not in ["ESCALATED", "IN_PROGRESS"]:
            raise serializers.ValidationError(
                f"cannot reassign from {instance.status}"
            )
        
        
        instance.status = "PENDING"
        instance.reassign_note = validated_data.get("reassign_note")

        instance.save()

        ComplaintHistory.objects.create(
            complaint=instance,
            action="REASSIGNED",
            performed_by=self.context["request"].user,
            note=instance.reassign_note
        )

        return instance
        



class CreateWardSerializer(serializers.Serializer):

    ward_id = serializers.IntegerField()

    official_email = serializers.EmailField()

    official_phone = serializers.CharField(
        max_length=15
    )

    officer_personal_email = serializers.EmailField()

    def validate(self, attrs):

        request = self.context["request"]

        attrs["official_email"] = (
            attrs["official_email"]
            .strip()
            .lower()
        )

        attrs["officer_personal_email"] = (
            attrs["officer_personal_email"]
            .strip()
            .lower()
        )

        attrs["official_phone"] = (
            attrs["official_phone"]
            .strip()
        )

        if not re.fullmatch(
            r"^[6-9]\d{9}$",
            attrs["official_phone"]
        ):
            raise serializers.ValidationError({
                "official_phone":
                "Enter a valid 10-digit Indian mobile number."
            })

        if User.objects.filter(
            email=attrs["official_email"]
        ).exists():
            raise serializers.ValidationError({
                "official_email":
                "Official email already exists."
            })

        ward = Ward.objects.filter(
            id=attrs["ward_id"],
            panchayath=request.user.panchayath,
        ).first()

        if not ward:
            raise serializers.ValidationError({
                "ward_id":
                "Ward not found or does not belong to your Panchayath."
            })

        if User.objects.filter(
            role=User.Role.WARD,
            ward=ward,
        ).exists():
            raise serializers.ValidationError({
                "ward_id":
                "This Ward already has an account."
            })

        attrs["ward"] = ward

        return attrs

class UpdateOfficeDetailsSerializer(serializers.Serializer):

    official_email = serializers.EmailField(
        required=False
    )

    official_phone = serializers.CharField(
        required=False,
        max_length=10
    )

    reason = serializers.CharField()

    def validate(self, attrs):

        if (
            "official_email" not in attrs and
            "official_phone" not in attrs
        ):
            raise serializers.ValidationError(
                "Nothing to update."
            )

        if "official_email" in attrs:

            attrs["official_email"] = (
                attrs["official_email"]
                .strip()
                .lower()
            )

        if "official_phone" in attrs:

            attrs["official_phone"] = (
                attrs["official_phone"]
                .strip()
            )

            if not re.fullmatch(
                r"^[6-9]\d{9}$",
                attrs["official_phone"]
            ):
                raise serializers.ValidationError(
                    {
                        "official_phone":
                        "Enter a valid 10-digit Indian mobile number."
                    }
                )

        return attrs
    
    
class ReplaceWardOfficerSerializer(serializers.Serializer):

    officer_personal_email = serializers.EmailField()

    reason = serializers.CharField(
        min_length=10,
        max_length=500
    )

    def validate_officer_personal_email(self, value):

        value = value.strip().lower()

        if User.objects.filter(
            officer_personal_email=value
        ).exists():
            raise serializers.ValidationError(
                "This personal email is already being used."
            )

        return value