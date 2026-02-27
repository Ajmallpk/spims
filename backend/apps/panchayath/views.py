# from rest_framework.views import APIView
# from rest_framework.response import Response 
# from django.contrib.auth import get_user_model
# from .permissions import IsPanchayath
# from .permissions import IsActivePanchayath
# from rest_framework.parsers import MultiPartParser,FormParser
# from .models import PanchayathVerification
# from apps.ward.models import WardVerification

# User = get_user_model()

# from rest_framework.permissions import IsAuthenticated
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.contrib.auth import get_user_model

# User = get_user_model()


# class PanchayathProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         verification = getattr(user, "panchayath_verification", None)
#         return Response({
#             "id": user.id,
#             "username": user.username,
#             "email": user.email,
#             "status": user.status,
#             "panchayath_name": verification.panchayath_name if verification else None,
#             "phone": verification.phone if verification else None,
#             "district": verification.district if verification else None,
#             "verification_status": verification.status if verification else "NOT_SUBMITTED",
#         })
    


        
        
# class SubmitPanchayathVerificationView(APIView):
#     parser_classes = [MultiPartParser,FormParser]
    
#     def post(self,request):
#         user = request.user
        
#         if user.role != "PANCHAYATH":
#             return Response({"error":"Not allowed"},status=403)
#         if hasattr(user,"panchayath_verification"):
#             return Response({"error":"Already submitted"},status=400)
        
#         PanchayathVerification.objects.create(
#             user=user,
#             panchayath_name = request.data.get("panchayath_name"),
#             phone = request.data.get("phone"),
#             district = request.data.get("district"),
#             aadhaar_image = request.FILES.get("aadhaar_image"),
#             selfie_image = request.FILES.get("selfie_image"),
#         )
#         return Response({"message":"Verification submitted"})
    
    

# class PanchayathWardListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         wards = WardVerification.objects.filter(
#             panchayath=user,
#             status="APPROVED"
#         )
#         data = []
#         for ward in wards:
#             data.append({
#                 "id": ward.id,
#                 "ward_name": ward.ward_name,
#                 "username": ward.user.username,
#                 "email": ward.user.email,
#                 "phone": ward.phone,
#                 "district": ward.district,
#                 "submitted_at": ward.submitted_at,
#             })
#         return Response(data) 
    
    
# class PanchayathDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         total_wards = WardVerification.objects.filter(
#             panchayath=user
#         ).count()
#         approved_wards = WardVerification.objects.filter(
#             panchayath=user,
#             status="APPROVED"
#         ).count()
#         pending_wards = WardVerification.objects.filter(
#             panchayath=user,
#             status="PENDING"
#         ).count()
#         rejected_wards = WardVerification.objects.filter(
#             panchayath=user,
#             status="REJECTED"
#         ).count()
#         return Response({
#             "panchayath_name": getattr(user, "panchayath_verification", None).panchayath_name
#                 if hasattr(user, "panchayath_verification") else None,
#             "status": user.status,
#             "total_wards": total_wards,
#             "approved_wards": approved_wards,
#             "pending_wards": pending_wards,
#             "rejected_wards": rejected_wards,
#         })
    
    
    
# class WardVerificationDetailView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         try:
#             ward = WardVerification.objects.get(pk=pk, panchayath=user)
#         except WardVerification.DoesNotExist:
#             return Response({"error": "Ward not found"}, status=404)
#         return Response({
#             "id": ward.id,
#             "ward_name": ward.ward_name,
#             "username": ward.user.username,
#             "email": ward.user.email,
#             "phone": ward.phone,
#             "district": ward.district,
#             "status": ward.status,
#             "reject_reason": ward.reject_reason,
#             "aadhaar_image": ward.aadhaar_image.url if ward.aadhaar_image else None,
#             "selfie_image": ward.selfie_image.url if ward.selfie_image else None,
#             "submitted_at": ward.submitted_at,
#         })
    
    
# class ApproveWardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def patch(self, request, pk):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         try:
#             ward = WardVerification.objects.get(pk=pk, panchayath=user)
#         except WardVerification.DoesNotExist:
#             return Response({"error": "Ward not found"}, status=404)

