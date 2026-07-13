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
from .serializers import AdminLoginSerializer,LocationRequestListSerializer
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
from apps.complaints.serializers import ComplaintDetailSerializer
from apps.notification.utils import send_notification
from apps.accounts.models import (
    LocationRequest,
    District,
    Panchayath,
    Ward,
)
from apps.accounts.models import LocationRequest
from .pagination import CustomPagination
import traceback


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

                    "access": access,
                    "refresh": refresh,

                    "role": "ADMIN",
                    "status": "ACTIVE",
                }
            }
            
            
            # response.delete_cookie("ward_access_token")
            # response.delete_cookie("ward_refresh_token")

            # response.delete_cookie("panchayath_access_token")
            # response.delete_cookie("panchayath_refresh_token")

            # response.delete_cookie("citizen_access_token")
            # response.delete_cookie("citizen_refresh_token")
            
            response.set_cookie(
                key="admin_access_token",
                value=access,
                httponly=True,
                secure=False,  
                samesite="Lax"
            )
            
            

            response.set_cookie(
                key="admin_refresh_token",
                value=refresh,
                httponly=True,
                secure=False,
                samesite="Lax"
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
            
            
            waiting_citizens = CitizenVerification.objects.filter(
                status="WAITING_FOR_WARD"
            ).count()

            waiting_wards = WardVerification.objects.filter(
                status="WAITING_FOR_PANCHAYATH"
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
                    "waiting_citizens": waiting_citizens,
                    "waiting_wards": waiting_wards,
                    
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
            status = request.GET.get("status", "PENDING").upper()

            verifications = PanchayathVerification.objects.filter(
                status=status
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
                
            
                waiting_wards = WardVerification.objects.filter(
                    panchayath_master=verification.panchayath_master,
                    status="WAITING_FOR_PANCHAYATH"
                )

                for ward in waiting_wards:

                    ward.panchayath = verification.user
                    ward.status = "PENDING"
                    ward.reject_reason = None
                    ward.reviewed_at = None
                    ward.save()

                    send_notification(
                        user=verification.user,
                        title="New Ward Verification",
                        message=f"{ward.officer_full_name} is waiting for verification.",
                        n_type="WARD_VERIFICATION",
                        sender=ward.user,
                        extra_data={
                            "verification_id": ward.id
                        }
                    )

                    send_notification(
                        user=ward.user,
                        title="Verification Assigned",
                        message="A Panchayath Officer has been assigned to review your verification.",
                        n_type="WARD_VERIFICATION",
                        sender=verification.user,
                        extra_data={
                            "verification_id": ward.id
                        }
                    )
                
                
                
                send_notification(
                    user=user,
                    title="Verification Approved",
                    message="Your Panchayath verification has been approved.",
                    n_type="PANCHAYATH_VERIFICATION",
                )
                
                

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
                # user.status = User.Status.SUSPENDED
                user.is_verified = False
                # user.save()
                user.save(update_fields=["is_verified"])
                
                
                
                send_notification(
                    user=user,
                    title="Verification Rejected",
                    message=f"Your Panchayath verification was rejected. Reason: {reason}",
                    n_type="PANCHAYATH_VERIFICATION",
                )

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
    
    


# class AdminPanchayathListView(APIView):
#     permission_classes = [IsSuperAdmin]

#     def get(self, request):
#         try:
#             status_filter = request.GET.get("status", "").lower()
#             # search = request.GET.get("search", "").strip()
            
            
#             name = request.GET.get("name", "").strip()
#             email = request.GET.get("email", "").strip()
#             complaint_sort = request.GET.get("complaints")

#             users = User.objects.filter(role=User.Role.PANCHAYATH)
#             if status_filter == "approved":
#                 users = users.filter(status=User.Status.ACTIVE, is_verified=True)
#             elif status_filter == "suspended":
#                 users = users.filter(status=User.Status.SUSPENDED)

#             # if search:
#             #     users = users.filter(
#             #         Q(username__icontains=search) |
#             #         Q(email__icontains=search)
#             #     )
            
            
#             if name:
#                 users = users.filter(
#                     Q(username__icontains=name) |
#                     Q(
#                         panchayath_verification__panchayath_name__icontains=name
#                     )
#                 )

#             if email:
#                 users = users.filter(
#                     email__icontains=email
#                 )

#             users = users.order_by("-date_joined")

#             paginator = PageNumberPagination()
#             paginator.page_size = 10
#             paginated_users = paginator.paginate_queryset(users, request)

#             data = []
            
            
            

#             for user in paginated_users:

#                 verification = getattr(user, "panchayath_verification", None)

#                 panchayath_name = (
#                     verification.panchayath_name
#                     if verification and verification.panchayath_name
#                     else user.username
#                 )
#                 ward_qs = WardVerification.objects.filter(
#                     panchayath=user,
#                     status="APPROVED"
#                 )

#                 total_wards = ward_qs.count()

#                 ward_ids = ward_qs.values_list("ward_master_id", flat=True)

#                 total_complaints = Complaint.objects.filter(
#                     ward_id__in=ward_ids
#                 ).count()

#                 data.append({
#                     "id": user.id,
#                     "panchayath_name": panchayath_name,
#                     "email": user.email,
#                     "status": user.status,
#                     "is_verified": user.is_verified,
#                     "date_joined": user.date_joined,
#                     "total_wards": total_wards,
#                     "total_complaints": total_complaints
#                 })
                
                
                
#             if complaint_sort == "high":
#                 data = sorted(
#                     data,
#                     key=lambda x: x["total_complaints"],
#                     reverse=True
#                 )

#             elif complaint_sort == "low":
#                 data = sorted(
#                     data,
#                     key=lambda x: x["total_complaints"]
#                 )

#             logger.info(f"Admin {request.user.id} fetched panchayath list")

#             return paginator.get_paginated_response(data)

#         except Exception as e:
#             logger.error(f"AdminPanchayathList error: {str(e)}")

#             return error_response(
#                 message="Something went wrong",
#                 status=500
#             )



class AdminPanchayathListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            status_filter = request.GET.get("status", "").lower()
            name = request.GET.get("name", "").strip()
            email = request.GET.get("email", "").strip()
            complaint_sort = request.GET.get("complaints")

            users = User.objects.filter(
                role=User.Role.PANCHAYATH
            )

            if status_filter == "approved":
                users = users.filter(
                    status=User.Status.ACTIVE,
                    is_verified=True
                )

            elif status_filter == "suspended":
                users = users.filter(
                    status=User.Status.SUSPENDED
                )

            if name:
                users = users.filter(
                    Q(username__icontains=name) |
                    Q(
                        panchayath_verification__panchayath_name__icontains=name
                    )
                )

            if email:
                users = users.filter(
                    email__icontains=email
                )

            users = users.prefetch_related(
                "panchayath_verification"
            ).annotate(

                total_wards=Count(
                    "assigned_wards",
                    filter=Q(
                        assigned_wards__status="APPROVED"
                    ),
                    distinct=True,
                ),

                total_complaints=Count(
                    "assigned_wards__ward_master__complaints",
                    filter=Q(
                        assigned_wards__status="APPROVED"
                    ),
                    distinct=True,
                ),

            )

            if complaint_sort == "high":

                users = users.order_by(
                    "-total_complaints",
                    "-date_joined"
                )

            elif complaint_sort == "low":

                users = users.order_by(
                    "total_complaints",
                    "-date_joined"
                )

            else:

                users = users.order_by(
                    "-date_joined"
                )

            paginator = PageNumberPagination()
            paginator.page_size = 10

            paginated_users = paginator.paginate_queryset(
                users,
                request
            )

            data = []

            for user in paginated_users:

                verification = getattr(
                    user,
                    "panchayath_verification",
                    None
                )

                panchayath_name = (
                    verification.panchayath_name
                    if verification and verification.panchayath_name
                    else user.username
                )

                data.append({

                    "id": user.id,
                    "panchayath_name": panchayath_name,
                    "email": user.email,
                    "status": user.status,
                    "is_verified": user.is_verified,
                    "date_joined": user.date_joined,
                    "total_wards": user.total_wards,
                    "total_complaints": user.total_complaints,

                })

            logger.info(
                f"Admin {request.user.id} fetched panchayath list"
            )

            return paginator.get_paginated_response(
                data
            )

        except Exception as e:

            logger.error(
                f"AdminPanchayathList error: {str(e)}"
            )

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
                
                
                
                
                send_notification(
                    user=user,
                    title="Account Suspended",
                    message="Your Panchayath account has been suspended by the administrator.",
                    n_type="ALERT",
                )

                waiting_wards = WardVerification.objects.filter(
                    panchayath=user,
                    status="PENDING"
                )

                for ward in waiting_wards:

                    ward.panchayath = None
                    ward.status = "WAITING_FOR_PANCHAYATH"
                    ward.reviewed_at = None
                    ward.reject_reason = None
                    ward.save()

                    send_notification(
                        user=ward.user,
                        title="Verification Delayed",
                        message=(
                            "Your assigned Panchayath Officer is no longer available. "
                            "Your verification will automatically continue when a new Panchayath Officer is approved."
                        ),
                        n_type="WARD_VERIFICATION",
                        sender=request.user,
                        extra_data={
                            "verification_id": ward.id
                        }
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
                
                
                send_notification(
                    user=user,
                    title="Account Activated",
                    message="Your Panchayath account has been activated by the administrator.",
                    n_type="ALERT",
                )

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
            # panchayath_id = request.GET.get("panchayath")
            
            panchayath_id = request.GET.get("panchayath")

            name = request.GET.get("name", "").strip()

            email = request.GET.get("email", "").strip()

            status = request.GET.get("status", "").strip()

            complaints = request.GET.get("complaints")

            wards = WardVerification.objects.filter(
                status="APPROVED"
            ).select_related("user", "panchayath")
            
            
            

            if panchayath_id:
                wards = wards.filter(panchayath_id=panchayath_id)
                
                
            if name:

                wards = wards.filter(
                    ward_name__icontains=name
                )

            if email:

                wards = wards.filter(
                    official_email__icontains=email
                )
                
            if status:

                wards = wards.filter(
                    user__status=status.upper()
                )

            wards = wards.order_by("-submitted_at")

            paginator = PageNumberPagination()
            paginator.page_size = 10
            paginated_qs = paginator.paginate_queryset(wards, request)

            data = []

            for ward in paginated_qs:

                ward_master = ward.ward_master
                
                
                ward_user = ward.user

                total_users = CitizenVerification.objects.filter(
                    ward=ward_master,
                    status="APPROVED"
                ).count()

                total_complaints = Complaint.objects.filter(
                    ward=ward_master
                ).count()

                pending_complaints = Complaint.objects.filter(
                    ward=ward_master,
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

            if complaints == "high":

                data = sorted(
                    data,
                    key=lambda x: x["total_complaints"],
                    reverse=True
                )

            elif complaints == "low":

                data = sorted(
                    data,
                    key=lambda x: x["total_complaints"]
                )
                
                
            logger.info(f"Admin {request.user.id} fetched ward list")

            return paginator.get_paginated_response(data)

        

        except Exception as e:
            traceback.print_exc()

            logger.error(f"AdminWardList error: {str(e)}")

            return error_response(
                message=str(e),
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
                
                ward_verification = get_object_or_404(
                    WardVerification,
                    user=user
                )

                waiting_citizens = CitizenVerification.objects.filter(
                    ward=ward_verification.ward_master,
                    status="PENDING"
                )

                for citizen in waiting_citizens:

                    citizen.ward = None
                    citizen.status = "WAITING_FOR_WARD"
                    citizen.reviewed_at = None
                    citizen.reject_reason = None
                    citizen.save()

                    send_notification(
                        user=citizen.user,
                        title="Verification Delayed",
                        message=(
                            "Your assigned Ward Officer is no longer available. "
                            "Your verification will automatically continue when a new Ward Officer is approved."
                        ),
                        n_type="CITIZEN_VERIFICATION",
                        sender=request.user,
                        extra_data={
                            "verification_id": citizen.id
                        }
                    )
                
                
                send_notification(
                    user=user,
                    title="Account Suspended",
                    message="Your Ward account has been suspended by the administrator.",
                    n_type="ALERT",
                )

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
                
                
                send_notification(
                    user=user,
                    title="Account Activated",
                    message="Your Ward account has been activated by the administrator.",
                    n_type="ALERT",
                )

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

            ward_ids = wards.values_list("ward_master_id", flat=True)

            complaint_stats = Complaint.objects.filter(
                ward_id__in=ward_ids
            ).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
            )

            total_citizens = CitizenVerification.objects.filter(
                ward_id__in=ward_ids,
                status="APPROVED"
            ).count()

            ward_list = []

            for ward in wards:
                ward_master = ward.ward_master
                ward_user = ward.user
                ward_stats = Complaint.objects.filter(
                    ward=ward_master
                ).aggregate(
                    total=Count("id"),
                    pending=Count("id", filter=Q(status="PENDING"))
                )

                total_users = CitizenVerification.objects.filter(
                    ward=ward.ward_master,
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

            ward_master = ward.ward_master
            
            ward_user = ward.user

            complaint_stats = Complaint.objects.filter(
                ward=ward_master
            ).aggregate(
                total=Count("id"),
                pending=Count("id", filter=Q(status="PENDING")),
                resolved=Count("id", filter=Q(status="RESOLVED")),
                escalated=Count("id", filter=Q(status="ESCALATED")),
            )

            citizens = CitizenVerification.objects.filter(
                ward=ward.ward_master,
                status="APPROVED"
            ).select_related("user")
            
            
            print("Ward Master:", ward.ward_master)
            print(
                CitizenVerification.objects.filter(
                    ward=ward.ward_master
                ).values(
                    "id",
                    "full_name",
                    "ward_id",
                    "status"
                )
            )

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
                ward=ward_master
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
            import traceback
            traceback.print_exc()

            logger.error(f"AdminWardDetail error: {str(e)}")

            return error_response(
                message=str(e),
                status=500
            )
            
            
            
class AdminComplaintDetailView(APIView):

    permission_classes = [IsSuperAdmin]

    def get(self, request, complaint_id):

        try:

            complaint = Complaint.objects.select_related(
                "citizen",
                "ward",
                "panchayath"
            ).prefetch_related(
                "media",
                "history",
                "resolution__media"
            ).filter(
                id=complaint_id
            ).first()

            if not complaint:

                return error_response(
                    message="Complaint not found",
                    status=404
                )

            citizen = complaint.citizen

            citizen_verification = getattr(
                citizen,
                "citizen_verification",
                None
            )

            ward_verification = WardVerification.objects.filter(
                ward_master=complaint.ward
            ).first()

            panchayath_verification = None

            if complaint.panchayath:

                panchayath_verification = getattr(
                    complaint.panchayath,
                    "panchayath_verification",
                    None
                )

            serializer = ComplaintDetailSerializer(
                complaint
            )

            return success_response(

                message="Complaint detail fetched",

                data={

                    **serializer.data,

                    "citizen": {

                        "id": citizen.id,

                        "name": citizen.username,

                        "email": citizen.email,

                        "phone": (
                            citizen_verification.phone
                            if citizen_verification
                            else None
                        )

                    },

                    "ward": {

                        "id": complaint.ward.id,

                        "name": (
                            ward_verification.ward_name
                            if ward_verification
                            else None
                        )

                    },

                    "panchayath": {

                        "id": (
                            complaint.panchayath.id
                            if complaint.panchayath
                            else None
                        ),

                        "name": (

                            panchayath_verification.panchayath_name

                            if panchayath_verification

                            else None

                        )

                    },

                    "timeline":[

                        {

                            "action":h.action,

                            "note":h.note,

                            "time":h.created_at,

                            "user":(

                                h.performed_by.username

                                if h.performed_by

                                else None

                            )

                        }

                        for h in complaint.history.all()

                    ]

                }

            )

        except Exception as e:

            logger.error(
                f"AdminComplaintDetail error:{str(e)}"
            )

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
            status_filter = request.GET.get("status", "").strip()

            citizens = User.objects.filter(
                role=User.Role.CITIZEN,
                citizen_verification__status="APPROVED"
            ).select_related("citizen_verification").order_by("-citizen_verification__submitted_at")
            if search:
                citizens = citizens.filter(
                    Q(username__icontains=search) |
                    Q(email__icontains=search)
                )
                
            if status_filter:

                citizens = citizens.filter(
                    status=status_filter.upper()
                )

            paginator = PageNumberPagination()
            paginator.page_size = 10
            paginated_qs = paginator.paginate_queryset(citizens, request)

            data = []

            for user in paginated_qs:
                verification = user.citizen_verification

                ward_verification = WardVerification.objects.select_related(
                    "panchayath"
                ).filter(
                    ward_master=verification.ward,
                    status="APPROVED"
                ).first()

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
            import traceback
            traceback.print_exc()

            logger.error(f"AdminCitizenList error: {str(e)}")

            return error_response(
                message=str(e),
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
            ).filter(
                ward_master=verification.ward,
                status="APPROVED"
            ).first()

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
            
            
            
            send_notification(
                user=user,
                title="Account Suspended",
                message="Your account has been suspended by the administrator.",
                n_type="ALERT",
            )

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
            
            
            
            
            send_notification(
                user=user,
                title="Account Activated",
                message="Your account has been activated by the administrator.",
                n_type="ALERT",
            )
            

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
        "id": request.user.id,
        "email": request.user.email,
        "role": "ADMIN",
        "status": "ACTIVE",
        "is_verified": True
    })
        
        
class LocationRequestListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        status = request.GET.get("status")
        request_type = request.GET.get("request_type")

        all_requests = LocationRequest.objects.all()

        counts = {
            "pending": all_requests.filter(status="PENDING").count(),
            "hold": all_requests.filter(status="HOLD").count(),
            "completed": all_requests.filter(status="COMPLETED").count(),
            "rejected": all_requests.filter(status="REJECTED").count(),
        }

        queryset = all_requests

        if status:
            queryset = queryset.filter(status=status)

        if request_type:
            queryset = queryset.filter(
                request_type=request_type
            )

        queryset = queryset.order_by("-created_at")

        paginator = CustomPagination()

        page = paginator.paginate_queryset(
            queryset,
            request
        )

        serializer = LocationRequestListSerializer(
            page,
            many=True
        )

        return paginator.get_paginated_response({
            "requests": serializer.data,
            "counts": counts,
        })
        
        
        
class CreateLocationView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):

        location_type = request.data.get("location_type")

        if location_type == "DISTRICT":

            name = request.data.get("name")

            if District.objects.filter(
                name__iexact=name
            ).exists():

                return error_response(
                    message="District already exists",
                    status=400
                )

            district = District.objects.create(
                name=name
            )

            return success_response(
                message="District created successfully",
                data={
                    "id": district.id
                }
            )

        elif location_type == "PANCHAYATH":

            district_id = request.data.get("district")

            name = request.data.get("name")
            
            code = request.data.get("code")

            district = get_object_or_404(
                District,
                id=district_id
            )

            if Panchayath.objects.filter(
                district=district,
                name__iexact=name
            ).exists():

                return error_response(
                    message="Panchayath already exists",
                    status=400
                )

            panchayath = Panchayath.objects.create(
                district=district,
                name=name,
                code = code
            )

            return success_response(
                message="Panchayath created successfully",
                data={
                    "id": panchayath.id
                }
            )

        elif location_type == "WARD":

            panchayath_id = request.data.get("panchayath")

            ward_number = request.data.get("ward_number")

            ward_name = request.data.get("ward_name")
            
            code = request.data.get("code")

            panchayath = get_object_or_404(
                Panchayath,
                id=panchayath_id
            )

            if Ward.objects.filter(
                panchayath=panchayath,
                ward_number=ward_number
            ).exists():

                return error_response(
                    message="Ward already exists",
                    status=400
                )

            ward = Ward.objects.create(
                panchayath=panchayath,
                ward_number=ward_number,
                ward_name=ward_name,
                code=code
            )

            return success_response(
                message="Ward created successfully",
                data={
                    "id": ward.id
                }
            )

        return error_response(
            message="Invalid location type",
            status=400
        )
        
        
class ExistingLocationsView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        location_type = request.GET.get("type")

        district = request.GET.get("district")

        panchayath = request.GET.get("panchayath")

        if location_type == "DISTRICT":

            data = District.objects.order_by("name").values(
                "id",
                "name"
            )

        elif location_type == "PANCHAYATH":

            data = Panchayath.objects.filter(
                district_id=district
            ).order_by("name").values(
                "id",
                "name"
            )

        elif location_type == "WARD":

            data = Ward.objects.filter(
                panchayath_id=panchayath
            ).order_by("ward_number").values(
                "id",
                "ward_number",
                "ward_name"
            )

        else:

            data = []

        return success_response(data=list(data))
        
        
        
class CompleteLocationRequestView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):

        req = get_object_or_404(
            LocationRequest,
            id=pk
        )

        if req.status not in ["PENDING", "HOLD"]:

            return error_response(
                message="Request already processed",
                status=400
            )

        message = request.data.get(
            "admin_note",
            "Your requested location has been created."
        )

        req.status = "COMPLETED"
        req.admin_note = message
        req.save()

        send_notification(
            user=req.requested_by,
            title="Location Request Completed",
            message=message,
            n_type="ALERT"
        )

        return success_response(
            message="Request completed successfully"
        )
        
        
        
class HoldLocationRequestView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):

        req = get_object_or_404(
            LocationRequest,
            id=pk
        )

        if req.status != "PENDING":

            return error_response(
                message="Request already processed",
                status=400
            )

        message = request.data.get(
            "admin_note",
            "Your request for location is under review."
        )

        req.status = "HOLD"
        req.admin_note = message
        req.save()

        send_notification(
            user=req.requested_by,
            title="Location Request On Hold",
            message=message,
            n_type="ALERT"
        )

        return success_response(
            message="Request moved to hold"
        )
        
        
        
class RejectLocationRequestView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):

        req = get_object_or_404(
            LocationRequest,
            id=pk
        )

        if req.status not in ["PENDING", "HOLD"]:

            return error_response(
                message="Request already processed",
                status=400
            )

        reason = request.data.get("admin_note")

        if not reason:

            return error_response(
                message="Reason is required",
                status=400
            )

        req.status = "REJECTED"
        req.admin_note = reason
        req.save()

        send_notification(
            user=req.requested_by,
            title="Location Request Rejected",
            message=reason,
            n_type="ALERT"
        )

        return success_response(
            message="Request rejected"
        ) 
        
        
        
