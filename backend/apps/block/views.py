from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsBlock
from apps.accounts.permissions import IsActiveUser
from .serializers import BlockVerificationSerializer
from .models import BlockVerification
from apps.panchayath.models import PanchayathVerification


class BlockMeView(APIView):
    permission_classes = [IsAuthenticated,IsBlock]
    
    def get(self,request):
        return Response({
            "email":request.user.email,
            "username":request.user.username,
            "role":request.user.role,
            "status":request.user.status,
            "is_verified":request.user.is_verified,
        })
        
        
class BlockHomeView(APIView):
    permission_classes = [IsAuthenticated,IsBlock,IsActiveUser]
    
    def get(self,request):
        return Response({
            "total_complaints": 0,
            "pending_complaints": 0,
            "escalated_complaints": 0,
            "panchayath_count": 0,
            "message": "Block dashboard loaded successfully"
        })
        
        
class BlockVerificationSubmitView(APIView):
    permission_classes = [IsAuthenticated,IsBlock]
    
    def post(self,request):
        if request.user.status == "ACTIVE":
            return Response(
                {"message":"Already verified"},
                status=400
            )
            
        if hasattr(request.user,"block_verification"):
            return Response(
                {"message":"Verification already submitted"},
                status=400
            )
            
        serializer = BlockVerificationSerializer(
            data = request.data
        )
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message":"Verificaton submitted successfully."},
                status=201
            )
        return Response(serializer.errors,status=400)
    
    
    
"""
    Block can see all Panchayath verification requests.
    """
    
    
class PanchayathApprovalListView(APIView):
    permission_classes = [IsAuthenticated, IsBlock, IsActiveUser]

    def get(self, request):

        verifications = PanchayathVerification.objects.all()

        data = []

        for item in verifications:
            if item.approved:
                status = "APPROVED"
            elif item.rejected:
                status = "REJECTED"
            else:
                status = "PENDING"

            data.append({
                "id": item.id,
                "email": item.user.email,
                "full_name": item.full_name,
                "submitted_at": item.submitted_at,
                "status": status,
            })

        return Response(data)    

    
    
class PanchayathVerificationDetailView(APIView):
    permission_classes = [IsAuthenticated,IsBlock,IsActiveUser]
    
    def get(self,request,pk):
        try:
            verification = PanchayathVerification.objects.get(id=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error:":"Not Found"},status=404)
        
        return Response({
        "id": verification.id,
        "email": verification.user.email,
        "full_name": verification.full_name,
        "phone_number": verification.phone_number,
        "aadhaar_image": verification.aadhaar_image.url,
        "appointment_letter": verification.appointment_letter.url,
        "government_id": verification.government_id.url,
        "live_selfie": verification.live_selfie.url,
        "submitted_at": verification.submitted_at,
        "approved": verification.approved,
        "rejected": verification.rejected,
        "rejection_reason": verification.rejection_reason,
        })
        
        
        
class PanchayathApproveView(APIView):
    permission_classes = [IsAuthenticated, IsBlock, IsActiveUser]

    def post(self, request, pk):
        try:
            verification = PanchayathVerification.objects.get(id=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        if verification.approved:
            return Response({"message": "Already approved"}, status=400)

        verification.approved = True
        verification.rejected = False
        verification.rejection_reason = None
        verification.reviewed_by = request.user
        verification.save()

        verification.user.status = "ACTIVE"
        verification.user.is_verified = True
        verification.user.save()

        return Response({"message": "Panchayath approved successfully"})
    


class PanchayathRejectView(APIView):
    permission_classes = [IsAuthenticated, IsBlock, IsActiveUser]

    def post(self, request, pk):
        reason = request.data.get("reason")
        if not reason:
            return Response({"error": "Rejection reason required"}, status=400)
        try:
            verification = PanchayathVerification.objects.get(id=pk)
        except PanchayathVerification.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        verification.rejected = True
        verification.approved = False
        verification.rejection_reason = reason
        verification.reviewed_by = request.user
        verification.save()

        return Response({"message": "Panchayath rejected successfully"})
    
    
    
# class BlockProfileView(APIView):
#     permission_classes = [IsAuthenticated, IsBlock]

#     def get(self, request):

#         user = request.user

#         profile_data = {
#             "username": user.username,
#             "email": user.email,
#             "role": user.role,
#             "status": user.status,
#             "is_verified": user.is_verified,
#         }

#         if hasattr(user, "block_verification"):
#             verification = user.block_verification

#             profile_data["verification"] = {
#                 "full_name": verification.full_name,
#                 "phone_number": verification.phone_number,
#                 "aadhaar_image": verification.aadhaar_image.url,
#                 "appointment_letter": verification.appointment_letter.url,
#                 "government_id": verification.government_id.url,
#                 "live_selfie": verification.live_selfie.url,
#                 "submitted_at": verification.submitted_at,
#             }
#         else:
#             profile_data["verification"] = None

#         return Response(profile_data)


class BlockProfileView(APIView):
    permission_classes = [IsAuthenticated, IsBlock]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })