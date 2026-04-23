from rest_framework.response import Response
from .models import Notification


def success_response(message="", data=None, status=200):
    return Response({
        "success": True,
        "message": message,
        "data": data or {}
    }, status=status)


def error_response(message="", errors=None, status=400):
    return Response({
        "success": False,
        "message": message,
        "errors": errors or {}
    }, status=status)
    
    
def send_notification(user,title,message,n_type,complaint=None,sender=None):
    Notification.objects.create(
        user = user,
        title = title,
        message = message,
        notification_type = n_type,
        complaint=complaint,
        sender = sender
    )
