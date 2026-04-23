from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response 
from django.contrib.auth import get_user_model
from django.db.models import Q,Count
from .permissions import IsWard,IsActiveWard
from .models import WardVerification,EscalationMedia
from apps.citizen.models import CitizenVerification
from apps.complaints.models import Complaint  
from rest_framework.pagination import PageNumberPagination
from apps.panchayath.models import PanchayathVerification
from apps.citizen.models import CitizenProfile,CitizenVerification
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from apps.citizen.models import CitizenVerification, CitizenProfile
from apps.complaints.models import Complaint,ComplaintHistory,ResolutionMedia,ComplaintResolution
from .permissions import IsActiveWard
from django.utils import timezone
from .serialzers import EscalateComplaintSerializer
import uuid
import mimetypes
import logging
from apps.notification.utils import send_notification
from .utils.responses import success_response,error_response



logger = logging.getLogger(__name__)


User = get_user_model()




class WardProfile(APIView):
    permission_classes = [IsWard]

    def get(self, request):
        try:
            user = request.user

            verification = WardVerification.objects.filter(user=user).first()

            if not verification:
                logger.info(f"Ward {user.id} fetched profile (no verification)")

                return success_response(
                    message="Profile fetched",
                    data={
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "status": user.status,
                        "verification_status": "NOT_SUBMITTED"
                    }
                )

            logger.info(f"Ward {user.id} fetched profile with verification")

            return success_response(
                message="Profile fetched",
                data={
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "status": user.status,
                    "verification_status": verification.status,

                    "officer_full_name": verification.officer_full_name,
                    "official_email": verification.official_email,
                    "official_contact": verification.official_contact,

                    "ward_name": verification.ward_name,
                    "panchayath_name": verification.panchayath.username,
                    "office_address": verification.office_address,

                    "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url) if verification.aadhaar_image else None,
                    "selfie_image": request.build_absolute_uri(verification.selfie_image.url) if verification.selfie_image else None,
                    "supporting_document": request.build_absolute_uri(verification.supporting_document.url) if verification.supporting_document else None,
                }
            )

        except Exception as e:
            logger.error(f"WardProfile error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
    
    
class SubmitWardVerificationView(APIView):
    permission_classes = [IsWard]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            user = request.user
            panchayath_id = request.data.get("panchayath_id")

            if not panchayath_id:
                return error_response(
                    message="Panchayath selection is required",
                    status=400
                )

            panchayath_user = User.objects.filter(
                id=panchayath_id,
                role=User.Role.PANCHAYATH
            ).first()

            if not panchayath_user:
                return error_response(
                    message="Invalid Panchayath selected",
                    status=400
                )

            verification = WardVerification.objects.filter(user=user).first()

            data = {
                "officer_full_name": request.data.get("officer_full_name"),
                "official_email": request.data.get("official_email"),
                "official_contact": request.data.get("official_contact"),
                "ward_name": request.data.get("ward_name"),
                "office_address": request.data.get("office_address"),
                "aadhaar_image": request.FILES.get("aadhaar_image"),
                "selfie_image": request.FILES.get("selfie_image"),
                "supporting_document": request.FILES.get("supporting_document"),
            }

            if verification:

                if verification.status == "PENDING":
                    return error_response(
                        message="Verification already under review",
                        status=400
                    )

                if verification.status == "APPROVED":
                    return error_response(
                        message="Already verified",
                        status=400
                    )

                for key, value in data.items():
                    if value is not None:
                        setattr(verification, key, value)

                verification.panchayath = panchayath_user
                verification.status = "PENDING"
                verification.reject_reason = None
                verification.reviewed_at = None
                verification.save()
                
                send_notification(
                    user=panchayath_user,
                    title="Ward Verification Resubmitted",
                    message="A ward officer resubmitted verification",
                    n_type="WARD_VERIFICATION",
                    sender=user
                )
                

                logger.info(f"Ward {user.id} resubmitted verification")

                return success_response(
                    message="Verification resubmitted successfully"
                )

            WardVerification.objects.create(
                user=user,
                panchayath=panchayath_user,
                status="PENDING",
                **data
            )
            
            send_notification(
                user=panchayath_user,
                title="New Ward Verification",
                message="A ward officer submitted verification request",
                n_type="WARD_VERIFICATION",
                sender=user
            )
            
            logger.info(f"Ward {user.id} submitted verification")

            return success_response(
                message="Verification submitted successfully"
            )

        except Exception as e:
            logger.error(f"WardVerificationSubmit error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    




class WardVerificationStatusView(APIView):
    permission_classes = [IsWard]

    def get(self, request):
        try:
            verification = WardVerification.objects.filter(
                user=request.user
            ).first()

            if not verification:
                return success_response(
                    message="Verification not submitted",
                    data={
                        "status": "NOT_SUBMITTED"
                    }
                )

            logger.info(f"Ward {request.user.id} checked verification status")

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
            logger.error(f"WardVerificationStatus error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
            
class WardDashboardView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            user = request.user

            complaint_stats = Complaint.objects.filter(
                ward=user
            ).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
            )

            pending_citizens = CitizenVerification.objects.filter(
                ward=user,
                status="PENDING"
            ).count()

            verification = WardVerification.objects.filter(user=user).first()

            ward_name = verification.ward_name if verification else None

            logger.info(f"Ward {user.id} accessed dashboard")

            return success_response(
                message="Dashboard data fetched",
                data={
                    "ward_name": ward_name,
                    "total_complaints": complaint_stats.get("total", 0),
                    "pending_complaints": complaint_stats.get("pending", 0),
                    "resolved_complaints": complaint_stats.get("resolved", 0),
                    "pending_citizen_verifications": pending_citizens,
                }
            )

        except Exception as e:
            logger.error(f"WardDashboard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )




class CitizenVerificationListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            citizens = CitizenVerification.objects.filter(
                ward=request.user
            ).select_related("user").order_by("-submitted_at")

            data = [
                {
                    "id": citizen.id,
                    "full_name": citizen.full_name,
                    "email": citizen.user.email,
                    "phone": citizen.phone,
                    "status": citizen.status,
                    "submitted_at": citizen.submitted_at,
                }
                for citizen in citizens
            ]

            logger.info(f"Ward {request.user.id} fetched citizen verification list")

            return success_response(
                message="Citizen verification list fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"CitizenVerificationList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    



class CitizenVerificationDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, pk):
        try:
            citizen = CitizenVerification.objects.filter(
                pk=pk,
                ward=request.user
            ).select_related("user").first()

            if not citizen:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            logger.info(f"Ward {request.user.id} viewed citizen {citizen.id}")

            return success_response(
                message="Citizen details fetched",
                data={
                    "id": citizen.id,
                    "full_name": citizen.full_name,
                    "email": citizen.user.email,
                    "phone": citizen.phone,
                    "house_number": citizen.house_number,
                    "street_name": citizen.street_name,
                    "status": citizen.status,
                    "reject_reason": citizen.reject_reason,

                    "aadhaar_image": request.build_absolute_uri(citizen.aadhaar_image.url) if citizen.aadhaar_image else None,
                    "selfie_image": request.build_absolute_uri(citizen.selfie_image.url) if citizen.selfie_image else None,

                    "submitted_at": citizen.submitted_at,
                }
            )

        except Exception as e:
            logger.error(f"CitizenVerificationDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        




class ApproveCitizenView(APIView):
    permission_classes = [IsActiveWard]

    def post(self, request, pk):
        try:
            citizen = CitizenVerification.objects.filter(
                pk=pk,
                ward=request.user
            ).select_related("user").first()

            if not citizen:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            if citizen.status == "APPROVED":
                return error_response(
                    message="Citizen already approved",
                    status=400
                )

            citizen.status = "APPROVED"
            citizen.reviewed_at = timezone.now()
            citizen.save()

            citizen.user.status = User.Status.ACTIVE
            citizen.user.is_verified = True
            citizen.user.save()

            profile, _ = CitizenProfile.objects.get_or_create(user=citizen.user)

            profile.full_name = citizen.full_name
            profile.phone = citizen.phone
            profile.house_number = citizen.house_number
            profile.street_name = citizen.street_name
            profile.address = f"House {citizen.house_number}, {citizen.street_name}"

            ward_verification = WardVerification.objects.filter(
                user=request.user
            ).first()

            if ward_verification:
                profile.ward_name = ward_verification.ward_name

            profile.save()

            logger.info(f"Ward {request.user.id} approved citizen {citizen.user.id}")

            return success_response(
                message="Citizen approved successfully"
            )

        except Exception as e:
            logger.error(f"ApproveCitizen error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    

    
class RejectCitizenView(APIView):
    permission_classes = [IsActiveWard]

    def post(self, request, pk):
        try:
            user = request.user
            reason = request.data.get("reason", "").strip()
            if not reason or len(reason) < 10:
                return error_response(
                    message="Reject reason must be at least 10 characters",
                    status=400
                )

            citizen = CitizenVerification.objects.filter(
                pk=pk,
                ward=user
            ).select_related("user").first()

            if not citizen:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            if citizen.status == "REJECTED":
                return error_response(
                    message="Citizen already rejected",
                    status=400
                )
            citizen.status = "REJECTED"
            citizen.reject_reason = reason
            citizen.reviewed_at = timezone.now()
            citizen.save()
            citizen.user.status = User.Status.SUSPENDED
            citizen.user.save()

            logger.warning(f"Ward {user.id} rejected citizen {citizen.user.id}")

            return success_response(
                message="Citizen rejected successfully"
            )

        except Exception as e:
            logger.error(f"RejectCitizen error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    

    
    
    
class CitizenPagination(PageNumberPagination):
    page_size = 10
    
class ApprovedCitizenListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            search = request.GET.get("search", "").strip()

            citizens = CitizenVerification.objects.filter(
                ward=request.user,
                status="APPROVED"
            ).select_related("user")

            if search:
                citizens = citizens.filter(
                    Q(full_name__icontains=search) |
                    Q(user__email__icontains=search) |
                    Q(phone__icontains=search)
                )

            citizens = citizens.order_by("-submitted_at")

            paginator = CitizenPagination()
            paginated_qs = paginator.paginate_queryset(citizens, request)

            data = [
                {
                    "id": citizen.id,
                    "full_name": citizen.full_name,
                    "email": citizen.user.email,
                    "phone": citizen.phone,
                    "house_number": citizen.house_number,
                    "street_name": citizen.street_name,
                }
                for citizen in paginated_qs
            ]

            logger.info(f"Ward {request.user.id} fetched approved citizens list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"ApprovedCitizenList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    


class RecentCitizenVerificationView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            citizens = CitizenVerification.objects.filter(
                ward=request.user
            ).order_by("-submitted_at")[:5]

            data = [
                {
                    "id": citizen.id,
                    "citizen_name": citizen.full_name,
                    "status": citizen.status,
                    "submitted_at": citizen.submitted_at,
                }
                for citizen in citizens
            ]

            logger.info(f"Ward {request.user.id} fetched recent citizen verifications")

            return success_response(
                message="Recent citizen verifications fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"RecentCitizenVerification error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    

class PanchayathDropdownListView(APIView):
    permission_classes = [IsWard]

    def get(self, request):
        try:
            panchayaths = User.objects.filter(
                role=User.Role.PANCHAYATH,
                status=User.Status.ACTIVE,
                is_verified=True
            )

            data = []

            for p in panchayaths:
                verification = PanchayathVerification.objects.filter(user=p).first()

                data.append({
                    "id": p.id,
                    "panchayath_name": verification.panchayath_name if verification else p.username
                })

            logger.info(f"Ward {request.user.id} fetched panchayath dropdown list")

            return success_response(
                message="Panchayath list fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"PanchayathDropdown error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )       
    
    
    
    
    
class WardChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

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
                return error_response(
                    message="Current password is incorrect",
                    status=400
                )

            user.set_password(new_password)
            user.save()

            logger.warning(f"Ward {user.id} changed password")

            return success_response(
                message="Password changed successfully"
            )

        except Exception as e:
            logger.error(f"ChangePassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
class WardChangeEmailRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            new_email = request.data.get("new_email", "").strip()
            password = request.data.get("password", "").strip()
            if not new_email or not password:
                return error_response(
                    message="Email and password required",
                    status=400
                )

            if not user.check_password(password):
                return error_response(
                    message="Password incorrect",
                    status=400
                )

            if User.objects.filter(email=new_email).exists():
                return error_response(
                    message="Email already exists",
                    status=400
                )

            token = str(uuid.uuid4())

            cache.set(
                f"ward_change_email_{token}",
                {
                    "user_id": user.id,
                    "new_email": new_email
                },
                timeout=600
            )

            verify_link = f"http://localhost:5173/ward/email-change-confirm/{token}"
            generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
            send_mail(
                subject="SPIMS Ward Email Change Confirmation",
                message=f"""
Hello {user.username},

You requested to change the email address for your SPIMS Ward account.

To confirm this request, click the link below:

{verify_link}

This link expires in 10 minutes.

Generated at: {generated_time}

If you did not request this, ignore this email.

Regards,
SPIMS Security Team
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            logger.info(f"Ward {user.id} requested email change")

            return success_response(
                message="Verification email sent"
            )

        except Exception as e:
            logger.error(f"ChangeEmailRequest error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
        
class WardChangeEmailVerifyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            data = cache.get(f"ward_change_email_{token}")

            if not data:
                return error_response(
                    message="Invalid or expired token",
                    status=400
                )

            user = User.objects.filter(id=data.get("user_id")).first()

            if not user:
                return error_response(
                    message="User not found",
                    status=400
                )

            new_email = data.get("new_email")

            if not new_email:
                return error_response(
                    message="Invalid data",
                    status=400
                )

            user.email = new_email
            user.save()
            cache.delete(f"ward_change_email_{token}")

            logger.info(f"Ward {user.id} changed email successfully")

            return success_response(
                message="Email updated successfully",
                data={"email": user.email}
            )

        except Exception as e:
            logger.error(f"ChangeEmailVerify error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        

class CitizenFullDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, pk):
        try:
            verification = CitizenVerification.objects.filter(
                pk=pk,
                ward=request.user
            ).first()

            if not verification:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            citizen_user = verification.user
            profile = CitizenProfile.objects.filter(user=citizen_user).first()

            stats = Complaint.objects.filter(citizen=citizen_user).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
                escalated=Count("id", filter=Q(status="ESCALATED")),
            )

            complaints = Complaint.objects.filter(
                citizen=citizen_user
            ).values(
                "id", "title", "category", "status", "created_at"
            ).order_by("-created_at")

            data = {
                "id": verification.id,
                "citizen": {
                    "id": citizen_user.id,
                    "full_name": verification.full_name,
                    "email": citizen_user.email,
                    "phone": verification.phone,
                    "house_number": verification.house_number,
                    "street_name": verification.street_name,
                    "ward_name": profile.ward_name if profile else None,
                    "address": profile.address if profile else None,
                    "joined_at": citizen_user.date_joined,
                },
                "verification": {
                    "status": verification.status,
                    "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url) if verification.aadhaar_image else None,
                    "selfie_image": request.build_absolute_uri(verification.selfie_image.url) if verification.selfie_image else None,
                    "submitted_at": verification.submitted_at, 
                },
                "stats": stats,
                "complaints": list(complaints)
            }

            logger.info(f"Ward {request.user.id} viewed full citizen detail")

            return success_response(
                message="Citizen full details fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"CitizenFullDetail error: {str(e)}")
            return error_response(message="Something went wrong", status=500)
    
    
    
class ComplaintDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, complaint_id):
        try:
            complaint = Complaint.objects.select_related(
                "citizen", "ward", "panchayath"
            ).prefetch_related("comments", "upvotes", "media").filter(
                id=complaint_id,
                ward=request.user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            profile = getattr(complaint.citizen, "citizen_profile", None)

            data = {
                "id": complaint.id,
                "title": complaint.title,
                "description": complaint.description,
                "category": complaint.category,
                "status": complaint.status,
                "created_at": complaint.created_at,
                "citizen": {
                    "id": complaint.citizen.id,
                    "full_name": complaint.citizen.username,
                    "email": complaint.citizen.email,
                    "phone": profile.phone if profile else None,
                },
                "location": complaint.location,
                "media": [
                    {
                        "file": request.build_absolute_uri(m.file.url),
                        "type": m.file_type
                    } for m in complaint.media.all()
                ],
                "upvotes": complaint.upvotes.count(),
                "comments": complaint.comments.count(),
            }

            logger.info(f"Ward {request.user.id} viewed complaint {complaint.id}")

            return success_response(
                message="Complaint details fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"ComplaintDetail error: {str(e)}")
            return error_response(message="Something went wrong", status=500)
    
   
    
class WardComplaintPagination(PageNumberPagination):
    page_size = 10
    
class WardComplaintListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            user = request.user

            status_filter = request.GET.get("status")
            search = request.GET.get("search", "").strip()
            category = request.GET.get("category")

            complaints = Complaint.objects.filter(
                ward=user
            ).select_related("citizen").order_by("-created_at")

            if status_filter:
                complaints = complaints.filter(status__iexact=status_filter)

            if category:
                complaints = complaints.filter(category=category)

            if search:
                complaints = complaints.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search) |
                    Q(citizen__username__icontains=search)
                )

            paginator = WardComplaintPagination()
            paginated_qs = paginator.paginate_queryset(complaints, request)
            data = [
                {
                    "id": c.id,
                    "title": c.title,
                    "description": c.description,
                    "category": c.category,
                    "status": c.status,
                    "created_at": c.created_at,

                    "citizen_name": c.citizen.username,
                    "location": c.location,

                    "image": request.build_absolute_uri(c.image_proof.url) if c.image_proof else None,
                }
                for c in paginated_qs
            ]

            logger.info(f"Ward {user.id} fetched complaint list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"WardComplaintList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
        
    
class EscalateComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        try:
            user = request.user
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            if user.role != "WARD" or complaint.ward != user:
                return error_response(
                    message="Permission denied",
                    status=403
                )

            serializer = EscalateComplaintSerializer(
                complaint,
                data=request.data,
                partial=True,
                context={"request": request}
            )

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            serializer.save()
            
            send_notification(
                user=complaint.citizen,
                title="Complaint Escalated",
                message="Your complaint has been escalated to Panchayath",
                n_type="ESCALATION",
                complaint=complaint,
                sender=user
            )
            
            complaint.is_reassigned = True
            complaint.save()
            
            send_notification(
                user=complaint.panchayath,
                title="Complaint Escalated",
                message="A complaint has been escalated to you",
                n_type="ESCALATION",
                complaint=complaint,
                sender = request.user
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

                EscalationMedia.objects.create(
                    complaint=complaint,
                    file=file,
                    file_type=file_type
                )

            logger.info(f"Ward {user.id} escalated complaint {complaint.id}")

            return success_response(
                message="Complaint escalated successfully"
            )

        except Exception as e:
            logger.error(f"Escalation error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    

    

class WardReassignedComplaintListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        try:
            status_filter = request.GET.get("status")
            search = request.GET.get("search", "").strip()
            category = request.GET.get("category")

            complaints = Complaint.objects.filter(
                ward=request.user,
                is_reassigned=True
            ).select_related("citizen")

            if status_filter == "pending":
                complaints = complaints.filter(status="PENDING")
            elif status_filter == "resolved":
                complaints = complaints.filter(status="RESOLVED")
            elif status_filter == "all":
                complaints = complaints.filter(status__in=["PENDING", "RESOLVED"])

            if category:
                complaints = complaints.filter(category=category)

            if search:
                complaints = complaints.filter(
                    Q(citizen__username__icontains=search) |
                    Q(citizen__email__icontains=search)
                )

            complaints = complaints.order_by("-created_at")

            data = [
                {
                    "id": c.id,
                    "title": c.title,
                    "category": c.category,
                    "status": c.status,
                    "citizen_name": c.citizen.username,
                    "citizen_email": c.citizen.email,
                    "created_at": c.created_at,
                    "location": c.location,
                }
                for c in complaints
            ]

            logger.info(f"Ward {request.user.id} fetched reassigned complaints")

            return success_response(
                message="Reassigned complaints fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"ReassignedComplaintList error: {str(e)}")
            return error_response(message="Something went wrong", status=500)
    
    
    
    
class WardResolveComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        try:
            user = request.user
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            if user.role != "WARD" or complaint.ward != user:
                return error_response(
                    message="Permission denied",
                    status=403
                )

            if hasattr(complaint, "resolution"):
                return error_response(
                    message="Complaint already resolved",
                    status=400
                )

            message = request.data.get("resolution_description", "").strip()

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
                message="Your complaint has been resolved by Ward",
                n_type="RESOLUTION",
                complaint=complaint,
                sender=user
            )
            complaint.resolved_at = timezone.now()
            complaint.save()
            
            send_notification(
                user = complaint.citizen,
                title= "Complaint Resolved",
                message= "Your complaint has been resolved",
                n_type="RESOLUTION",
                complaint=complaint,
                sender=request.user
            )

            ComplaintHistory.objects.create(
                complaint=complaint,
                action="RESOLVED",
                performed_by=user,
                note=message
            )

            logger.info(f"Ward {user.id} resolved complaint {complaint.id}")

            return success_response(
                message="Complaint resolved successfully"
            )

        except Exception as e:
            logger.error(f"WardResolve error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
class WardReassignedComplaintDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, complaint_id):
        try:
            complaint = Complaint.objects.select_related(
                "citizen", "ward"
            ).prefetch_related("media", "history").filter(
                id=complaint_id,
                ward=request.user
            ).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            profile = getattr(complaint.citizen, "citizen_profile", None)

            timeline = [
                {
                    "event": h.action,
                    "actor": h.performed_by.username if h.performed_by else None,
                    "date": h.created_at,
                }
                for h in complaint.history.all().order_by("-created_at")
            ]

            data = {
                "id": complaint.id,
                "title": complaint.title,
                "description": complaint.description,
                "category": complaint.category,
                "status": complaint.status,
                "created_at": complaint.created_at,

                "location": complaint.location,
                "ward": {
                    "name": complaint.ward.username,
                },
                "reassign_note": complaint.reassign_note,
                "reassigned_at": complaint.updated_at,

                "citizen": {
                    "name": complaint.citizen.username,
                    "email": complaint.citizen.email,
                    "phone": profile.phone if profile else None,
                },

                "media": [
                    {
                        "file": request.build_absolute_uri(m.file.url),
                        "type": m.file_type
                    } for m in complaint.media.all()
                ],

                "timeline": timeline
            }   

            logger.info(f"Ward {request.user.id} viewed reassigned complaint {complaint.id}")

            return success_response(
                message="Reassigned complaint details fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"ReassignedComplaintDetail error: {str(e)}")
            return error_response(message="Something went wrong", status=500)
        
        
        

        