

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
from .serializers import PanchayathVerificationSerializer,WardVerificationSerializer,ReassignComplaintSerializer
from rest_framework.response import Response
from .pagination import StandardResultsSetPagination
from .serializers import WardVerificationSerializer
from django.contrib.auth.hashers import check_password
from django.core.signing import TimestampSigner
from django.core.mail import send_mail
from django.conf import settings
from django.core.signing import BadSignature
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from apps.complaints.models import Complaint,ComplaintHistory
from rest_framework.pagination import PageNumberPagination
import logging
from rest_framework.parsers import MultiPartParser, FormParser
from apps.complaints.models import ComplaintResolution, ResolutionMedia
from .utils import success_response,error_response
import mimetypes
from apps.notification.utils import send_notification



logger = logging.getLogger(__name__)






User = get_user_model()


class PanchayathProfileView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):
        try:
            user = request.user
            verification = getattr(user, "panchayath_verification", None)

            data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "status": user.status,
                "panchayath_name": verification.panchayath_name if verification else None,
                "phone": verification.phone if verification else None,
                "district": verification.district if verification else None,
                "verification_status": verification.status if verification else "NOT_SUBMITTED",
                "created_at": verification.reviewed_at if verification else None,
            }

            logger.info(f"Panchayath {user.id} fetched profile")

            return success_response(
                message="Profile fetched successfully",
                data=data
            )

        except Exception as e:
            logger.error(f"PanchayathProfile error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )






class SubmitPanchayathVerificationView(APIView):
    permission_classes = [IsPanchayath]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = request.user
            verification = getattr(user, "panchayath_verification", None)

            serializer = PanchayathVerificationSerializer(data=request.data)

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            if verification:
                if verification.status == "PENDING":
                    return error_response(
                        message="Verification already pending",
                        status=400
                    )

                if verification.status == "APPROVED":
                    return error_response(
                        message="Already verified",
                        status=400
                    )

                for field, value in serializer.validated_data.items():
                    if value is not None:
                        setattr(verification, field, value)

                verification.status = "PENDING"
                verification.reject_reason = None
                verification.reviewed_at = None
                verification.save()

                logger.info(f"Panchayath {user.id} resubmitted verification")
                return success_response(
                    message="Verification resubmitted successfully"
                )
            PanchayathVerification.objects.create(
                user=user,
                **serializer.validated_data
            )

            logger.info(f"Panchayath {user.id} submitted verification")

            return success_response(
                message="Verification submitted successfully"
            )

        except Exception as e:
            logger.error(f"SubmitPanchayathVerification error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )






class PanchayathDashboardView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):
        try:
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

            total_wards = (
                approved_wards +
                (verification_stats.get("pending") or 0) +
                (verification_stats.get("rejected") or 0)
            )

            verification = getattr(user, "panchayath_verification", None)

            logger.info(f"Panchayath {user.id} accessed dashboard")

            return success_response(
                message="Dashboard data fetched successfully",
                data={
                    "panchayath_name": verification.panchayath_name if verification else None,
                    "status": user.status,
                    "total_wards": total_wards,
                    "approved_wards": approved_wards,
                    "pending_wards": verification_stats.get("pending", 0),
                    "rejected_wards": verification_stats.get("rejected", 0),
                }
            )

        except Exception as e:
            logger.error(f"PanchayathDashboard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        



class PanchayathWardListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):
        try:
            user = request.user

            wards = WardVerification.objects.select_related("user").filter(
                panchayath=user,
                status="APPROVED"
            ).order_by("-submitted_at")

            paginator = StandardResultsSetPagination()
            paginated_qs = paginator.paginate_queryset(wards, request)

            serializer = WardVerificationSerializer(paginated_qs, many=True)

            logger.info(f"Panchayath {user.id} fetched approved ward list")

            return paginator.get_paginated_response({
                "message": "Ward list fetched successfully",
                "data": serializer.data
            })

        except Exception as e:
            logger.error(f"PanchayathWardList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class WardVerificationDetailView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request, pk):
        try:
            user = request.user

            ward = WardVerification.objects.filter(
                pk=pk,
                panchayath=user
            ).first()

            if not ward:
                return error_response(
                    message="Ward not found",
                    status=404
                )

            documents = []

            if ward.aadhaar_image:
                documents.append(request.build_absolute_uri(ward.aadhaar_image.url))

            if ward.selfie_image:
                documents.append(request.build_absolute_uri(ward.selfie_image.url))

            if ward.supporting_document:
                documents.append(request.build_absolute_uri(ward.supporting_document.url))

            logger.info(f"Panchayath {user.id} viewed ward {ward.id}")

            return success_response(
                message="Ward details fetched successfully",
                data={
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
                }
            )

        except Exception as e:
            logger.error(f"WardVerificationDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class ApproveWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, pk):
        try:
            user = request.user

            with transaction.atomic():
                ward = WardVerification.objects.select_for_update().filter(
                    pk=pk,
                    panchayath=user
                ).first()

                if not ward:
                    return error_response(
                        message="Ward not found",
                        status=404
                    )

                if ward.status != "PENDING":
                    return error_response(
                        message="This ward request has already been reviewed",
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

                return success_response(
                    message="Ward approved successfully"
                )

        except Exception as e:
            logger.error(f"ApproveWard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
     
    
    
    
class RejectWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, pk):
        try:
            user = request.user
            reason = request.data.get("reason", "").strip()

            if not reason or len(reason) < 10:
                return error_response(
                    message="Rejection reason must be at least 10 characters",
                    status=400
                )

            with transaction.atomic():
                ward = WardVerification.objects.select_for_update().filter(
                    pk=pk,
                    panchayath=user
                ).first()

                if not ward:
                    return error_response(
                        message="Ward not found",
                        status=404
                    )

                if ward.status != "PENDING":
                    return error_response(
                        message="This ward request has already been reviewed",
                        status=400
                    )

                ward.status = "REJECTED"
                ward.reject_reason = reason
                ward.reviewed_at = timezone.now()
                ward.save()

                ward.user.status = User.Status.SUSPENDED
                ward.user.is_verified = False
                ward.user.save()

                logger.warning(f"Panchayath {user.id} rejected ward {ward.id}")

                return success_response(
                    message="Ward rejected successfully"
                )

        except Exception as e:
            logger.error(f"RejectWard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )







class PanchayathVerificationStatusView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):
        try:
            user = request.user
            verification = getattr(user, "panchayath_verification", None)

            if not verification:
                logger.info(f"Panchayath {user.id} checked verification (not submitted)")

                return success_response(
                    message="Verification not submitted",
                    data={
                        "status": "NOT_SUBMITTED"
                    }
                )

            logger.info(f"Panchayath {user.id} checked verification status")

            return success_response(
                message="Verification status fetched",
                data={
                    "status": verification.status,
                    "rejection_reason": verification.reject_reason,
                    "submitted_at": verification.submitted_at,
                    "reviewed_at": verification.reviewed_at,
                }
            )

        except Exception as e:
            logger.error(f"PanchayathVerificationStatus error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )



class PanchayathWardVerificationListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):
        try:
            user = request.user

            wards = WardVerification.objects.select_related("user").filter(
                panchayath=user,
                # status="PENDING"
            ).order_by("-submitted_at")

            data = [
                {
                    "id": ward.id,
                    "ward_name": ward.ward_name,
                    "email": ward.user.email,
                    "phone": ward.official_contact,
                    "status": ward.status,
                    "submitted_at": ward.submitted_at,
                }
                for ward in wards
            ]

            logger.info(f"Panchayath {user.id} fetched pending ward verifications")

            return success_response(
                message="Pending ward verification list fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"PanchayathWardVerificationList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    



class PanchayathChangePasswordView(APIView):
    permission_classes = [IsPanchayath]

    def post(self, request):
        try:
            user = request.user

            current_password = request.data.get("current_password", "").strip()
            new_password = request.data.get("new_password", "").strip()
            if not current_password or not new_password:
                return error_response(
                    message="Both passwords are required",
                    status=400
                )
            if not user.check_password(current_password):
                logger.warning(f"Panchayath {user.id} entered wrong current password")

                return error_response(
                    message="Current password is incorrect",
                    status=400
                )

            if len(new_password) < 6:
                return error_response(
                    message="New password must be at least 6 characters",
                    status=400
                )
            user.set_password(new_password)
            user.save()

            logger.info(f"Panchayath {user.id} changed password successfully")

            return success_response(
                message="Password changed successfully"
            )

        except Exception as e:
            logger.error(f"PanchayathChangePassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    



signer = TimestampSigner()

class PanchayathRequestEmailChangeView(APIView):
    permission_classes = [IsActivePanchayath]
    def post(self, request):
        try:
            user = request.user

            new_email = request.data.get("email", "").strip()
            password = request.data.get("password", "").strip()
            if not new_email or not password:
                return error_response(
                    message="Email and password are required",
                    status=400
                )

            if not user.check_password(password):
                logger.warning(f"Panchayath {user.id} entered wrong password for email change")

                return error_response(
                    message="Password incorrect",
                    status=400
                )
            if User.objects.filter(email=new_email).exists():
                return error_response(
                    message="Email already in use",
                    status=400
                )
            token = signer.sign(f"{user.id}:{new_email}")

            link = f"http://localhost:5173/panchayath/email-change-confirm/{token}"

            generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

            send_mail(
                subject="SPIMS Panchayath Email Change Confirmation",
                message=f"""
Hello {user.username},

You requested to change your email address.

Click below to confirm:
{link}

This link expires in 1 hour.

Generated at: {generated_time}

If not you, ignore this email.

Regards,
SPIMS Security
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            logger.info(f"Panchayath {user.id} requested email change")

            return success_response(
                message="Verification email sent"
            )

        except Exception as e:
            logger.error(f"PanchayathEmailChangeRequest error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    




from rest_framework.permissions import AllowAny

class PanchayathConfirmEmailChangeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            data = signer.unsign(token, max_age=3600)

            try:
                user_id, new_email = data.split(":")
            except ValueError:
                return error_response(
                    message="Invalid token format",
                    status=400
                )
            user = User.objects.filter(id=user_id).first()

            if not user:
                return error_response(
                    message="User not found",
                    status=400
                )

            user.email = new_email
            user.save()

            logger.info(f"Panchayath {user.id} email changed successfully")

            return success_response(
                message="Email updated successfully",
                data={"email": new_email}
            )

        except BadSignature:
            logger.warning("Invalid or expired email change token")

            return error_response(
                message="Invalid or expired token",
                status=400
            )

        except Exception as e:
            logger.error(f"PanchayathEmailConfirm error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
class PanchayathComplaintPagination(PageNumberPagination):
    page_size = 10
        
        
class PanchayathComplaintListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):
        try:
            user = request.user

            complaints = Complaint.objects.select_related(
                "citizen", "ward"
            ).filter(
                panchayath=user,
                status="ESCALATED"
            ).order_by("-created_at")

            paginator = PanchayathComplaintPagination()
            paginated_qs = paginator.paginate_queryset(complaints, request)

            data = [
                {
                    "id": c.id,
                    "title": c.title,
                    "status": c.status,
                    "category": c.category,
                    "created_at": c.created_at,

                    "citizen_name": c.citizen.username,
                    "ward_id": c.ward.id,
                    "ward_name": c.ward.username,
                }
                for c in paginated_qs
            ]

            logger.info(f"Panchayath {user.id} fetched escalated complaints")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"PanchayathComplaintList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
     
    
class ReassignComplaintView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, complaint_id):
        try:
            user = request.user

            complaint = Complaint.objects.filter(
                id=complaint_id,
                panchayath=user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            serializer = ReassignComplaintSerializer(
                complaint,
                data=request.data,
                partial=True,
                context={"request": request},
            )

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            serializer.save()
            
            
            send_notification(
                user = complaint.ward,
                title="Complaint Reassigned",
                message="A complain has been reassigned to you",
                n_type="REASSIGN",
                complaint = complaint,
                sender=request.user
            )

            logger.info(f"Panchayath {user.id} reassigned complaint {complaint.id}")

            return success_response(
                message="Complaint reassigned to ward",
                data={"status": "PENDING"}
            )

        except Exception as e:
            logger.error(f"ReassignComplaint error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
class PanchayathComplaintDetailView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request, complaint_id):
        try:
            user = request.user

            complaint = Complaint.objects.select_related(
                "citizen", "ward"
            ).prefetch_related(
                "media", "history"
            ).filter(
                id=complaint_id,
                panchayath=user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            media = [
                {
                    "type": m.file_type.lower(),
                    "url": request.build_absolute_uri(m.file.url),
                    "caption": "Complaint Media"
                }
                for m in complaint.media.all()
            ]

            timeline = [
                {
                    "date": h.created_at,
                    "event": h.action,
                    "actor": h.performed_by.username if h.performed_by else "System",
                    "type": "update"
                }
                for h in complaint.history.all().order_by("created_at")
            ]

            logger.info(f"Panchayath {user.id} viewed complaint {complaint.id}")

            return success_response(
                message="Complaint detail fetched",
                data={
                    "id": complaint.id,
                    "title": complaint.title,
                    "description": complaint.description,
                    "category": complaint.category,
                    "status": complaint.status,
                    "location": complaint.location,
                    "created_at": complaint.created_at,

                    "media": media,
                    "timeline": timeline,

                    "citizen": {
                        "id": complaint.citizen.id,
                        "name": complaint.citizen.username,
                        "email": complaint.citizen.email,
                        "phone": getattr(complaint.citizen, "phone", "Not Available"),
                    },

                    "ward": {
                        "id": complaint.ward.id,
                        "name": complaint.ward.username,
                        "officer": complaint.ward.username,
                        "officerPhone": getattr(complaint.ward, "phone", "Not Available"),
                        "officerEmail": complaint.ward.email,
                    }
                }
            )

        except Exception as e:
            logger.error(f"PanchayathComplaintDetail GET error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )


    def post(self, request, complaint_id):
        try:
            user = request.user

            complaint = Complaint.objects.filter(
                id=complaint_id,
                panchayath=user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            action = request.data.get("action")

            if action == "START_WORK":

                if complaint.status != "ESCALATED":
                    return error_response(
                        message="Invalid state",
                        status=400
                    )

                complaint.status = "IN_PROGRESS"
                complaint.save()

                logger.info(f"Panchayath {user.id} started work on complaint {complaint.id}")

                return success_response(
                    message="Complaint moved to IN_PROGRESS"
                )

            return error_response(
                message="Invalid action",
                status=400
            )

        except Exception as e:
            logger.error(f"PanchayathComplaintDetail POST error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    


class PanchayathResolveView(APIView):
    permission_classes = [IsActivePanchayath]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, complaint_id):
        try:
            user = request.user

            complaint = Complaint.objects.filter(
                id=complaint_id,
                panchayath=user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )
            if complaint.status != "IN_PROGRESS":
                return error_response(
                    message="Complaint must be IN_PROGRESS to resolve",
                    status=400
                )

            message = request.data.get("message", "").strip()

            if not message or len(message) < 5:
                return error_response(
                    message="Resolution message must be at least 5 characters",
                    status=400
                )
            resolution = ComplaintResolution.objects.create(
                complaint=complaint,
                authority=user,
                message=message
            )

            files = request.FILES.getlist("media_files")

            for file in files:
                if file.size > 5 * 1024 * 1024:
                    continue  

                mime_type, _ = mimetypes.guess_type(file.name)

                if mime_type and mime_type.startswith("video"):
                    file_type = "VIDEO"
                else:
                    file_type = "IMAGE"

                ResolutionMedia.objects.create(
                    resolution=resolution,
                    file=file,
                    file_type=file_type
                )

            complaint.status = "RESOLVED"
            send_notification(
                user=complaint.citizen,
                title="Complaint Resolved",
                message="Your complaint has been resolved by Panchayath",
                n_type="RESOLUTION",
                complaint=complaint,
                sender=user
            )
            
            complaint.resolved_at = timezone.now()
            complaint.save()

            ComplaintHistory.objects.create(
                complaint=complaint,
                action="RESOLVED_BY_PANCHAYATH",
                performed_by=user,
                note=message
            )

            logger.info(f"Panchayath {user.id} resolved complaint {complaint.id}")

            return success_response(
                message="Complaint resolved successfully"
            )

        except Exception as e:
            logger.error(f"PanchayathResolve error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )