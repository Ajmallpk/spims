from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsSuperAdmin
from django.db.models import Count
from apps.panchayath.models import PanchayathVerification
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.ward.models import WardVerification
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()


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

        verifications = PanchayathVerification.objects.all()
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
            "aadhaar_image": v.aadhaar_image.url if v.aadhaar_image else None,
            "selfie_image": v.selfie_image.url if v.selfie_image else None,
            "submitted_at": v.submitted_at,
        })





class ApprovePanchayathView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, pk):
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

    def patch(self, request, pk):

        reason = request.data.get("reason")

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



                             
class SuspendPanchayathView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def post(self,request,user_id):
        try:
            user = User.objects.get(id=user_id,role=User.Role.PANCHAYATH)
        except User.DoesNotExist:
            return Response({"error":"Panchayath not found"},status=404)
        
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


