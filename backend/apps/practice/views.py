from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
# Create your views here.


class DeploymentPracticeView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        
        return Response({
            "message":"spims Deployment Practice",
            "version" : 2
        })
