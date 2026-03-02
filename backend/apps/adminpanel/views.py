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
from django.db.models import Q
User = get_user_model()



class AdminLoginView(TokenObtainPairView):
    serializer_class = AdminLoginSerializer
    

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

        total_panchayath = User.objects.filter(role="PANCHAYATH").count()
        active_panchayath = User.objects.filter(role="PANCHAYATH", status="ACTIVE").count()
        pending_panchayath = User.objects.filter(role="PANCHAYATH", status="PENDING").count()
        suspended_panchayath = User.objects.filter(role="PANCHAYATH", status="SUSPENDED").count()

        total_wards = User.objects.filter(role="WARD").count()

        return Response({
            "total_panchayath": total_panchayath,
            "active_panchayath": active_panchayath,
            "pending_panchayath": pending_panchayath,
            "suspended_panchayath": suspended_panchayath,
            "total_wards": total_wards,
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

        v.status = "APPROVED"
        v.reject_reason = None
        v.reviewed_at = timezone.now()
        v.save()
        v.user.status = User.Status.ACTIVE
        v.user.is_verified = True
        v.user.save()

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

        v.status = "REJECTED"
        v.reject_reason = reason
        v.reviewed_at = timezone.now()
        v.save()
        v.user.status = User.Status.SUSPENDED
        v.user.is_verified = False
        v.user.save()

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
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "status": user.status,
                "is_verified": user.is_verified,
                "date_joined": user.date_joined,
            })

        return paginator.get_paginated_response(data)



                             
class SuspendPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self,request,user_id):
        try:
            user = User.objects.get(id=user_id,role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error":"Panchayath not found"},status=404)
        
        if user.status == User.Status.SUSPENDED:
            return Response({"error": "Already suspended"}, status=400)
        
        user.status = User.Status.SUSPENDED
        user.save()
        return Response({"message":"Panchayath Suspended"})
    
    
    
    
class ActivatePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self,request,user_id):
        try:
            user = User.objects.get(id=user_id,role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error":"Panchayath not found"},status=404)
        user.status = User.Status.ACTIVE
        user.save()
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
    
    


class AdminWardListView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        status = request.GET.get("status")
        search = request.GET.get("search")
        panchayath_id = request.GET.get("panchayath")

        users = User.objects.filter(role="WARD")
        if status and status.lower() == "approved":
            users = users.filter(status="ACTIVE", is_verified=True)
        if panchayath_id:
            users = users.filter(panchayath_id=panchayath_id)
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
            data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "status": user.status,
                "is_verified": user.is_verified,
                "date_joined": user.date_joined,
            })

        return paginator.get_paginated_response(data)




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
        return Response({"message": "Ward activated successfully"})
    
    
    
class AdminPanchayathDetailView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error": "Panchayath not found"}, status=404)

        verification = PanchayathVerification.objects.filter(user=user).last()

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "status": user.status,
            "is_verified": user.is_verified,
            "date_joined": user.date_joined,

            "verification": {
                "panchayath_name": verification.panchayath_name if verification else None,
                "district": verification.district if verification else None,
                "phone": verification.phone if verification else None,
                "aadhaar_image": request.build_absolute_uri(verification.aadhaar_image.url) if verification and verification.aadhaar_image else None,
                "selfie_image": request.build_absolute_uri(verification.selfie_image.url) if verification and verification.selfie_image else None,
                "submitted_at": verification.submitted_at if verification else None,
                "reviewed_at": verification.reviewed_at if verification else None,
                "reject_reason": verification.reject_reason if verification else None,
            }
        })
