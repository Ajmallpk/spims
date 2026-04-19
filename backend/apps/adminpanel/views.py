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


logger = logging.getLogger(__name__)



User = get_user_model()





from rest_framework.response import Response

class AdminLoginView(TokenObtainPairView):
    serializer_class = AdminLoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")
        refresh = response.data.get("refresh")

        
        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            secure=False,
            samesite="None"
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            secure=False,
            samesite="None"
        )

        return response
    

class AdminProfileView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": "ADMIN",
            "date_joined": user.date_joined,
            "last_login": user.last_login,
            "is_superuser": user.is_superuser,
        })





class AdminDashboardView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        total_panchayaths = User.objects.filter(role="PANCHAYATH").count()

        total_wards = WardVerification.objects.filter(
            status="APPROVED"
        ).count()

        total_citizens = User.objects.filter(role="CITIZEN").count()

        total_complaints = Complaint.objects.count()

        pending_complaints = Complaint.objects.filter(
            status="PENDING"
        ).count()

        resolved_complaints = Complaint.objects.filter(
            status="RESOLVED"
        ).count()

        pending_citizen_verifications = CitizenVerification.objects.filter(
            status="PENDING"
        ).count()

        pending_ward_verifications = WardVerification.objects.filter(
            status="PENDING"
        ).count()
        
        pending_complaints = Complaint.objects.filter(status="PENDING").count()
        resolved_complaints = Complaint.objects.filter(status="RESOLVED").count()

        chart_data = [
            {"status": "Pending", "count": pending_complaints},
            {"status": "Resolved", "count": resolved_complaints},
        ]

        return Response({
            "total_panchayaths": total_panchayaths,
            "total_wards": total_wards,
            "total_citizens": total_citizens,
            "total_complaints": total_complaints,
            "pending_complaints": pending_complaints,
            "resolved_complaints": resolved_complaints,
            "pending_citizen_verifications": pending_citizen_verifications,
            "pending_ward_verifications": pending_ward_verifications,
            "pending_complaints": pending_complaints,
            "resolved_complaints": resolved_complaints,
            "complaint_status_chart": chart_data,
            
        })
        
        
        
        
        



class PanchayathVerificationListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        verifications = PanchayathVerification.objects.filter(status="PENDING")
        data = []

        for v in verifications:
            data.append({
                "id": v.id,
                "panchayath_name": v.panchayath_name,
                "username": v.user.username,
                "email": v.user.email,
                "phone": v.phone,
                "district": v.district,
                "status": v.status,
                "submitted_at": v.submitted_at,
            })

        return Response(data)
    
    
    
    
class PanchayathVerificationDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, pk):
        try:
            v = PanchayathVerification.objects.get(pk=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        return Response({
            "id": v.id,
            "panchayath_name": v.panchayath_name,
            "username": v.user.username,
            "email": v.user.email,
            "phone": v.phone,
            "district": v.district,
            "status": v.status,
            "reject_reason": v.reject_reason,
            "aadhaar_image": request.build_absolute_uri(v.aadhaar_image.url) if v.aadhaar_image else None,
            "selfie_image": request.build_absolute_uri(v.selfie_image.url) if v.selfie_image else None,
            "submitted_at": v.submitted_at,
        })




class ApprovePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):
        try:
            v = PanchayathVerification.objects.get(pk=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        with transaction.atomic():

            v.status = "APPROVED"
            v.reject_reason = None
            v.reviewed_at = timezone.now()
            v.save()

            v.user.status = User.Status.ACTIVE
            v.user.is_verified = True
            v.user.save()
            
        logger.info(f"Admin {request.user.id} approved Panchayath verification {v.id}")
        return Response({"message": "Approved successfully"})





class RejectPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, pk):

        reason = request.data.get("reason")

        if not reason or len(reason.strip()) < 10:
            return Response(
                {"error": "Rejection reason must be at least 10 characters."},
                status=400
            )

        try:
            v = PanchayathVerification.objects.get(pk=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        with transaction.atomic():
            v.status = "REJECTED"
            v.reject_reason = reason.strip()
            v.reviewed_at = timezone.now()
            v.save()
            v.user.status = User.Status.SUSPENDED
            v.user.is_verified = False
            v.user.save()
        logger.warning(f"Admin {request.user.id} rejected Panchayath verification {v.id}")
        return Response({"message": "Rejected successfully"})
    
    


class AdminPanchayathListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        status = request.GET.get("status")
        search = request.GET.get("search")

        users = User.objects.filter(role="PANCHAYATH")
        if status:
            if status.lower() == "approved":
                users = users.filter(status="ACTIVE", is_verified=True)
            elif status.lower() == "suspended":
                users = users.filter(status="SUSPENDED")
        if search:
            users = users.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )

        users = users.order_by("-date_joined")
        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(users, request)

        data = []

        for user in result_page:

            verification = PanchayathVerification.objects.filter(user=user).last()

            panchayath_name = (
                verification.panchayath_name
                if verification and verification.panchayath_name
                else user.username
            )

            total_wards = WardVerification.objects.filter(
                panchayath=user,
                status="APPROVED"
            ).count()

            ward_users = WardVerification.objects.filter(
                panchayath=user,
                status="APPROVED"
            ).values_list("user_id", flat=True)

            total_complaints = Complaint.objects.filter(
                ward_id__in=ward_users
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

        return paginator.get_paginated_response(data)




class SuspendPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error": "Panchayath not found"}, status=404)
        
        if user.status == User.Status.SUSPENDED:
            return Response({"error": "Already suspended"}, status=400)
        
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
        return Response({"message": "Panchayath and its wards suspended"})
    
    
    
    
    
class ActivatePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self,request,user_id):
        try:
            user = User.objects.get(id=user_id,role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error":"Panchayath not found"},status=404)
        user.status = User.Status.ACTIVE
        user.is_verified = True
        user.save(update_fields=["status", "is_verified"])
        logger.info(f"Admin {request.user.id} activated Panchayath {user.id}")
        return Response({"message":"Panchayath activated"})





class RecentVerificationsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        verifications = (
            PanchayathVerification.objects
            .filter(status="PENDING")
            .order_by("-submitted_at")[:5]
        )
        data = []
        for v in verifications:
            data.append({
                "id": v.id,
                "panchayath_name": v.panchayath_name,
                "district": v.district,
                "submitted_at": v.submitted_at,
            })
        return Response(data)
    
    
    
    
class CriticalAlertsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def get(self, request):
        alerts = []
        pending_count = PanchayathVerification.objects.filter(status="PENDING").count()
        suspended_count = User.objects.filter(role="PANCHAYATH", status="SUSPENDED").count()

        if pending_count > 5:
            alerts.append({
                "type": "PENDING_OVERLOAD",
                "message": f"{pending_count} pending Panchayath verifications require review."
            })
        if suspended_count > 3:
            alerts.append({
                "type": "SUSPENDED_HIGH",
                "message": f"{suspended_count} Panchayaths are currently suspended."
            })
        return Response(alerts)
    
    


# class AdminWardListView(APIView):
#     permission_classes = [IsSuperAdmin]

#     def get(self, request):
#         status = request.GET.get("status")
#         search = request.GET.get("search")
#         panchayath_id = request.GET.get("panchayath")

#         users = User.objects.filter(role="WARD")
#         if status and status.lower() == "approved":
#             users = users.filter(status="ACTIVE", is_verified=True)
#         if panchayath_id:
#             users = users.filter(panchayath_id=panchayath_id)
#         if search:
#             users = users.filter(
#                 Q(username__icontains=search) |
#                 Q(email__icontains=search)
#             )

#         users = users.order_by("-date_joined")

#         paginator = PageNumberPagination()
#         paginator.page_size = 10
#         result_page = paginator.paginate_queryset(users, request)

#         data = []
#         for user in result_page:
#             data.append({
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "status": user.status,
#                 "is_verified": user.is_verified,
#                 "date_joined": user.date_joined,
#             })

#         return paginator.get_paginated_response(data)



# class AdminWardListView(APIView):
#     permission_classes = [IsAuthenticated, IsSuperAdmin]

#     def get(self, request):

#         wards = WardVerification.objects.filter(status="APPROVED")

#         data = []

#         for ward in wards:

#             ward_user = ward.user

#             total_users = User.objects.filter(
#                 role="CITIZEN",
#                 citizen_profile__ward_name=ward.ward_name
#             ).count()

#             total_complaints = Complaint.objects.filter(
#                 ward=ward_user
#             ).count()

#             pending_complaints = Complaint.objects.filter(
#                 ward=ward_user,
#                 status="PENDING"
#             ).count()

#             data.append({
#                 "id": ward.id,
#                 "ward_name": ward.ward_name,
#                 "officer_name": ward.officer_full_name,
#                 "email": ward.official_email,
#                 "panchayath_name": ward.panchayath.username if ward.panchayath else None,
#                 "total_users": total_users,
#                 "total_complaints": total_complaints,
#                 "pending_complaints": pending_complaints,
#                 "status": ward_user.status
#             })

#         return Response(data)




class AdminWardListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):

        wards = WardVerification.objects.filter(
            status="APPROVED"
        ).select_related("user", "panchayath")
        
        
        panchayath_id = request.GET.get("panchayath")
        
        
        if panchayath_id:
            wards = wards.filter(panchayath_id=panchayath_id)

        data = []

        for ward in wards:

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
                "id": ward.user.id,
                "verification_id": ward.id,
                "ward_name": ward.ward_name,
                "officer_name": ward.officer_full_name,
                "email": ward.official_email,
                "panchayath_name": ward.panchayath.username,
                "total_users": total_users,
                "total_complaints": total_complaints,
                "pending_complaints": pending_complaints,
                "status": ward_user.status
            })

        return Response(data)





