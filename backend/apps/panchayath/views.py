

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
from .serializers import WardVerificationSerializer,HoldComplaintSerializer
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
from apps.accounts.models import District, Panchayath
from apps.citizen.models import CitizenVerification
from apps.notification.utils import send_notification
from django.shortcuts import get_object_or_404
from rest_framework import status
from apps.complaints.serializers import ResumeComplaintSerializer

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
            # verification = getattr(user, "panchayath_verification", None)

            # serializer = PanchayathVerificationSerializer(data=request.data)
            
            
            verification = getattr(user, "panchayath_verification", None)

            district_id = request.data.get("district")
            panchayath_master_id = request.data.get("panchayath_master")

            if not district_id or not panchayath_master_id:
                return error_response(
                    message="District and Panchayath are required.",
                    status=400
                )

            district = District.objects.filter(
                id=district_id
            ).first()

            panchayath_master = Panchayath.objects.filter(
                id=panchayath_master_id
            ).first()

            if not district or not panchayath_master:
                return error_response(
                    message="Invalid location selected.",
                    status=400
                )
                
                
            data = request.data.copy()
            data["district"] = district.name
            data["panchayath_name"] = panchayath_master.name
            serializer = PanchayathVerificationSerializer(
                instance=verification,
                data=data,
                context={"request": request}
            )
            
            
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
                verification.district_master = district
                verification.panchayath_master = panchayath_master
                verification.save()
                
                
                admin_user = User.objects.filter(
                    is_superuser=True
                ).first()

                if admin_user:

                    send_notification(
                        user=admin_user,
                        title="Panchayath Verification Resubmitted",
                        message=f"{user.username} resubmitted verification request.",
                        n_type="PANCHAYATH_VERIFICATION",
                        sender=user,
                        extra_data={
                            "verification_id": verification.id
                        }
                    )

                logger.info(f"Panchayath {user.id} resubmitted verification")
                return success_response(
                    message="Verification resubmitted successfully"
                )
            verification = PanchayathVerification.objects.create(
                user=user,
                district_master=district,
                panchayath_master=panchayath_master,
                **serializer.validated_data
            )
            
            admin_user = User.objects.filter(
                is_superuser=True
            ).first()
            
            print("ADMIN USER:", admin_user)
            
            if admin_user:
                
                print("SEND NOTIFICATION EXECUTING")
                send_notification(
                    user=admin_user,
                    title="New Panchayath Verification",
                    message=f"{user.username} submitted verification request",
                    n_type="PANCHAYATH_VERIFICATION",
                    sender=user,
                    extra_data={
                        "verification_id": verification.id
                    }
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

            approved_wards = WardVerification.objects.filter(
                panchayath=user,
                status="APPROVED"
            ).count()
            
            
            total_complaints = Complaint.objects.filter(
                ward__ward_verifications__panchayath=user
            ).count()
            
            
            
            escalated_complaints = Complaint.objects.filter(
                ward__ward_verifications__panchayath=user,
                status="ESCALATED"
            ).count()

            in_progress_complaints = Complaint.objects.filter(
                ward__ward_verifications__panchayath=user,
                status="IN_PROGRESS"
            ).count()

            resolved_complaints = Complaint.objects.filter(
                ward__ward_verifications__panchayath=user,
                status="RESOLVED"
            ).count()

            reassigned_complaints = Complaint.objects.filter(
                ward__ward_verifications__panchayath=user,
                is_reassigned=True
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
                    
                    "total_complaints": total_complaints,
                    "escalated_complaints": escalated_complaints,
                    "in_progress_complaints": in_progress_complaints,
                    "resolved_complaints": resolved_complaints,
                    "reassigned_complaints": reassigned_complaints,
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

            # wards = WardVerification.objects.select_related("user").filter(
            #     panchayath=user,
            #     status="APPROVED"
            # ).order_by("-submitted_at")

            
            sort_type = request.GET.get(
                "complaint_sort"
            )
            
            search = request.GET.get(
                "search",
                ""
            ).strip()

            wards = (
                WardVerification.objects
                .select_related("user")
                .filter(
                    panchayath=user,
                    status="APPROVED"
                )
                .annotate(
                    complaint_count=Count(
                        "user__assigned_complaints"
                    )
                )
            )

            if search:

                wards = wards.filter(

                    Q(
                        ward_name__icontains=search
                    )

                    |

                    Q(
                        official_email__icontains=search
                    )

                )

            if sort_type == "low":

                wards = wards.order_by(
                    "complaint_count"
                )

            elif sort_type == "high":

                wards = wards.order_by(
                    "-complaint_count"
                )

            else:

                wards = wards.order_by(
                    "-submitted_at"
                )
            
            
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
                documents.append(
                    ward.aadhaar_image.url
                )

            if ward.selfie_image:
                documents.append(
                    ward.selfie_image.url
                )

            if ward.supporting_document:
                documents.append(
                    ward.supporting_document.url
                )

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



class WardComplaintListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request, pk):
        
        
        print("WARD PK =", pk)
        print("USER =", request.user)

        ward = WardVerification.objects.filter(
            pk=pk,
            panchayath=request.user
        ).first()
        
        
        print("WARD =", ward)

        if not ward:
            return error_response(
                message="Ward not found",
                status=404
            )

        complaints = Complaint.objects.filter(
            ward=ward.ward_master
        ).select_related(
            "citizen"
        ).order_by("-created_at")
        
        
        print(
            "COMPLAINT COUNT =",
            complaints.count()
        )

        data = [
            {
                "id": c.id,
                "title": c.title,
                "status": c.status,
                "category": c.category,
                "citizen_name": c.citizen.username,
                "created_at": c.created_at,
            }
            for c in complaints
        ]

        return success_response(
            message="Ward complaints fetched",
            data=data
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
                
                
                
                waiting_citizens = CitizenVerification.objects.filter(
                    ward=ward.ward_master,
                    status="WAITING_FOR_WARD"
                )

                # for citizen in waiting_citizens:

                #     citizen.ward = ward.user
                #     citizen.status = "PENDING"
                #     citizen.reject_reason = None
                #     citizen.reviewed_at = None
                #     citizen.save()

                #     send_notification(
                #         user=ward.user,
                #         title="New Citizen Verification",
                #         message=f"{citizen.full_name} is waiting for verification.",
                #         n_type="CITIZEN_VERIFICATION",
                #         sender=citizen.user,
                #         extra_data={
                #             "verification_id": citizen.id
                #         }
                #     )

                #     send_notification(
                #         user=citizen.user,
                #         title="Verification Assigned",
                #         message="A Ward Officer has been assigned to review your verification.",
                #         n_type="CITIZEN_VERIFICATION",
                #         sender=ward.user,
                #         extra_data={
                #             "verification_id": citizen.id
                #         }
                #     )
                
                
                
                for citizen in waiting_citizens:

                    # Already assigned to this ward during registration.
                    citizen.status = "PENDING"
                    citizen.reject_reason = None
                    citizen.reviewed_at = None
                    citizen.save()

                    send_notification(
                        user=ward.user,
                        title="New Citizen Verification",
                        message=f"{citizen.full_name} is waiting for verification.",
                        n_type="CITIZEN_VERIFICATION",
                        sender=citizen.user,
                        extra_data={
                            "verification_id": citizen.id
                        }
                    )

                    send_notification(
                        user=citizen.user,
                        title="Verification Assigned",
                        message="A Ward Officer has been assigned to review your verification.",
                        n_type="CITIZEN_VERIFICATION",
                        sender=ward.user,
                        extra_data={
                            "verification_id": citizen.id
                        }
                    )
                
                
                
                send_notification(
                    user=ward.user,
                    title="Ward Verification Approved",
                    message="Your ward verification has been approved.",
                    n_type="WARD_VERIFICATION",
                    sender=request.user,
                )

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

                ward.user.status = User.Status.ACTIVE
                ward.user.is_verified = False
                ward.user.save()
                
                
                
                send_notification(
                    user=ward.user,
                    title="Ward Verification Rejected",
                    message=f"Your ward verification was rejected. Reason: {reason}",
                    n_type="WARD_VERIFICATION",
                    sender=request.user,
                )
                
                

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
                    "ward_name": f"Ward {c.ward.ward_number} - {c.ward.ward_name}",
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
            
            
            ward_verification = WardVerification.objects.filter(
                ward_master=complaint.ward
            ).first()

            if ward_verification:
                send_notification(
                    user=ward_verification.user,
                    title="Complaint Reassigned",
                    message="A complaint has been reassigned to you",
                    n_type="REASSIGN",
                    complaint=complaint,
                    sender=request.user,
                )
            
            
            
            send_notification(
                user=complaint.citizen,
                title="Complaint Reassigned",
                message="Your complaint has been reassigned to another Ward Officer.",
                n_type="REASSIGN",
                complaint=complaint,
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
            
            
            
class HoldComplaintView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):

        complaint = get_object_or_404(
            Complaint,
            id=complaint_id
        )

        serializer = HoldComplaintSerializer(
            complaint,
            data=request.data,
            partial=True,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Complaint put on hold."
            },
            status=status.HTTP_200_OK
        )
        
        
class ResumeComplaintView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):

        complaint = get_object_or_404(
            Complaint,
            id=complaint_id
        )

        serializer = ResumeComplaintSerializer(
            complaint,
            data={},
            partial=True,
            context={"request": request}
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return success_response(
            "Complaint resumed."
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
                    "url": m.file.url,
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
            
            ward_verification = WardVerification.objects.filter(
                ward_master=complaint.ward
            ).select_related("user").first()

            return success_response(
                message="Complaint detail fetched",
                data={
                    "id": complaint.id,
                    "title": complaint.title,
                    "description": complaint.description,
                    "category": complaint.category,
                    "status": complaint.status,
                    "hold_reason": complaint.hold_reason,
                    "hold_at": complaint.hold_at,
                    "hold_by_name": complaint.hold_by.username if complaint.hold_by else None,
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
                        "ward_name": complaint.ward.ward_name,
                        "ward_number": complaint.ward.ward_number,

                        "officer": ward_verification.user.username if ward_verification else None,
                        "officerEmail": ward_verification.user.email if ward_verification else None,
                        "officerPhone": ward_verification.official_contact if ward_verification else None,
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
                
                
                send_notification(
                    user=complaint.citizen,
                    title="Complaint In Progress",
                    message="Panchayath has started working on your complaint.",
                    n_type="COMPLAINT_STATUS",
                    complaint=complaint,
                    sender=request.user,
                )
                
                
                ward_verification = WardVerification.objects.filter(
                    ward_master=complaint.ward
                ).first()

                if ward_verification:
                    send_notification(
                        user=ward_verification.user,
                        title="Complaint Started",
                        message="Panchayath has started working on the escalated complaint.",
                        n_type="COMPLAINT_STATUS",
                        complaint=complaint,
                        sender=request.user,
                    )
                
                ComplaintHistory.objects.create(
                    complaint=complaint,
                    action="STARTED_WORK",
                    performed_by=user
                )

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
    



class PanchayathComplaintFullDetailView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request, complaint_id):

        try:

            complaint = Complaint.objects.select_related(
                "citizen",
                "resolution"
            ).get(
                id=complaint_id,
                panchayath=request.user
            )

            data = {
                "id": complaint.id,
                "title": complaint.title,
                "description": complaint.description,
                "status": complaint.status,
                "category": complaint.category,
                "location": complaint.location,

                "citizen_name":
                    complaint.citizen.username,

                "citizen_email":
                    complaint.citizen.email,

                "created_at":
                    complaint.created_at,

                "image_proof":
                    complaint.image_proof.url
                    if complaint.image_proof
                    else None,

                "video_proof":
                    complaint.video_proof.url
                    if complaint.video_proof
                    else None,
                    
                    
                "upvotes_count":
                    complaint.upvotes.count(),

                "comments_count":
                    complaint.comments.count(),

                "resolved_at":
                    complaint.resolved_at,

                "is_reassigned":
                    complaint.is_reassigned,

                "reassign_note":
                    complaint.reassign_note,

                "escalation_reason":
                    complaint.escalation_reason,

                "updated_at":
                    complaint.updated_at,
                    
                    
                "complaint_media": [
                    {
                        "file": media.file.url,
                        "file_type": media.file_type
                    }
                    for media in complaint.media.all()
                ],
            }

            if hasattr(
                complaint,
                "resolution"
            ):

                data["resolution"] = {

                    "message":
                        complaint.resolution.message,

                    "proof_image":
                        complaint.resolution.proof_image.url
                        if complaint.resolution.proof_image
                        else None,

                    "proof_video":
                        complaint.resolution.proof_video.url
                        if complaint.resolution.proof_video
                        else None,

                    "media": [
                        {
                            "file": media.file.url,
                            "file_type": media.file_type
                        }
                        for media in complaint.resolution.media.all()
                    ]
                }

            return success_response(
                message="Complaint detail fetched",
                data=data
            )

        except Complaint.DoesNotExist:

            return error_response(
                message="Complaint not found",
                status=404
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
                if file.size > 20 * 1024 * 1024:

                    return error_response(
                        message="File size exceeds 20MB",
                        status=400
                    )  

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
            
            
            
class PanchayathMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": request.user.role,
            "status": request.user.status,
            "is_verified": request.user.is_verified,
        })