from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response 
from django.contrib.auth import get_user_model
from django.db.models import Q,Count
from django.utils import timezone
from .permissions import IsWard,IsActiveWard
from .models import WardVerification
from apps.citizen.models import CitizenVerification
from apps.complaints.models import Complaint  
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
# Create your views here.


User = get_user_model()


class WardProfile(APIView):
    permission_classes = [IsWard]

    def get(self, request):
        user = request.user
        verification = WardVerification.objects.filter(user=user).first()

        if not verification:
            return Response({
                "id": user.id,
                "email": user.email,
                "status": user.status,
                "verification_status": "NOT_SUBMITTED"
            })

        return Response({
            "id": user.id,
            "email": user.email,
            "status": user.status,
            "verification_status": verification.status,

            "officer_full_name": verification.officer_full_name,
            "official_email": verification.official_email,
            "official_contact": verification.official_contact,

            "ward_name": verification.ward_name,
            "panchayath_name": verification.panchayath_name,
            "office_address": verification.office_address,

            "aadhaar_image": verification.aadhaar_image.url if verification.aadhaar_image else None,
            "selfie_image": verification.selfie_image.url if verification.selfie_image else None,
            "supporting_document": verification.supporting_document.url if verification.supporting_document else None,
        })
        
        
        
        
# class SubmitWardVerificationView(APIView):
#     permission_classes = [IsWard]
#     parser_classes = [MultiPartParser,FormParser]
    
#     def post(self,request):
        
#         user = request.user
#         verification = WardVerification.objects.filter(user=user).first()
        
#         if verification:
#             if verification.status == "PENDING":
#                 return Response({"error":"Verification Already Submitted under review"},status=400)
            
#             if verification.status == "APPROVED":
#                 return Response({"error":"Already Verified"},status=400)
            
#             verification.ward_name = request.data.get("ward_name")
#             verification.phone = request.data.get("phone")
#             verification.district = request.data.get("district")
#             verification.aadhaar_image = request.FILES.get("aadhaar_image")
#             verification.selfie_image = request.FILES.get("selfie_image")
#             verification.status = "PENDING"
#             verification.reject_reason = None
#             verification.reviewed_at = None
#             verification.save()
            
#             return Response({"message":"Verification resubmitted"})
        
#         WardVerification.objects.create(
#             user=user,
#             panchayath = user.panchayath,
#             ward_name = request.data.get("ward_name"),
#             phone = request.data.get("phone"),
#             district = request.data.get("district"),
#             aadhaar_image = request.FILES.get("aadhaar_image"),
#             selfie_image = request.FILES.get("selfie_image"),
            
#         )
        
#         return Response({"message":"Verification submitted"})


# class SubmitWardVerificationView(APIView):
#     permission_classes = [IsWard]
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request):
#         user = request.user
#         panchayath_id = request.data.get("panchayath_id")
#         if not panchayath_id:
#             return Response({"error": "Panchayath selection is required"}, status=400)
        
#         panchayath_user = get_object_or_404(
#             User,
#             id=panchayath_id,
#             role=User.Role.PANCHAYATH
#         )
#         verification = WardVerification.objects.filter(user=user).first()

#         data = {
#             "officer_full_name": request.data.get("officer_full_name"),
#             "official_email": request.data.get("official_email"),
#             "official_contact": request.data.get("official_contact"),
#             "ward_name": request.data.get("ward_name"),
#             "panchayath_name": request.data.get("panchayath_name"),
#             "office_address": request.data.get("office_address"),
#             "aadhaar_image": request.FILES.get("aadhaar_image"),
#             "selfie_image": request.FILES.get("selfie_image"),
#             "supporting_document": request.FILES.get("supporting_document"),
#         }

#         if verification:

#             if verification.status == "PENDING":
#                 return Response(
#                     {"error": "Verification already submitted and under review"},
#                     status=400
#                 )

#             if verification.status == "APPROVED":
#                 return Response(
#                     {"error": "Already verified"},
#                     status=400
#                 )

#             for key, value in data.items():
#                 setattr(verification, key, value)

#             verification.status = "PENDING"
#             verification.reject_reason = None
#             verification.reviewed_at = None
#             verification.save()

#             return Response({"message": "Verification resubmitted successfully"})

#         WardVerification.objects.create(
#             user=user,
#             id=panchayath_id,
#             role=User.Role.PANCHAYATH
#         )

#         return Response({"message": "Verification submitted successfully"})
    
    
    
class SubmitWardVerificationView(APIView):
    permission_classes = [IsWard]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        panchayath_id = request.data.get("panchayath_id")

        if not panchayath_id:
            return Response({"error": "Panchayath selection is required"}, status=400)
        panchayath_user = get_object_or_404(
            User,
            id=panchayath_id,
            role=User.Role.PANCHAYATH
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
                return Response(
                    {"error": "Verification already submitted and under review"},
                    status=400
                )

            if verification.status == "APPROVED":
                return Response(
                    {"error": "Already verified"},
                    status=400
                )

            for key, value in data.items():
                setattr(verification, key, value)

            verification.panchayath = panchayath_user
            verification.status = "PENDING"
            verification.reject_reason = None
            verification.reviewed_at = None
            verification.save()

            return Response({"message": "Verification resubmitted successfully"})
        WardVerification.objects.create(
            user=user,
            panchayath=panchayath_user,
            **data
        )

        return Response({"message": "Verification submitted successfully"})
    

class WardVerificationStatusView(APIView):
    permission_classes = [IsWard]
    
    def get(self,request):
        verification = WardVerification.objects.filter(
            user = request.user
        ).first()
        
        if not verification:
            return Response({"status":"NOT_SUBMITTED"})
        
        return Response({
            "status":verification.status,
            "reject_reason":verification.reject_reason,
            "submitted_at":verification.submitted_at,
            "reviewed_at":verification.reviewed_at,
        })
        
        
        
        
# class WardDashboardView(APIView):
#     permission_classes = [IsActiveWard]

#     def get(self, request):
#         user = request.user

#         stats = CitizenVerification.objects.filter(
#             ward=user
#         ).aggregate(
#             total=Count("id"),
#             approved=Count("id", filter=Q(status="APPROVED")),
#             pending=Count("id", filter=Q(status="PENDING")),
#             rejected=Count("id", filter=Q(status="REJECTED")),
#         )

#         verification = WardVerification.objects.filter(user=user).first()

#         return Response({
#             "ward_name": verification.ward_name if verification else None,
#             "status": user.status,
#             "total_citizens": stats["total"],
#             "approved_citizens": stats["approved"],
#             "pending_citizens": stats["pending"],
#             "rejected_citizens": stats["rejected"],
#         })
        
        
class WardDashboardView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        user = request.user

        complaint_stats = Complaint.objects.filter(
            ward=user
        ).aggregate(
            total=Count("id"),
            pending=Count("id", filter=Q(status="PENDING")),
            resolved=Count("id", filter=Q(status="RESOLVED")),
        )

        # Citizen Verification Stats
        citizen_stats = CitizenVerification.objects.filter(
            ward=user,
            status="PENDING"
        ).count()

        verification = WardVerification.objects.filter(user=user).first()

        return Response({
            "ward_name": verification.ward_name if verification else None,
            "total_complaints": complaint_stats["total"],
            "pending_complaints": complaint_stats["pending"],
            "resolved_complaints": complaint_stats["resolved"],
            "pending_citizen_verifications": citizen_stats,
        })


class CitizenVerificationListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        citizens = CitizenVerification.objects.filter(
            ward=request.user
        ).order_by("-submitted_at")

        data = []

        for citizen in citizens:
            data.append({
                "id": citizen.id,
                "full_name": citizen.full_name,
                "email": citizen.user.email,
                "phone": citizen.phone,
                "status": citizen.status, 
                "submitted_at": citizen.submitted_at,
            })

        return Response(data)
    



class CitizenVerificationDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, pk):
        try:
            citizen = CitizenVerification.objects.get(
                pk=pk,
                ward=request.user
            )
        except CitizenVerification.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        return Response({
            "id": citizen.id,
            "full_name": citizen.full_name,
            "email": citizen.user.email,
            "phone": citizen.phone,
            "house_number": citizen.house_number,
            "street_name": citizen.street_name,
            "status": citizen.status,
            "reject_reason": citizen.reject_reason,
            "aadhaar_image": citizen.aadhaar_image.url if citizen.aadhaar_image else None,
            "selfie_image": citizen.selfie_image.url if citizen.selfie_image else None,
            "submitted_at": citizen.submitted_at,
        })
        
        
        

        
class ApproveCitizenView(APIView):
    permission_classes = [IsActiveWard]

    def post(self, request, pk):
        try:
            citizen = CitizenVerification.objects.get(
                pk=pk,
                ward=request.user
            )
        except CitizenVerification.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        citizen.status = "APPROVED"
        citizen.reviewed_at = timezone.now()
        citizen.save()

        citizen.user.status = User.Status.ACTIVE
        citizen.user.save()
        return Response({"message": "Citizen approved successfully"})
    
    
    
class RejectCitizenView(APIView):
    permission_classes = [IsActiveWard]

    def post(self, request, pk):
        reason = request.data.get("reason")

        if not reason or len(reason.strip()) < 10:
            return Response(
                {"error": "Reject reason must be at least 10 characters"},
                status=400
            )
        try:
            citizen = CitizenVerification.objects.get(
                pk=pk,
                ward=request.user
            )
        except CitizenVerification.DoesNotExist:
            return Response({"error": "Citizen not found"}, status=404)

        citizen.status = "REJECTED"
        citizen.reject_reason = reason
        citizen.reviewed_at = timezone.now()
        citizen.save()
        citizen.user.status = User.Status.SUSPENDED
        citizen.user.save()
        return Response({"message": "Citizen rejected successfully"})
    
    
    
class CitizenPagination(PageNumberPagination):
    page_size = 10
    
class ApprovedCitizenListView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        search = request.GET.get("search", "").strip()

        citizens = CitizenVerification.objects.filter(
            ward=request.user,
            status="APPROVED"
        )

        if search:
            citizens = citizens.filter(
                Q(full_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(phone__icontains=search)
            )

        paginator = CitizenPagination()
        paginated_qs = paginator.paginate_queryset(citizens, request)

        data = []
        for citizen in paginated_qs:
            data.append({
                "id": citizen.id,
                "full_name": citizen.full_name,
                "email": citizen.user.email,
                "phone": citizen.phone,
                "house_number": citizen.house_number,
                "street_name": citizen.street_name,
            })

        return paginator.get_paginated_response(data)
    
    

class RecentCitizenVerificationView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request):
        citizens = CitizenVerification.objects.filter(
            ward=request.user
        ).order_by("-submitted_at")[:5]

        data = []

        for citizen in citizens:
            data.append({
                "id": citizen.id,
                "citizen_name": citizen.full_name,
                "status": citizen.status,
                "submitted_at": citizen.submitted_at,
            })

        return Response(data)
    
        
        