from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsSuperAdmin
from django.db.models import Count
from apps.panchayath.models import PanchayathVerification
from rest_framework.permissions import IsAdminUser
from apps.ward.models import WardVerification
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from .serializers import AdminLoginSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from apps.ward.models import WardVerification
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from apps.accounts.models import User
from apps.complaints.models import Complaint
from apps.ward.models import WardVerification
from .permissions import IsSuperAdmin
from apps.ward.models import WardVerification
from apps.complaints.models import Complaint
from apps.citizen.models import CitizenVerification
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.utils import timezone
import logging
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.conf import settings
from .utils.responses import success_response,error_response


logger = logging.getLogger(__name__)



User = get_user_model()

from rest_framework.response import Response





class AdminLoginView(TokenObtainPairView):
    serializer_class = AdminLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            access = response.data.get("access")
            refresh = response.data.get("refresh")

            if not access or not refresh:
                return error_response(
                    message="Invalid login response",
                    status=400
                )
            response.data = {
                "message": "Login successful",
                "data": {
                    "role": "ADMIN",
                    "status": "ACTIVE",
                }
            }
            response.set_cookie(
                key="access_token",
                value=access,
                httponly=True,
                secure=True,  
                samesite="None"
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh,
                httponly=True,
                secure=True,
                samesite="None"
            )

            logger.info(f"Admin login success: {request.data.get('email')}")

            return response

        except Exception as e:
            logger.error(f"AdminLogin error: {str(e)}")

            return error_response(
                message="Login failed",
                status=500
            )
    
    

