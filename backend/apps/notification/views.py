from django.shortcuts import render
from .pagination import NotificationPagination
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer
from .utils import success_response,error_response
# Create your views here.




class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            notification = Notification.objects.filter(
                user = request.user
            ).order_by("-created_at")
            
            paginator = NotificationPagination()
            paginated_qs = paginator.paginate_queryset(notification,request)
            
            serializer = NotificationSerializer(paginated_qs,many=True)
            
            return paginator.get_paginated_response({
                "message":"Notification fetched",
                "data":serializer.data 
            })

        except Exception as e:
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
            
class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request,notification_id):
        try:
            notification = Notification.objects.filter(
                id = notification_id,
                user = request.user
            ).first()
            
            if not notification:
                return error_response(
                    message="Notification not found",
                    status=404
                )
            notification.is_read = True
            notification.save()
            
            return success_response(
                message="Notification marked as read"
            )
        except Exception:
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            Notification.objects.filter(
                user=request.user,
                is_read=False
            ).update(is_read=True)

            return success_response(
                message="All notifications marked as read"
            )

        except Exception:
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
class UnreadNotificationCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            count = Notification.objects.filter(
                user = request.user,
                is_read = False
            ).count()
            
            return success_response(
                message="Unread count fetched",
                data = {"unread_count":count}
            )
            
        except Exception:
            return error_response(
                message= "Something went wrong",
                status=500
            )
            
             