#         ward.status = "APPROVED"
#         ward.save()
#         ward.user.status = User.Status.ACTIVE
#         ward.user.save()
#         return Response({"message": "Ward approved successfully"})
    
    
    
    
# class RejectWardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def patch(self, request, pk):

#         user = request.user

#         if user.role != "PANCHAYATH":
#             return Response({"error": "Not allowed"}, status=403)
#         reason = request.data.get("reason")
#         try:
#             ward = WardVerification.objects.get(pk=pk, panchayath=user)
#         except WardVerification.DoesNotExist:
#             return Response({"error": "Ward not found"}, status=404)

#         ward.status = "REJECTED"
#         ward.reject_reason = reason
#         ward.save()
#         ward.user.status = User.Status.SUSPENDED
#         ward.user.save()

#         return Response({"message": "Ward rejected successfully"})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from .permissions import IsPanchayath, IsActivePanchayath
from .models import PanchayathVerification
from apps.ward.models import WardVerification

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

        if PanchayathVerification.objects.filter(user=user).exists():
            return Response({"error": "Already submitted"}, status=400)

        PanchayathVerification.objects.create(
            user=user,
            panchayath_name=request.data.get("panchayath_name"),
            phone=request.data.get("phone"),
            district=request.data.get("district"),
            aadhaar_image=request.FILES.get("aadhaar_image"),
            selfie_image=request.FILES.get("selfie_image"),
        )

        return Response({"message": "Verification submitted"})



class PanchayathDashboardView(APIView):
    permission_classes = [IsActivePanchayath]

    def get(self, request):

        user = request.user

        total_wards = WardVerification.objects.filter(
            panchayath=user
        ).count()

        approved_wards = WardVerification.objects.filter(
            panchayath=user,
            status="APPROVED"
        ).count()

        pending_wards = WardVerification.objects.filter(
            panchayath=user,
            status="PENDING"
        ).count()

        rejected_wards = WardVerification.objects.filter(
            panchayath=user,
            status="REJECTED"
        ).count()

        verification = PanchayathVerification.objects.filter(user=user).first()

        return Response({
            "panchayath_name": verification.panchayath_name if verification else None,
            "status": user.status,
            "total_wards": total_wards,
            "approved_wards": approved_wards,
            "pending_wards": pending_wards,
            "rejected_wards": rejected_wards,
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

        return Response({
            "id": ward.id,
            "ward_name": ward.ward_name,
            "username": ward.user.username,
            "email": ward.user.email,
            "phone": ward.phone,
            "district": ward.district,
            "status": ward.status,
            "reject_reason": ward.reject_reason,
            "aadhaar_image": ward.aadhaar_image.url if ward.aadhaar_image else None,
            "selfie_image": ward.selfie_image.url if ward.selfie_image else None,
            "submitted_at": ward.submitted_at,
        })



class ApproveWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def patch(self, request, pk):

        user = request.user

        try:
            ward = WardVerification.objects.get(
                pk=pk,
                panchayath=user
            )
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        ward.status = "APPROVED"
        ward.save()
        ward.user.status = User.Status.ACTIVE
        ward.user.save()

        return Response({"message": "Ward approved successfully"})



class RejectWardView(APIView):
    permission_classes = [IsActivePanchayath]

    def patch(self, request, pk):

        user = request.user
        reason = request.data.get("reason")

        try:
            ward = WardVerification.objects.get(
                pk=pk,
                panchayath=user
            )
        except WardVerification.DoesNotExist:
            return Response({"error": "Ward not found"}, status=404)

        ward.status = "REJECTED"
        ward.reject_reason = reason
        ward.save()
        ward.user.status = User.Status.SUSPENDED
        ward.user.save()

        return Response({"message": "Ward rejected successfully"})