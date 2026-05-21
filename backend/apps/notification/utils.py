from rest_framework.response import Response
from .models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .tasks import send_notification_task


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
    
 


# def send_notification(
#     user,
#     title,
#     message,
#     n_type,
#     complaint=None,
#     sender=None
# ):

#     send_notification_task.delay(
#         user_id=user.id,
#         title=title,
#         message=message,
#         n_type=n_type,
#         complaint_id=(
#             complaint.id
#             if complaint
#             else None
#         ),
#         sender_id=(
#             sender.id
#             if sender
#             else None
#         )
#     )



import logging

logger = logging.getLogger(__name__)


def send_notification(
    user,
    title,
    message,
    n_type,
    complaint=None,
    sender=None
):

    logger.info(
        f"NOTIFICATION CALLED -> "
        f"user={user.username} "
        f"type={n_type}"
    )

    send_notification_task.delay(
        user_id=user.id,
        title=title,
        message=message,
        n_type=n_type,
        complaint_id=(
            complaint.id
            if complaint
            else None
        ),
        sender_id=(
            sender.id
            if sender
            else None
        )
    )