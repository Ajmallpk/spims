from firebase_admin import messaging

from .models import FCMDevice


def send_push_notification(
    user,
    title,
    body
):

    devices = FCMDevice.objects.filter(
        user=user
    )

    if not devices.exists():
        return

    tokens = list(
        devices.values_list(
            "token",
            flat=True
        )
    )

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        tokens=tokens
    )

    response = messaging.send_each_for_multicast(
        message
    )

    invalid_tokens = []

    for index, resp in enumerate(
        response.responses
    ):

        if not resp.success:

            invalid_tokens.append(
                tokens[index]
            )

    if invalid_tokens:

        FCMDevice.objects.filter(
            token__in=invalid_tokens
        ).delete()