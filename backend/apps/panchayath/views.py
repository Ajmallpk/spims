from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.accounts.permissions import IsPanchayath
from .serializers import PanchayathVerificationSerializer
from .models import PanchayathVerification


class PanchayathVerificationSubmitView(APIView):

    permission_classes = [IsAuthenticated, IsPanchayath]

    def post(self, request):

        if hasattr(request.user, "panchayath_verification"):
            return Response({"message": "Already submitted"}, status=400)

        serializer = PanchayathVerificationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Verification submitted"}, status=201)

        return Response(serializer.errors, status=400)