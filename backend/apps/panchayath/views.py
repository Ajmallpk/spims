

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .permissions import IsPanchayath, IsActivePanchayath
from .models import PanchayathVerification
from apps.ward.models import WardVerification
from django.utils import timezone
from django.db.models import Count, Q
from django.db import transaction
from .serializers import PanchayathVerificationSerializer,WardVerificationSerializer
from rest_framework.response import Response
from .pagination import StandardResultsSetPagination
from .serializers import WardVerificationSerializer
from django.contrib.auth.hashers import check_password
from django.core.signing import TimestampSigner
from django.core.mail import send_mail
from django.conf import settings
from django.core.signing import BadSignature
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)






User = get_user_model()


class PanchayathProfileView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):

        user = request.user
        verification = getattr(user, "panchayath_verification", None)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "status": user.status,
            "panchayath_name": verification.panchayath_name if verification else None,
            "phone": verification.phone if verification else None,
            "district": verification.district if verification else None,
            "verification_status": verification.status if verification else "NOT_SUBMITTED",
        })






class SubmitPanchayathVerificationView(APIView):
    permission_classes = [IsPanchayath]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        user = request.user
        verification = getattr(user, "panchayath_verification", None)

        serializer = PanchayathVerificationSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        if verification:

            if verification.status == "PENDING":
                return Response({"error": "Verification already pending"}, status=400)

            if verification.status == "APPROVED":
                return Response({"error": "Already verified"}, status=400)

            for field, value in serializer.validated_data.items():
                setattr(verification, field, value)

            verification.status = "PENDING"
            verification.reject_reason = None
            verification.reviewed_at = None
            verification.save()
            logger.info(f"Panchayath {user.id} resubmitted verification")
            return Response({"message": "Verification resubmitted"})

        PanchayathVerification.objects.create(
            user=user,
            **serializer.validated_data
        )
        logger.info(f"Panchayath {user.id} submitted verification request")
        return Response({"message": "Verification submitted"})






class PanchayathDashboardView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):
        user = request.user
        verification_stats = WardVerification.objects.filter(
            panchayath=user
        ).aggregate(
            pending=Count("id", filter=Q(status="PENDING")),
            rejected=Count("id", filter=Q(status="REJECTED")),
        )
        approved_wards = User.objects.filter(
            role=User.Role.WARD,
            status=User.Status.ACTIVE,
            is_verified=True,
            ward_verification__panchayath=user
        ).count()

        total_wards = approved_wards + verification_stats["pending"] + verification_stats["rejected"]
        verification = getattr(user, "panchayath_verification", None)
        return Response({
            "panchayath_name": verification.panchayath_name if verification else None,
            "status": user.status,
            "total_wards": total_wards,
            "approved_wards": approved_wards,
            "pending_wards": verification_stats["pending"],
            "rejected_wards": verification_stats["rejected"],
        })
        
        
        



class PanchayathWardListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):

        user = request.user

        wards = WardVerification.objects.select_related("user").filter(
            panchayath=user,
            status="APPROVED"
        ).order_by("-submitted_at")

        paginator = StandardResultsSetPagination()
        paginated_queryset = paginator.paginate_queryset(wards, request)

        serializer = WardVerificationSerializer(paginated_queryset, many=True)

        return paginator.get_paginated_response(serializer.data)





class WardVerificationDetailView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request, pk):

        user = request.user

        try:
            ward = WardVerification.objects.get(
                pk=pk,
                panchayath=user
            )
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        documents = []

        if ward.aadhaar_image:
            documents.append(request.build_absolute_uri(ward.aadhaar_image.url))

        if ward.selfie_image:
            documents.append(request.build_absolute_uri(ward.selfie_image.url))

        if ward.supporting_document:
            documents.append(request.build_absolute_uri(ward.supporting_document.url))

        return Response({
            "id": ward.id,
            "ward_name": ward.ward_name,
            "officer_name": ward.officer_full_name,
            "email": ward.official_email,
            "phone": ward.official_contact,
            "address": ward.office_address,
            "status": ward.status,
            "rejection_reason": ward.reject_reason,
            "documents": documents,
            "submitted_at": ward.submitted_at,
        })





class ApproveWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, pk):

        user = request.user

        try:
            with transaction.atomic():
                ward = WardVerification.objects.select_for_update().get(
                    pk=pk,
                    panchayath=user
                )

                if ward.status != "PENDING":
                    return Response(
                        {"error": "This ward request has already been reviewed."},
                        status=400
                    )

                ward.status = "APPROVED"
                ward.reviewed_at = timezone.now()
                ward.reject_reason = None
                ward.save()

                ward.user.status = User.Status.ACTIVE
                ward.user.is_verified = True
                ward.user.save()
                
                logger.info(f"Panchayath {user.id} approved ward {ward.id}")

        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        return Response({"message": "Ward approved successfully"})
    
     
    
    
    
class RejectWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, pk):

        user = request.user
        reason = request.data.get("reason")

        if not reason or len(reason.strip()) < 10:
            return Response(
                {"error": "Rejection reason must be at least 10 characters"},
                status=400
            )

        try:
            with transaction.atomic():
                ward = WardVerification.objects.select_for_update().get(
                    pk=pk,
                    panchayath=user
                )

                if ward.status != "PENDING":
                    return Response(
                        {"error": "This ward request has already been reviewed."},
                        status=400
                    )

                ward.status = "REJECTED"
                ward.reject_reason = reason.strip()
                ward.reviewed_at = timezone.now()
                ward.save()

                ward.user.status = User.Status.SUSPENDED
                ward.user.is_verified = False
                ward.user.save()
                logger.warning(f"Panchayath {user.id} rejected ward {ward.id}")
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        return Response({"message": "Ward rejected successfully"})




#new added 


class PanchayathVerificationStatusView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):
        user = request.user
        verification = getattr(user, "panchayath_verification", None)

        if not verification:
            return Response({
                "status": "NOT_SUBMITTED"
            })

        return Response({
            "status": verification.status,
            "rejection_reason": verification.reject_reason,
            "submitted_at": verification.submitted_at,
            "reviewed_at": verification.reviewed_at,
        })  
    



class PanchayathWardVerificationListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):

        user = request.user

        wards = WardVerification.objects.select_related("user").filter(
            panchayath=user,
            status="PENDING"
        ).order_by("-submitted_at")
        
        data = []

        for ward in wards:
            data.append({
                "id": ward.id,
                "ward_name": ward.ward_name,
                "email": ward.user.email,
                "phone": ward.official_contact,
                "status": ward.status,
                "submitted_at": ward.submitted_at,
            })

        return Response(data)
    
    



class PanchayathChangePasswordView(APIView):
    permission_classes = [IsPanchayath]

    def post(self, request):

        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not check_password(current_password, user.password):
            return Response({"message": "Current password is incorrect"}, status=400)

        user.set_password(new_password)
        user.save()
        logger.warning(f"Panchayath {user.id} changed password")
        return Response({"message": "Password changed successfully"})
    
    



signer = TimestampSigner()

class PanchayathRequestEmailChangeView(APIView):
    permission_classes = [IsPanchayath]

    def post(self, request):

        user = request.user
        new_email = request.data.get("email")
        password = request.data.get("password")

        if not check_password(password, user.password):
            return Response({"message": "Password incorrect"}, status=400)
        
        if User.objects.filter(email=new_email).exists():
            return Response({"message": "Email already in use"}, status=400)

        token = signer.sign(f"{user.id}:{new_email}")

        logger.info(f"Panchayath {user.id} requested email change")
        
        link = f"http://localhost:5173/panchayath/email-change-confirm/{token}"

        generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

        send_mail(
            subject="SPIMS Panchayath Email Change Confirmation",
            message=f"""
        Hello {user.username},

        You requested to change the email address for your SPIMS Panchayath account.

        To confirm this request, please click the link below:

        {link}

        This link will expire in 1 hour.

        Generated at: {generated_time}
        System: SPIMS Security

        If you did not request this change, please ignore this email.

        Regards,
        SPIMS Security Team
        """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )

        return Response({"message": "Verification email sent to your current email"})
    




class PanchayathConfirmEmailChangeView(APIView):
    permission_classes = []

    def post(self, request, token):

        try:
            data = signer.unsign(token, max_age=3600)
            user_id, new_email = data.split(":")

            user = User.objects.get(id=user_id)
            user.email = new_email
            user.save()
            logger.info(f"Panchayath {user.id} changed email successfully")
            return Response({
                "message": "Email updated successfully",
                "email": new_email
            })

        except BadSignature:
            return Response({"error": "Invalid or expired token"}, status=400)