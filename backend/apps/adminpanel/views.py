from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsSuperAdmin
from apps.block.models import BlockVerification
from django.contrib.auth import get_user_model
from apps.accounts.models import User
from apps.block.models import BlockVerification
# Create your views here.


class BlockVerificationListView(APIView):
    permission_classes = [IsAuthenticated,IsSuperAdmin]
    
    def get(self,request):
        verifications = BlockVerification.objects.all()
        
        data = []
        
        for item in verifications:
            status = item.user.status
            
            data.append({
                "id":item.id,
                "email":item.user.email,
                "full_name":item.full_name,
                "submitted_at":item.submitted_at,
                "status":status,
            })
            
        return Response(data)
    
    
class BlockVerificationDetailView(APIView):
    permission_classes = [IsAuthenticated,IsSuperAdmin]
    
    def get(self,request,pk):
        
        try:
            verification = BlockVerification.objects.get(id=pk)
        except BlockVerification.DoesNotExist:
            return Response(
                {"error":"Not found"},
                status=404
            )
            
        return Response({
            "id":verification.id,
            "email":verification.user.email,
            "full_name":verification.full_name,
            "phone_number":verification.phone_number,
            "aadhaar_image":verification.aadhaar_image.url,
            "appointment_letter":verification.appointment_letter.url,
            "live_selfie":verification.live_selfie.url,
            "submitted_at":verification.submitted_at,
            "user_status":verification.user.status,
        })


class BlockApproveView(APIView):
    permission_classes = [IsAuthenticated,IsSuperAdmin]
    
    def post(self,request,pk):
        try:
            verification = BlockVerification.objects.get(id=pk)
        except BlockVerification.DoesNotExist:
            return Response(
                {"error":"Not found"},
                status=404
            )
        user = verification.user
        
        if user.status == "ACTIVE":
            return Response({"message":"Block already approved"})
        
        user.status = "ACTIVE"
        user.is_verified = True
        user.save()
        
        return Response({"message":"Block approved successfully"})
    
    
    
class BlockRejectView(APIView):
    
    permission_classes = [IsAuthenticated,IsSuperAdmin]
    
    def post(self,request,pk):
        reason = request.data.get("reason")
        
        if not reason:
            return Response({"error":"Reject reason required"},status=400)
        try:
            verification = BlockVerification.objects.get(id=pk)
        except BlockVerification.DoesNotExist:
            return Response({"error":"Not found"},status=404)
        
        user = verification.user
        user.status = "SUSPENDED"
        user.is_verified = False
        user.save()
        
        return Response({"message":"Block Rejected Successfully"})
        
    
class AdminMeView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):
        return Response({
            "email": request.user.email,
            "username": request.user.username,
            "is_superuser": request.user.is_superuser,
            "role": "SYSTEM_ADMIN"
        })
        


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get(self, request):

        total_blocks = User.objects.filter(role="BLOCK").count()
        active_blocks = User.objects.filter(role="BLOCK", status="ACTIVE").count()
        suspended_blocks = User.objects.filter(role="BLOCK", status="SUSPENDED").count()
        pending_verifications = User.objects.filter(role="BLOCK", status="PENDING").count()

        return Response({
            "total_blocks": total_blocks,
            "active_blocks": active_blocks,
            "suspended_blocks": suspended_blocks,
            "pending_block_verifications": pending_verifications,
            "message": "Admin dashboard loaded successfully"
        })