# class VerificationQueueView(APIView):
#     permission_classes = [IsSuperAdmin]

#     def get(self, request):

#         waiting_citizens = CitizenVerification.objects.filter(
#             status="WAITING_FOR_WARD"
#         ).select_related(
#             "ward"
#         )

#         waiting_wards = WardVerification.objects.filter(
#             status="WAITING_FOR_PANCHAYATH"
#         ).select_related(
#             "panchayath_master"
#         )

#         citizen_data = []

#         for verification in waiting_citizens:

#             citizen_data.append({
#                 "id": verification.id,
#                 "name": verification.full_name,
#                 "district": verification.ward.district.name,
#                 "panchayath": verification.ward.panchayath.name,
#                 "ward": verification.ward.ward_name or f"Ward {verification.ward.ward_number}",
#                 "submitted_at": verification.submitted_at,
#             })

#         ward_data = []

#         for verification in waiting_wards:

#             ward_data.append({
#                 "id": verification.id,
#                 "officer_name": verification.officer_full_name,
#                 "district": verification.district.name,
#                 "panchayath": verification.panchayath_master.name,
#                 "ward": verification.ward_name,
#                 "submitted_at": verification.submitted_at,
#             })

#         return success_response(
#             message="Verification queue fetched",
#             data={
#                 "waiting_citizens": citizen_data,
#                 "waiting_wards": ward_data,
#             }
#         )

