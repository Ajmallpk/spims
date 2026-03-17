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
from apps.panchayath.models import PanchayathVerification
from apps.citizen.models import CitizenProfile,CitizenVerification
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.citizen.models import CitizenVerification, CitizenProfile
from apps.complaints.models import Complaint
from .permissions import IsActiveWard
from django.utils import timezone
import uuid
import logging



logger = logging.getLogger(__name__)


User = get_user_model()




class WardProfile(APIView):
    permission_classes = [IsWard]

    def get(self, request):
        user = request.user
        verification = WardVerification.objects.filter(user=user).first()

        if not verification:
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "status": user.status,
                "verification_status": "NOT_SUBMITTED"
            })

        return Response({
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

            "aadhaar_image": verification.aadhaar_image.url if verification.aadhaar_image else None,
            "selfie_image": verification.selfie_image.url if verification.selfie_image else None,
            "supporting_document": verification.supporting_document.url if verification.supporting_document else None,
        })
        
        
    
    
    
    
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
            logger.info(f"Ward {user.id} resubmitted verification to Panchayath {panchayath_user.id}")
            return Response({"message": "Verification resubmitted successfully"})
        WardVerification.objects.create(
            user=user,
            panchayath=panchayath_user,
            status="PENDING",
            **data
        )
        logger.info(f"Ward {user.id} submitted verification request to Panchayath {panchayath_user.id}")
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
            "rejection_reason":verification.reject_reason,
            "submitted_at":verification.submitted_at,
            "reviewed_at":verification.reviewed_at,
        })
        
        
        
        

 
        
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

            "aadhaar_image": request.build_absolute_uri(citizen.aadhaar_image.url) if citizen.aadhaar_image else None,
            "selfie_image": request.build_absolute_uri(citizen.selfie_image.url) if citizen.selfie_image else None,

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
        citizen.user.is_verified = True
        citizen.user.save()

        
        profile, created = CitizenProfile.objects.get_or_create(user=citizen.user)

        profile.full_name = citizen.full_name
        profile.phone = citizen.phone
        profile.house_number = citizen.house_number
        profile.street_name = citizen.street_name
        profile.address = f"House {citizen.house_number}, {citizen.street_name}"
        ward_verification = WardVerification.objects.filter(user=request.user).first()

        if ward_verification:
            profile.ward_name = ward_verification.ward_name   

        profile.save()
        logger.info(f"Ward {request.user.id} approved citizen {citizen.user.id}")
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
        logger.warning(f"Ward {request.user.id} rejected citizen {citizen.user.id}")
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
    
    
    

class PanchayathDropdownListView(APIView):

    permission_classes = [IsWard]

    def get(self, request):

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

        return Response(data)        
    
    
    
    
    
class WardChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"message": "Both passwords are required"},
                status=400
            )

        if not user.check_password(current_password):
            return Response(
                {"message": "Current password is incorrect"},
                status=400
            )

        user.set_password(new_password)
        user.save()
        logger.warning(f"Ward {user.id} changed password")
        return Response(
            {"message": "Password changed successfully"},
            status=200
        )
        
        
        
class WardChangeEmailRequestView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        new_email = request.data.get("new_email")
        password = request.data.get("password")

        if not new_email or not password:
            return Response({"message": "Email and password required"}, status=400)

        if not user.check_password(password):
            return Response({"message": "Password incorrect"}, status=400)

        if User.objects.filter(email=new_email).exists():
            return Response({"message": "Email already exists"}, status=400)

        token = str(uuid.uuid4())
        logger.info(f"Ward {user.id} requested email change")
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

        To confirm this request, please click the link below:

        {verify_link}

        This verification link will expire in 10 minutes.

        Generated at: {generated_time}
        System: SPIMS Security

        If you did not request this change, please ignore this email.

        Regards,
        SPIMS Security Team
        """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )

        return Response(
            {"message": "Verification email sent"},
            status=200
        )
        
        
        
        
class WardChangeEmailVerifyView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, token):

        data = cache.get(f"ward_change_email_{token}")

        if not data:
            return Response(
                {"message": "Invalid or expired token"},
                status=400
            )

        user = User.objects.get(id=data["user_id"])
        user.email = data["new_email"]
        user.save()
        logger.info(f"Ward {user.id} changed email successfully")
        cache.delete(f"ward_change_email_{token}")

        return Response({
            "message": "Email updated successfully",
            "email": user.email
        })
        
        

class CitizenFullDetailView(APIView):
    permission_classes = [IsActiveWard]

    def get(self, request, pk):

        verification = get_object_or_404(
            CitizenVerification,
            pk=pk,
            ward=request.user
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
            "id",
            "title",
            "category",
            "status",
            "created_at"
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
                "reviewed_at": verification.reviewed_at,
                "reject_reason": verification.reject_reason,
            },

            "stats": stats,

            "complaints": list(complaints)
        }

        return Response(data)
    
    
    
    
    
class ComplaintDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, complaint_id):

        try:
            complaint = Complaint.objects.select_related(
                "citizen",
                "ward",
                "panchayath"
            ).prefetch_related(
                "comments",
                "upvotes"
            ).get(id=complaint_id)

        except Complaint.DoesNotExist:
            return Response(
                {"error": "Complaint not found"},
                status=404
            )

        data = {
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "status": complaint.status,
            "created_at": complaint.created_at,

            "citizen": {
                "name": complaint.citizen.username,
                "email": complaint.citizen.email,
            },

            "ward": complaint.ward.username if complaint.ward else None,
            "panchayath": complaint.panchayath.username if complaint.panchayath else None,

            "media": complaint.media.url if complaint.media else None,

            "upvotes": complaint.upvotes.count(),
            "comments": complaint.comments.count(),
        }

        return Response(data)