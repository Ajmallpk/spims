from celery import shared_task

from django.contrib.auth import get_user_model

from apps.complaints.models import Complaint

from .models import Notification

from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from .fcm import send_push_notification


User = get_user_model()


@shared_task
def send_notification_task(
    user_id,
    title,
    message,
    n_type,
    complaint_id=None,
    sender_id=None
):

    user = User.objects.filter(
        id=user_id
    ).first()

    if not user:
        return

    complaint = None

    if complaint_id:

        complaint = Complaint.objects.filter(
            id=complaint_id
        ).first()

    sender = None

    if sender_id:

        sender = User.objects.filter(
            id=sender_id
        ).first()

    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=n_type,
        complaint=complaint,
        sender=sender
    )

    channel_layer = get_channel_layer()
    
    
    print("CHANNEL LAYER =", channel_layer)

    print(
        "SENDING TO GROUP =",
        f"notifications_{user.id}"
    )

    async_to_sync(
        channel_layer.group_send
    )(
        f"notifications_{user.id}",
        {
            "type": "send_notification",
            "title": title,
            "id": notification.id,
            "message": message,
            "notification_type": n_type,
        }
    )
    
    print("GROUP SEND FINISHED")

    send_push_notification(
        user=user,
        title=title,
        body=message
    )

    return notification.id