class VerificationQueueView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        try:
            waiting_citizens = CitizenVerification.objects.filter(
                status="WAITING_FOR_WARD"
            ).select_related(
                "ward",
                "ward__panchayath",
                "ward__panchayath__district",
            )

            waiting_wards = WardVerification.objects.filter(
                status="WAITING_FOR_PANCHAYATH"
            ).select_related(
                "district",
                "panchayath_master",
            )

            citizen_data = []

            for verification in waiting_citizens:

                citizen_data.append({
                    "id": verification.id,
                    "name": verification.full_name,
                    "district": verification.ward.panchayath.district.name,
                    "panchayath": verification.ward.panchayath.name,
                    "ward": verification.ward.ward_name or f"Ward {verification.ward.ward_number}",
                    "submitted_at": verification.submitted_at,
                })

            ward_data = []

            for verification in waiting_wards:

                ward_data.append({
                    "id": verification.id,
                    "officer_name": verification.officer_full_name,
                    "district": verification.district.name,
                    "panchayath": verification.panchayath_master.name,
                    "ward": verification.ward_name,
                    "submitted_at": verification.submitted_at,
                })

            return success_response(
                message="Verification queue fetched",
                data={
                    "waiting_citizens": citizen_data,
                    "waiting_wards": ward_data,
                },
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            raise
        
        
        
class WaitingCitizenListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        queryset = (
            CitizenVerification.objects
            .filter(status="WAITING_FOR_WARD")
            .select_related(
                "ward",
                "ward__panchayath",
                "ward__panchayath__district"
            )
            .order_by("-submitted_at")
        )

        paginator = PageNumberPagination()
        paginator.page_size = 10

        page = paginator.paginate_queryset(
            queryset,
            request
        )

        data = []

        for verification in page:
            data.append({
                "id": verification.id,
                "name": verification.full_name,
                "district": verification.ward.panchayath.district.name,
                "panchayath": verification.ward.panchayath.name,
                "ward": verification.ward.ward_name,
                "submitted_at": verification.submitted_at,
            })

        return paginator.get_paginated_response(data)
    
    
class WaitingWardListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        queryset = (
            WardVerification.objects
            .filter(status="WAITING_FOR_PANCHAYATH")
            .select_related(
                "district",
                "panchayath_master"
            )
            .order_by("-submitted_at")
        )

        paginator = PageNumberPagination()
        paginator.page_size = 10

        page = paginator.paginate_queryset(
            queryset,
            request
        )

        data = []

        for verification in page:

            data.append({
                "id": verification.id,
                "officer_name": verification.officer_full_name,
                "district": verification.district.name,
                "panchayath": verification.panchayath_master.name,
                "ward": verification.ward_name,
                "submitted_at": verification.submitted_at,
            })

        return paginator.get_paginated_response(data)
        
        
class WaitingCitizenDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):

        verification = get_object_or_404(
            CitizenVerification,
            pk=pk,
            status="WAITING_FOR_WARD"
        )

        return success_response(
            data={
                "id": verification.id,
                "full_name": verification.full_name,
                "phone": verification.phone,
                "house_number": verification.house_number,
                "street_name": verification.street_name,

                "district": verification.ward.panchayath.district.name,
                "panchayath": verification.ward.panchayath.name,
                "ward": verification.ward.ward_number,

                "submitted_at": verification.submitted_at,

                "aadhaar": verification.aadhaar_image.url,
                "selfie": verification.selfie_image.url,
            }
        )
        
        
class WaitingWardDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):

        verification = get_object_or_404(
            WardVerification,
            pk=pk,
            status="WAITING_FOR_PANCHAYATH"
        )

        return success_response(
            data={
                "id": verification.id,
                "officer_name": verification.officer_full_name,

                "district": verification.district.name,

                "panchayath": verification.panchayath_master.name,
                
                
                "phone" : verification.official_contact,
                "ward": verification.ward_master.ward_number,

                "submitted_at": verification.submitted_at,

                "aadhaar": verification.aadhaar_image.url,

                "selfie": verification.selfie_image.url,

                "supporting_document": (
                    verification.supporting_document.url
                    if verification.supporting_document
                    else None
                ),
            }
        )