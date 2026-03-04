

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


User = get_user_model()


class PanchayathProfileView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):

        user = request.user
        verification = PanchayathVerification.objects.filter(user=user).first()

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

        verification = PanchayathVerification.objects.filter(user=user).first()

        if verification:
            if verification.status == "PENDING":
                return Response({"error": "Verification already pending"}, status=400)
            if verification.status == "APPROVED":
                return Response({"error": "Already verified"}, status=400)
            
            verification.panchayath_name = request.data.get("panchayath_name")
            verification.full_name = request.data.get("full_name")
            verification.phone = request.data.get("phone")
            verification.district = request.data.get("district")
            verification.email = request.data.get("email")
            verification.aadhaar_image = request.FILES.get("aadhaar_image")
            verification.selfie_image = request.FILES.get("selfie_image")
            verification.status = "PENDING"
            verification.reject_reason = None
            verification.reviewed_at = None
            verification.save()

            return Response({"message": "Verification resubmitted"})
        
        PanchayathVerification.objects.create(
            user=user,
            full_name = request.data.get("full_name"),
            panchayath_name=request.data.get("panchayath_name"),
            phone=request.data.get("phone"),
            district=request.data.get("district"),
            email = request.data.get("email"),
            aadhaar_image=request.FILES.get("aadhaar_image"),
            selfie_image=request.FILES.get("selfie_image"),
        )

        return Response({"message": "Verification submitted"})



class PanchayathDashboardView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):

        user = request.user

        stats = WardVerification.objects.filter(
            panchayath=user
        ).aggregate(
            total=Count("id"),
            approved=Count("id", filter=Q(status="APPROVED")),
            pending=Count("id", filter=Q(status="PENDING")),
            rejected=Count("id", filter=Q(status="REJECTED")),
        )

        verification = PanchayathVerification.objects.filter(user=user).first()

        return Response({
            "panchayath_name": verification.panchayath_name if verification else None,
            "status": user.status,
            "total_wards": stats["total"],
            "approved_wards": stats["approved"],
            "pending_wards": stats["pending"],
            "rejected_wards": stats["rejected"],
        })



class PanchayathWardListView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):

        user = request.user

        wards = WardVerification.objects.filter(
            panchayath=user,
            status="APPROVED"
        )

        data = []

        for ward in wards:
            data.append({
                "id": ward.id,
                "ward_name": ward.ward_name,
                "username": ward.user.username,
                "email": ward.user.email,
                "phone": ward.phone,
                "district": ward.district,
                "approved_at": ward.reviewed_at,
                "submitted_at": ward.submitted_at,
            })

        return Response(data)



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
            documents.append(ward.aadhaar_image.url)

        if ward.selfie_image:
            documents.append(ward.selfie_image.url)

        return Response({
            "id": ward.id,
            "ward_name": ward.ward_name,
            "username": ward.user.username,
            "email": ward.user.email,
            "phone": ward.phone,
            "district": ward.district,
            "status": ward.status,
            "reject_reason": ward.reject_reason,
            "documents": documents,
            "submitted_at": ward.submitted_at,
        })



# class ApproveWardView(APIView):
#     permission_classes = [IsActivePanchayath]

#     def post(self, request, pk):

#         user = request.user

#         try:
#             ward = WardVerification.objects.get(
#                 pk=pk,
#                 panchayath=user
#             )
#         except WardVerification.DoesNotExist:
#             return Response({"error": "Ward not found"}, status=404)

#         ward.status = "APPROVED"
#         ward.save()
#         ward.user.status = User.Status.ACTIVE
#         ward.user.save()

#         return Response({"message": "Ward approved successfully"})



class ApproveWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def post(self, request, pk):

        user = request.user

        try:
            ward = WardVerification.objects.get(
                pk=pk,
                panchayath=user
            )
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        with transaction.atomic():
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

        return Response({"message": "Ward approved successfully"})



# class RejectWardView(APIView):
#     permission_classes = [IsActivePanchayath]

#     def post(self, request, pk):

#         user = request.user
#         reason = request.data.get("reason")
#         if not reason or len(reason.strip()) < 10:
#             return Response(
#                 {"error": "Rejection reason must be at least 10 characters"},
#                 status=400
#             )

#         try:
#             ward = WardVerification.objects.get(
#                 pk=pk,
#                 panchayath=user
#             )
#         except WardVerification.DoesNotExist:
#             return Response({"error": "Ward not found"}, status=404)

#         ward.status = "REJECTED"
#         ward.reject_reason = reason
#         ward.save()
#         ward.user.status = User.Status.SUSPENDED
#         ward.user.save()

#         return Response({"message": "Ward rejected successfully"})


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
            ward = WardVerification.objects.get(
                pk=pk,
                panchayath=user
            )
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        with transaction.atomic():
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

        return Response({"message": "Ward rejected successfully"})
    

#new added 


class PanchayathVerificationStatusView(APIView):
    permission_classes = [IsPanchayath]

    def get(self, request):
        user = request.user
        verification = PanchayathVerification.objects.filter(user=user).first()

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

        wards = WardVerification.objects.filter(
            panchayath=user,
            status="PENDING"
        )

        data = []

        for ward in wards:
            data.append({
                "id": ward.id,
                "ward_name": ward.ward_name,
                "email": ward.user.email,
                "phone": ward.phone,
                "status": ward.status,
                "submitted_at": ward.submitted_at,
            })

        return Response(data)