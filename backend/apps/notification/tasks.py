from celery import shared_task

from django.contrib.auth import get_user_model

from apps.complaints.models import Complaint

from .models import Notification

from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from .fcm import send_push_notification


User = get_user_model()



def build_notification_target(
    user,
    notification_type,
    complaint=None,
    verification_id=None,
):
    if user.is_superuser:
        role = "ADMIN"
    else:
        role = user.role

    

    

    if notification_type == "CHAT":

        if role=="CITIZEN":

            if complaint:

                return {
                    "page":"CITIZEN_COMPLAINT_CHAT",
                    "id":complaint.id
                }

            return {
                "page":"CITIZEN_DASHBOARD"
            }

        elif role == "WARD":

            if complaint:
                return {
                    "page": "WARD_COMPLAINT_CHAT",
                    "id": complaint.id,
                }

            return {
                "page": "WARD_AUTHORITY_CHAT",
            }

        elif role == "PANCHAYATH":

            return {
                "page": "PANCHAYATH_AUTHORITY_CHAT",
            }

        elif role == "ADMIN":

            return {
                "page": "ADMIN_DASHBOARD",
            }
            
            
    # -------- Verification Notifications --------

    if notification_type == "CITIZEN_VERIFICATION":

        if role == "WARD":
            return {
                "page": "WARD_CITIZEN_VERIFICATIONS",
                "verification_id": verification_id,
            }

        return {
            "page": "CITIZEN_VERIFICATION"
        }


    if notification_type == "WARD_VERIFICATION":

        if role == "PANCHAYATH":

            return {
                "page": "PANCHAYATH_WARD_VERIFICATIONS",
                "verification_id": verification_id,
            }

        return {
            "page": "WARD_DASHBOARD"
        }


    if notification_type == "PANCHAYATH_VERIFICATION":

        if role == "ADMIN":
            return {
                "page": "ADMIN_PANCHAYATH_VERIFICATIONS",
                "verification_id": verification_id,
            }

        if role == "PANCHAYATH":
            return {
                "page": "PANCHAYATH_VERIFICATION"
            }
    
    
    
    if notification_type in [
        "NEW_COMPLAINT",
        "COMPLAINT_STATUS",
        "ESCALATION",
        "REASSIGN",
        "RESOLUTION",
        "UPVOTE",
        "COMMENT",
        "REPLY",
    ]:
        
        
        if complaint:

            if role == "CITIZEN":
                return {
                    "page": "CITIZEN_COMPLAINT_DETAIL",
                    "id": complaint.id,
                }

            elif role == "WARD":

                if notification_type == "REASSIGN":
                    return {
                        "page": "WARD_REASSIGNED_COMPLAINT",
                        "id": complaint.id,
                    }

                return {
                    "page": "WARD_COMPLAINT_DETAIL",
                    "id": complaint.id,
                }

            elif role == "PANCHAYATH":
                return {
                    "page": "PANCHAYATH_COMPLAINT_DETAIL",
                    "id": complaint.id,
                }

            elif role == "ADMIN":
                return {
                    "page": "ADMIN_COMPLAINT_DETAIL",
                    "id": complaint.id,
                }
                
                
        # -------- Alert Notifications --------

    if notification_type == "ALERT":

        if role == "ADMIN":
            return {
                "page": "DASHBOARD"
            }

        elif role == "PANCHAYATH":
            return {
                "page": "DASHBOARD"
            }

        elif role == "WARD":
            return {
                "page": "DASHBOARD"
            }

        elif role == "CITIZEN":
            return {
                "page": "DASHBOARD"
            }

    # Default
    return {
        "page": "DASHBOARD"
    }


@shared_task
def send_notification_task(
    user_id,
    title,
    message,
    n_type,
    complaint_id=None,
    sender_id=None,
    extra_data=None,
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

    payload = extra_data or {}

    payload["target"] = build_notification_target(
        user=user,
        notification_type=n_type,
        complaint=complaint,
        verification_id=payload.get("verification_id")
    )
    
    
    print("ROLE =", user.role)
    print("TYPE =", n_type)
    print("TARGET =", build_notification_target(
        user=user,
        notification_type=n_type,
        complaint=complaint,
    ))

    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=n_type,
        complaint=complaint,
        sender=sender,
        extra_data=payload,
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
            "complaint_id": complaint.id if complaint else None,
            "extra_data": payload
        }
    )
    
    print("GROUP SEND FINISHED")

    send_push_notification(
        user=user,
        title=title,
        body=message
    )

    return notification.id