class AdminProfileView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            user = request.user

            logger.info(f"Admin {user.id} fetched profile")

            return success_response(
                message="Admin profile fetched",
                data={
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": "ADMIN",
                    "date_joined": user.date_joined,
                    "last_login": user.last_login,
                    "is_superuser": user.is_superuser,
                }
            )

        except Exception as e:
            logger.error(f"AdminProfile error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class AdminDashboardView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            total_panchayaths = User.objects.filter(role=User.Role.PANCHAYATH).count()
            total_citizens = User.objects.filter(role=User.Role.CITIZEN).count()

            total_wards = WardVerification.objects.filter(
                status="APPROVED"
            ).count()

            complaint_stats = Complaint.objects.aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
            )

            pending_citizen_verifications = CitizenVerification.objects.filter(
                status="PENDING"
            ).count()

            pending_ward_verifications = WardVerification.objects.filter(
                status="PENDING"
            ).count()
            
            pending_panchayath_verifications = PanchayathVerification.objects.filter(
                status = "PENDING"
            ).count()

            logger.info(f"Admin {request.user.id} accessed dashboard")

            return success_response(
                message="Dashboard data fetched",
                data={
                    "total_panchayaths": total_panchayaths,
                    "total_wards": total_wards,
                    "total_citizens": total_citizens,
                    "total_complaints": complaint_stats["total"],
                    "pending_complaints": complaint_stats["pending"],
                    "resolved_complaints": complaint_stats["resolved"],
                    "pending_citizen_verifications": pending_citizen_verifications,
                    "pending_ward_verifications": pending_ward_verifications,
                    "pending_panchayath_verifications":pending_panchayath_verifications,

                    # Chart
                    "complaint_status_chart": [
                        {"status": "Pending", "count": complaint_stats["pending"]},
                        {"status": "Resolved", "count": complaint_stats["resolved"]},
                    ],
                }
            )

        except Exception as e:
            logger.error(f"AdminDashboard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
        
        



class PanchayathVerificationListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            verifications = PanchayathVerification.objects.filter(
                status="PENDING"
            ).select_related("user").order_by("-submitted_at")

            paginator = PageNumberPagination()
            paginator.page_size = 10

            paginated_qs = paginator.paginate_queryset(verifications, request)

            data = [
                {
                    "id": v.id,
                    "panchayath_name": v.panchayath_name,
                    "username": v.user.username,
                    "email": v.user.email,
                    "phone": v.phone,
                    "district": v.district,
                    "status": v.status,
                    "submitted_at": v.submitted_at,
                }
                for v in paginated_qs
            ]

            logger.info(f"Admin {request.user.id} fetched panchayath verification list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"PanchayathVerificationList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
class PanchayathVerificationDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, pk):
        try:
            verification = get_object_or_404(PanchayathVerification, pk=pk)

            logger.info(f"Admin {request.user.id} viewed panchayath verification {verification.id}")

            return success_response(
                message="Panchayath verification details fetched",
                data={
                    "id": verification.id,
                    "panchayath_name": verification.panchayath_name,
                    "username": verification.user.username,
                    "email": verification.user.email,
                    "phone": verification.phone,
                    "district": verification.district,
                    "status": verification.status,
                    "reject_reason": verification.reject_reason,

                    "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url)
                    if verification.aadhaar_image else None,

                    "selfie_image": request.build_absolute_uri(verification.selfie_image.url)
                    if verification.selfie_image else None,

                    "submitted_at": verification.submitted_at,
                    "reviewed_at": verification.reviewed_at,
                }
            )

        except Exception as e:
            logger.error(f"PanchayathVerificationDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )




class ApprovePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):
        try:
            with transaction.atomic():

                verification = get_object_or_404(PanchayathVerification, pk=pk)
                if verification.status != "PENDING":
                    return error_response(
                        message="This request has already been reviewed",
                        status=400
                    )

                verification.status = "APPROVED"
                verification.reject_reason = None
                verification.reviewed_at = timezone.now()
                verification.save()

                user = verification.user
                user.status = User.Status.ACTIVE
                user.is_verified = True
                user.save()

                logger.info(f"Admin {request.user.id} approved Panchayath {verification.id}")

                return success_response(
                    message="Panchayath approved successfully"
                )

        except Exception as e:
            logger.error(f"ApprovePanchayath error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class RejectPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):
        try:
            reason = request.data.get("reason", "").strip()

            if not reason or len(reason) < 10:
                return error_response(
                    message="Rejection reason must be at least 10 characters",
                    status=400
                )

            with transaction.atomic():

                verification = get_object_or_404(PanchayathVerification, pk=pk)
                if verification.status != "PENDING":
                    return error_response(
                        message="This request has already been reviewed",
                        status=400
                    )

                verification.status = "REJECTED"
                verification.reject_reason = reason
                verification.reviewed_at = timezone.now()
                verification.save()

                user = verification.user
                user.status = User.Status.SUSPENDED
                user.is_verified = False
                user.save()

                logger.warning(f"Admin {request.user.id} rejected Panchayath {verification.id}")

                return success_response(
                    message="Panchayath rejected successfully"
                )

        except Exception as e:
            logger.error(f"RejectPanchayath error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    


class AdminPanchayathListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            status_filter = request.GET.get("status", "").lower()
            search = request.GET.get("search", "").strip()

            users = User.objects.filter(role=User.Role.PANCHAYATH)
            if status_filter == "approved":
                users = users.filter(status=User.Status.ACTIVE, is_verified=True)
            elif status_filter == "suspended":
                users = users.filter(status=User.Status.SUSPENDED)

            if search:
                users = users.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search)
                )

            users = users.order_by("-date_joined")

            paginator = PageNumberPagination()
            paginator.page_size = 10
            paginated_users = paginator.paginate_queryset(users, request)

            data = []

            for user in paginated_users:

                verification = getattr(user, "panchayath_verification", None)

                panchayath_name = (
                    verification.panchayath_name
                    if verification and verification.panchayath_name
                    else user.username
                )
                ward_qs = WardVerification.objects.filter(
                    panchayath=user,
                    status="APPROVED"
                )

                total_wards = ward_qs.count()

                ward_user_ids = ward_qs.values_list("user_id", flat=True)
                total_complaints = Complaint.objects.filter(
                    ward_id__in=ward_user_ids
                ).count()

                data.append({
                    "id": user.id,
                    "panchayath_name": panchayath_name,
                    "email": user.email,
                    "status": user.status,
                    "is_verified": user.is_verified,
                    "date_joined": user.date_joined,
                    "total_wards": total_wards,
                    "total_complaints": total_complaints
                })

            logger.info(f"Admin {request.user.id} fetched panchayath list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"AdminPanchayathList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )



class SuspendPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = get_object_or_404(
                User,
                id=user_id,
                role=User.Role.PANCHAYATH
            )

            if user.status == User.Status.SUSPENDED:
                return error_response(
                    message="Panchayath already suspended",
                    status=400
                )

            with transaction.atomic():
                user.status = User.Status.SUSPENDED
                user.is_verified = False
                user.save(update_fields=["status", "is_verified"])

                ward_verifications = WardVerification.objects.filter(
                    panchayath=user
                )

                ward_users = User.objects.filter(
                    id__in=ward_verifications.values_list("user_id", flat=True)
                )

                ward_users.update(
                    status=User.Status.SUSPENDED,
                    is_verified=False
                )

            logger.warning(f"Admin {request.user.id} suspended Panchayath {user.id}")

            return success_response(
                message="Panchayath and its wards suspended successfully"
            )

        except Exception as e:
            logger.error(f"SuspendPanchayath error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class ActivatePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = get_object_or_404(
                User,
                id=user_id,
                role=User.Role.PANCHAYATH
            )

            if user.status == User.Status.ACTIVE:
                return error_response(
                    message="Panchayath already active",
                    status=400
                )

            with transaction.atomic():
                user.status = User.Status.ACTIVE
                user.is_verified = True
                user.save(update_fields=["status", "is_verified"])

            logger.info(f"Admin {request.user.id} activated Panchayath {user.id}")

            return success_response(
                message="Panchayath activated successfully"
            )

        except Exception as e:
            logger.error(f"ActivatePanchayath error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class RecentVerificationsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        try:
            verifications = (
                PanchayathVerification.objects
                .filter(status="PENDING")
                .select_related("user")
                .order_by("-submitted_at")[:5]
            )

            data = [
                {
                    "id": v.id,
                    "panchayath_name": v.panchayath_name,
                    "district": v.district,
                    "submitted_at": v.submitted_at,
                }
                for v in verifications
            ]

            logger.info(f"Admin {request.user.id} fetched recent verifications")

            return success_response(
                message="Recent verifications fetched",
                data=data
            )

        except Exception as e:
            logger.error(f"RecentVerifications error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
class CriticalAlertsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        try:
            alerts = []

            pending_count = PanchayathVerification.objects.filter(
                status="PENDING"
            ).count()

            suspended_count = User.objects.filter(
                role=User.Role.PANCHAYATH,
                status=User.Status.SUSPENDED
            ).count()

            if pending_count > 5:
                alerts.append({
                    "type": "PENDING_OVERLOAD",
                    "message": f"{pending_count} pending verifications need review"
                })

            if suspended_count > 3:
                alerts.append({
                    "type": "SUSPENDED_HIGH",
                    "message": f"{suspended_count} panchayaths are suspended"
                })

            logger.info(f"Admin {request.user.id} checked alerts")

            return success_response(
                message="Alerts fetched",
                data=alerts
            )

        except Exception as e:
            logger.error(f"CriticalAlerts error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    

class AdminWardListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            panchayath_id = request.GET.get("panchayath")

            wards = WardVerification.objects.filter(
                status="APPROVED"
            ).select_related("user", "panchayath")

            if panchayath_id:
                wards = wards.filter(panchayath_id=panchayath_id)

            wards = wards.order_by("-submitted_at")

            paginator = PageNumberPagination()
            paginator.page_size = 10
            paginated_qs = paginator.paginate_queryset(wards, request)

            data = []

            for ward in paginated_qs:
                ward_user = ward.user

                total_users = CitizenVerification.objects.filter(
                    ward=ward_user,
                    status="APPROVED"
                ).count()

                total_complaints = Complaint.objects.filter(
                    ward=ward_user
                ).count()

                pending_complaints = Complaint.objects.filter(
                    ward=ward_user,
                    status="PENDING"
                ).count()

                data.append({
                    "id": ward_user.id,
                    "verification_id": ward.id,
                    "ward_name": ward.ward_name,
                    "officer_name": ward.officer_full_name,
                    "email": ward.official_email,
                    "panchayath_name": ward.panchayath.username if ward.panchayath else None,
                    "total_users": total_users,
                    "total_complaints": total_complaints,
                    "pending_complaints": pending_complaints,
                    "status": ward_user.status
                })

            logger.info(f"Admin {request.user.id} fetched ward list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"AdminWardList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class SuspendWardView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = get_object_or_404(
                User,
                id=user_id,
                role=User.Role.WARD
            )

            if user.status == User.Status.SUSPENDED:
                return error_response(
                    message="Ward already suspended",
                    status=400
                )

            with transaction.atomic():
                user.status = User.Status.SUSPENDED
                user.is_verified = False
                user.save(update_fields=["status", "is_verified"])

            logger.warning(f"Admin {request.user.id} suspended Ward {user.id}")

            return success_response(
                message="Ward suspended successfully"
            )

        except Exception as e:
            logger.error(f"SuspendWard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class ActivateWardView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = get_object_or_404(
                User,
                id=user_id,
                role=User.Role.WARD
            )

            if user.status == User.Status.ACTIVE:
                return error_response(
                    message="Ward already active",
                    status=400
                )

            with transaction.atomic():
                user.status = User.Status.ACTIVE
                user.is_verified = True
                user.save(update_fields=["status", "is_verified"])

            logger.info(f"Admin {request.user.id} activated Ward {user.id}")

            return success_response(
                message="Ward activated successfully"
            )

        except Exception as e:
            logger.error(f"ActivateWard error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
    
class AdminPanchayathDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, user_id):
        try:
            user = get_object_or_404(
                User,
                id=user_id,
                role=User.Role.PANCHAYATH
            )

            verification = getattr(user, "panchayath_verification", None)

            wards = WardVerification.objects.filter(
                panchayath=user,
                status="APPROVED"
            ).select_related("user")

            total_wards = wards.count()

            ward_user_ids = wards.values_list("user_id", flat=True)
            
            complaint_stats = Complaint.objects.filter(
                ward_id__in=ward_user_ids
            ).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
            )

            total_citizens = CitizenVerification.objects.filter(
                ward_id__in=ward_user_ids,
                status="APPROVED"
            ).count()

            ward_list = []

            for ward in wards:
                ward_user = ward.user

                ward_stats = Complaint.objects.filter(
                    ward=ward_user
                ).aggregate(
                    total=Count("id"),
                    pending=Count("id", filter=Q(status="PENDING"))
                )

                total_users = CitizenVerification.objects.filter(
                    ward=ward_user,
                    status="APPROVED"
                ).count()

                ward_list.append({
                    "id": ward_user.id,
                    "ward_name": ward.ward_name,
                    "officer_name": ward.officer_full_name,
                    "email": ward.official_email,
                    "panchayath_name": user.username,

                    "total_users": total_users,
                    "total_complaints": ward_stats["total"],
                    "pending_complaints": ward_stats["pending"],

                    "status": ward_user.status
                })

            logger.info(f"Admin {request.user.id} viewed Panchayath {user.id}")

            return success_response(
                message="Panchayath details fetched",
                data={
                    "id": user.id,
                    "panchayath_name": verification.panchayath_name if verification else user.username,
                    "email": user.email,
                    "status": user.status,
                    "date_joined": user.date_joined,

                    "total_wards": total_wards,
                    "total_complaints": complaint_stats["total"],
                    "pending_complaints": complaint_stats["pending"],
                    "resolved_complaints": complaint_stats["resolved"],
                    "total_citizens": total_citizens,

                    "authority": {
                        "name": verification.panchayath_name if verification else user.username,
                        "email": user.email,
                        "phone": verification.phone if verification else None,
                        "office_address": verification.district if verification else None,
                        "joined_date": user.date_joined
                    },

                    "wards": ward_list
                }
            )

        except Exception as e:
            logger.error(f"AdminPanchayathDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
      
      
      
        
class AdminWardDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, pk):
        try:
            ward = get_object_or_404(
                WardVerification.objects.select_related("user", "panchayath"),
                user__id=pk
            )

            ward_user = ward.user

            complaint_stats = Complaint.objects.filter(
                ward=ward_user
            ).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
                escalated=Count("id", filter=Q(status="ESCALATED")),
            )

            citizens = CitizenVerification.objects.filter(
                ward=ward_user,
                status="APPROVED"
            ).select_related("user")

            members = [
                {
                    "id": c.user.id,
                    "name": c.user.username,
                    "email": c.user.email,
                    "status": c.user.status,
                    "joined_date": c.user.date_joined
                }
                for c in citizens
            ]

            complaints_qs = Complaint.objects.filter(
                ward=ward_user
            ).order_by("-created_at")[:10]

            complaints = [
                {
                    "id": c.id,
                    "title": c.title,
                    "status": c.status,
                    "created_at": c.created_at
                }
                for c in complaints_qs
            ]

            logger.info(f"Admin {request.user.id} viewed ward {ward.id}")

            return success_response(
                message="Ward details fetched",
                data={
                    "id": ward.id,
                    "ward_name": ward.ward_name,

                    "officer": {
                        "name": ward.officer_full_name,
                        "email": ward.official_email,
                        "phone": ward.official_contact,
                    },

                    "panchayath_name": ward.panchayath.username,
                    "status": ward_user.status,

                    "members": members,
                    "complaints": complaints,

                    "statistics": {
                        "total_citizens": citizens.count(),
                        "total_complaints": complaint_stats["total"],
                        "pending_complaints": complaint_stats["pending"],
                        "resolved_complaints": complaint_stats["resolved"],
                        "escalated_complaints": complaint_stats["escalated"],
                    }
                }
            )

        except Exception as e:
            logger.error(f"AdminWardDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )





class RequestAdminEmailChange(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):
        try:
            user = request.user
            new_email = request.data.get("new_email", "").strip()

            if not new_email:
                return error_response(
                    message="New email is required",
                    status=400
                )

            if User.objects.filter(email=new_email).exists():
                return error_response(
                    message="Email already exists",
                    status=400
                )

            otp = str(random.randint(100000, 999999))

            cache.set(
                f"admin_email_change_{user.id}",
                {
                    "otp": otp,
                    "new_email": new_email
                },
                timeout=300 
            )

            generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

            send_mail(
                subject="SPIMS Admin Email Change Verification",
                message=f"""
Hello {user.username},

Your OTP for email change:

{otp}

Generated at: {generated_time}
Valid for: 5 minutes

If not requested, ignore this.
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
            )

            logger.info(f"Admin {user.id} requested email change")

            return success_response(
                message="OTP sent to your current email"
            )

        except Exception as e:
            logger.error(f"RequestAdminEmailChange error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class VerifyAdminEmailChange(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):
        try:
            user = request.user
            otp = request.data.get("otp", "").strip()

            if not otp:
                return error_response(
                    message="OTP is required",
                    status=400
                )

            cache_data = cache.get(f"admin_email_change_{user.id}")

            if not cache_data:
                return error_response(
                    message="OTP expired or not found",
                    status=400
                )

            if cache_data.get("otp") != otp:
                return error_response(
                    message="Invalid OTP",
                    status=400
                )

            new_email = cache_data.get("new_email")

            if not new_email:
                return error_response(
                    message="Invalid data",
                    status=400
                )

            user.email = new_email
            user.save()

            cache.delete(f"admin_email_change_{user.id}")

            logger.info(f"Admin {user.id} changed email successfully")

            return success_response(
                message="Email updated successfully"
            )

        except Exception as e:
            logger.error(f"VerifyAdminEmailChange error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    



class AdminChangePasswordView(APIView):
    permission_classes = [IsSuperAdmin]

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

            logger.warning(f"Admin {user.id} changed password")

            return success_response(
                message="Password changed successfully"
            )

        except Exception as e:
            logger.error(f"AdminChangePassword error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class AdminCitizenListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            search = request.GET.get("search", "").strip()
            ward_filter = request.GET.get("ward", "").strip()
            panchayath_filter = request.GET.get("panchayath", "").strip()

            citizens = User.objects.filter(
                role=User.Role.CITIZEN,
                citizen_verification__status="APPROVED"
            ).select_related("citizen_verification")
            if search:
                citizens = citizens.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search)
                )

            paginator = PageNumberPagination()
            paginator.page_size = 10
            paginated_qs = paginator.paginate_queryset(citizens, request)

            data = []

            for user in paginated_qs:
                verification = user.citizen_verification

                ward_verification = WardVerification.objects.select_related(
                    "panchayath"
                ).filter(user=verification.ward).first()

                ward_name = ward_verification.ward_name if ward_verification else None
                panchayath_name = None

                if ward_verification:
                    panchayath_verification = PanchayathVerification.objects.filter(
                        user=ward_verification.panchayath
                    ).first()

                    if panchayath_verification:
                        panchayath_name = panchayath_verification.panchayath_name
                if ward_filter and (not ward_name or ward_filter.lower() not in ward_name.lower()):
                    continue

                if panchayath_filter and (not panchayath_name or panchayath_filter.lower() not in panchayath_name.lower()):
                    continue

                data.append({
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "status": user.status,
                    "is_verified": user.is_verified,
                    "ward": ward_name,
                    "panchayath": panchayath_name,
                    "submitted_at": verification.submitted_at,
                })

            logger.info(f"Admin {request.user.id} fetched citizen list")

            return paginator.get_paginated_response(data)

        except Exception as e:
            logger.error(f"AdminCitizenList error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
class AdminCitizenDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, user_id):
        try:
            user = User.objects.filter(
                id=user_id,
                role=User.Role.CITIZEN
            ).select_related("citizen_verification").first()

            if not user:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            verification = user.citizen_verification

            if not verification or verification.status != "APPROVED":
                return error_response(
                    message="Citizen not verified",
                    status=400
                )

            ward_verification = WardVerification.objects.select_related(
                "panchayath"
            ).filter(user=verification.ward).first()

            ward_name = ward_verification.ward_name if ward_verification else None
            panchayath_name = None

            if ward_verification:
                panchayath_verification = PanchayathVerification.objects.filter(
                    user=ward_verification.panchayath
                ).first()

                if panchayath_verification:
                    panchayath_name = panchayath_verification.panchayath_name

            logger.info(f"Admin {request.user.id} viewed citizen {user.id}")

            return success_response(
                message="Citizen details fetched",
                data={
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "status": user.status,

                    "full_name": verification.full_name,
                    "phone": verification.phone,
                    "house_number": verification.house_number,
                    "street_name": verification.street_name,

                    "ward": ward_name,
                    "panchayath": panchayath_name,

                    "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url) if verification.aadhaar_image else None,
                    "selfie_image": request.build_absolute_uri(verification.selfie_image.url) if verification.selfie_image else None,

                    "submitted_at": verification.submitted_at,
                }
            )

        except Exception as e:
            logger.error(f"AdminCitizenDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    

class SuspendCitizenView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = User.objects.filter(
                id=user_id,
                role=User.Role.CITIZEN
            ).first()

            if not user:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            if user.status == User.Status.SUSPENDED:
                return error_response(
                    message="Citizen already suspended",
                    status=400
                )

            user.status = User.Status.SUSPENDED
            user.is_verified = False
            user.save()

            logger.warning(f"Admin {request.user.id} suspended Citizen {user.id}")

            return success_response(
                message="Citizen suspended successfully"
            )

        except Exception as e:
            logger.error(f"SuspendCitizen error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    

class ActivateCitizenView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = User.objects.filter(
                id=user_id,
                role=User.Role.CITIZEN
            ).first()

            if not user:
                return error_response(
                    message="Citizen not found",
                    status=404
                )

            if user.status == User.Status.ACTIVE:
                return error_response(
                    message="Citizen already active",
                    status=400
                )

            user.status = User.Status.ACTIVE
            user.is_verified = True
            user.save()

            logger.info(f"Admin {request.user.id} activated Citizen {user.id}")

            return success_response(
                message="Citizen activated successfully"
            )

        except Exception as e:
            logger.error(f"ActivateCitizen error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "role": "ADMIN" if request.user.is_superuser else "USER",
            "username": request.user.username
        })
        
        
        
        