class SuspendWardView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role=User.Role.WARD)
        except User.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        if user.status == User.Status.SUSPENDED:
            return Response({"error": "Ward already suspended"}, status=400)

        user.status = User.Status.SUSPENDED
        user.is_verified = False
        user.save()
        logger.warning(f"Admin {request.user.id} suspended Ward {user.id}")
        return Response({"message": "Ward suspended successfully"})





class ActivateWardView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role=User.Role.WARD)
        except User.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)
        
        if user.status == User.Status.ACTIVE:
            return Response({"error": "Ward already active"}, status=400)

        user.status = User.Status.ACTIVE
        user.is_verified = True
        user.save()
        logger.info(f"Admin {request.user.id} activated Ward {user.id}")
        return Response({"message": "Ward activated successfully"})
    
    
    
    
    
    
class AdminPanchayathDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error": "Panchayath not found"}, status=404)

        verification = PanchayathVerification.objects.filter(user=user).last()

        wards = WardVerification.objects.filter(
            panchayath=user,
            status="APPROVED"
        ).select_related("user")

        total_wards = wards.count()

        ward_users = wards.values_list("user_id", flat=True)

        total_complaints = Complaint.objects.filter(
            ward_id__in=ward_users
        ).count()

        pending_complaints = Complaint.objects.filter(
            ward_id__in=ward_users,
            status="PENDING"
        ).count()

        resolved_complaints = Complaint.objects.filter(
            ward_id__in=ward_users,
            status="RESOLVED"
        ).count()

        total_citizens = CitizenVerification.objects.filter(
            ward_id__in=ward_users,
            status="APPROVED"
        ).count()

        

        ward_list = []

        for ward in wards:
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

            ward_list.append({
                "id": ward_user.id,   
                "ward_name": ward.ward_name,
                "officer_name": ward.officer_full_name,
                "email": ward.official_email,
                "panchayath_name": user.username,

                "total_users": total_users,
                "total_complaints": total_complaints,
                "pending_complaints": pending_complaints,

                "status": ward_user.status
            })

        return Response({
            "id": user.id,
            "panchayath_name": verification.panchayath_name if verification else user.username,
            "email": user.email,
            "status": user.status,
            "date_joined": user.date_joined,

            "total_wards": total_wards,
            "total_complaints": total_complaints,
            "pending_complaints": pending_complaints,
            "resolved_complaints": resolved_complaints,
            "total_citizens": total_citizens,

            "authority": {
                "name": verification.panchayath_name if verification else user.username,
                "email": user.email,
                "phone": verification.phone if verification else None,
                "office_address": verification.district if verification else None,
                "joined_date": user.date_joined
            },

            "wards": ward_list
        })
        
        
        
      
      
      
        
class AdminWardDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, pk):

        ward = get_object_or_404(
            WardVerification.objects.select_related("user", "panchayath"),
            user__id=pk
        )

        ward_user = ward.user

        total_citizens = CitizenVerification.objects.filter(
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

        resolved_complaints = Complaint.objects.filter(
            ward=ward_user,
            status="RESOLVED"
        ).count()
        
        escalated_complaints = Complaint.objects.filter(
            ward=ward_user,
            status="ESCALATED"
        ).count()
        
        
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

        return Response({
            "id": ward.id,
            "ward_name": ward.ward_name,

            "name": ward.officer_full_name,
            "email": ward.official_email,
            "phone": ward.official_contact,

            "panchayath_name": ward.panchayath.username,
            "status": ward_user.status,

            "members": members,
            "complaints": complaints,

            "statistics": {
                "total_citizens": total_citizens,
                "total_complaints": total_complaints,
                "pending_complaints": pending_complaints,
                "resolved_complaints": resolved_complaints,
                "escalated_complaints": escalated_complaints
            }
        })





class RequestAdminEmailChange(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):

        new_email = request.data.get("new_email")

        if not new_email:
            return Response({"error": "New email is required"}, status=400)

        if User.objects.filter(email=new_email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = request.user

        otp = str(random.randint(100000, 999999))
        logger.info(f"Admin {user.id} requested email change")
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
            "SPIMS Admin Email Change Verification",
            f"""
        Hello {user.username},

        You requested to change your admin email.

        Your OTP for confirming this change is:

        ====================
        {otp}
        ====================

        Generated at: {generated_time}
        Valid for: 5 minutes

        If you did not request this change, please ignore this email.

        Regards,
        SPIMS Security Team
        """,
            settings.EMAIL_HOST_USER,
            [user.email],
        )

        return Response({"message": "OTP sent to your current email"})
    
    
    
    
    
class VerifyAdminEmailChange(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):

        otp = request.data.get("otp")

        if not otp:
            return Response({"error": "OTP is required"}, status=400)

        user = request.user

        cache_data = cache.get(f"admin_email_change_{user.id}")

        if not cache_data:
            return Response({"error": "OTP expired or not found"}, status=400)

        if cache_data["otp"] != otp:
            return Response({"error": "Invalid OTP"}, status=400)
        user.email = cache_data["new_email"]
        logger.info(f"Admin {user.id} changed email successfully")
        user.save()
        cache.delete(f"admin_email_change_{user.id}")

        return Response({"message": "Email updated successfully"})
    
    
    



class AdminChangePasswordView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request):

        user = request.user

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response({"error": "Both passwords are required"}, status=400)

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect"}, status=400)

        user.set_password(new_password)
        user.save()
        logger.warning(f"Admin {user.id} changed password")
        return Response({"message": "Password changed successfully"})
    
    
    
    
    
class AdminCitizenListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        ward_name_filter = request.GET.get("ward")
        panchayath_name_filter = request.GET.get("panchayath")
        search = request.GET.get("search")

        citizens = User.objects.filter(
             role=User.Role.CITIZEN
        ).select_related("citizen_verification")

        if search:
            citizens = citizens.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )

        data = []

        for user in citizens:

            verification = getattr(user, "citizen_verification", None)
            if not verification or verification.status != "APPROVED":
                continue

            ward_name = None
            panchayath_name = None

            ward_verification = WardVerification.objects.filter(
                user=verification.ward
            ).select_related("panchayath").first()

            if ward_verification:
                ward_name = ward_verification.ward_name
                panchayath_verification = PanchayathVerification.objects.filter(
                    user=ward_verification.panchayath
                ).first()

                if panchayath_verification:
                    panchayath_name = panchayath_verification.panchayath_name
                    
                
            
            if ward_name_filter:
                if not ward_name or ward_name_filter.lower() not in ward_name.lower():
                    continue

            if panchayath_name_filter:
                if not panchayath_name or panchayath_name_filter.lower() not in panchayath_name.lower():
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

        return Response(data)
    
    
    
    
    
class AdminCitizenDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, user_id):

        try:
            user = User.objects.get(id=user_id, role=User.Role.CITIZEN)
        except User.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        verification = getattr(user, "citizen_verification", None)

        if not verification or verification.status != "APPROVED":
            return Response({"error": "Citizen not verified"}, status=400)

        ward_name = None
        panchayath_name = None

        ward_verification = WardVerification.objects.filter(
            user=verification.ward
        ).select_related("panchayath").first()

        if ward_verification:
            ward_name = ward_verification.ward_name

            panchayath_verification = PanchayathVerification.objects.filter(
                user=ward_verification.panchayath
            ).first()

            if panchayath_verification:
                panchayath_name = panchayath_verification.panchayath_name

        return Response({
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

            "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url),
            "selfie_image": request.build_absolute_uri(verification.selfie_image.url),

            "submitted_at": verification.submitted_at,
        })
    
    
    
    

class SuspendCitizenView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):

        try:
            user = User.objects.get(id=user_id, role=User.Role.CITIZEN)
        except User.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        if user.status == User.Status.SUSPENDED:
            return Response({"error": "Citizen already suspended"}, status=400)

        user.status = User.Status.SUSPENDED
        user.is_verified = False
        user.save()

        logger.warning(f"Admin {request.user.id} suspended Citizen {user.id}")

        return Response({"message": "Citizen suspended successfully"})
    
    
    

class ActivateCitizenView(APIView):
    permission_classes = [IsSuperAdmin]

    def post(self, request, user_id):

        try:
            user = User.objects.get(id=user_id, role=User.Role.CITIZEN)
        except User.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        if user.status == User.Status.ACTIVE:
            return Response({"error": "Citizen already active"}, status=400)

        user.status = User.Status.ACTIVE
        user.is_verified = True
        user.save()

        logger.info(f"Admin {request.user.id} activated Citizen {user.id}")

        return Response({"message": "Citizen activated successfully"})
    
    
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "role": "ADMIN" if request.user.is_superuser else "USER",
            "username": request.user.username
        })
        
        
        
        