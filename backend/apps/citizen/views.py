from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CitizenProfile,CitizenVerification
from .serializers import CitizenProfileSerializer,CitizenVerificationSerializer


class CitizenProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        profile = CitizenProfile.objects.get(user=request.user)

        serializer = CitizenProfileSerializer(profile)

        return Response(serializer.data)
    


class UpdateCitizenProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        profile = CitizenProfile.objects.get(user=request.user)

        serializer = CitizenProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            })

        return Response(serializer.errors, status=400)
    
    
    
class CitizenVerificationSubmitView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        if user.role != "CITIZEN":
            return Response(
                {"error": "Only citizens can submit verification"},
                status=403
            )

        if CitizenVerification.objects.filter(user=user).exists():
            return Response(
                {"error": "Verification already submitted"},
                status=400
            )

        serializer = CitizenVerificationSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=user)

            return Response(
                {"message": "Verification submitted successfully"},
                status=201
            )

        return Response(serializer.errors, status=400)
    
    
    
class CitizenVerificationStatusView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        try:

            verification = CitizenVerification.objects.get(user=user)

            return Response({
                "submitted": True,
                "status": verification.status,
                "reject_reason": verification.reject_reason
            })

        except CitizenVerification.DoesNotExist:

            return Response({
                "submitted": False,
                "status": None
            })