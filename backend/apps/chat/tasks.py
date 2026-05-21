# import os

# from io import BytesIO

# from PIL import Image

# from celery import shared_task

# from django.core.files.base import ContentFile

# from .models import Message


# @shared_task
# def generate_thumbnail_task(message_id):

#     message = Message.objects.filter(
#         id=message_id
#     ).first()

#     if not message:
#         return

#     if (
#         not message.file
#         or message.file_type != "IMAGE"
#     ):
#         return

#     if message.thumbnail:
#         return

#     image = Image.open(message.file)

#     image.thumbnail((300, 300))

#     thumb_io = BytesIO()

#     image.save(
#         thumb_io,
#         format="JPEG",
#         quality=70
#     )

#     thumbnail_name = (
#         f"thumb_{os.path.basename(message.file.name)}"
#     )

#     message.thumbnail.save(
#         thumbnail_name,
#         ContentFile(thumb_io.getvalue()),
#         save=False
#     )

#     message.save(
#         update_fields=["thumbnail"]
#     )



import os
import requests

from io import BytesIO
from PIL import Image

from celery import shared_task
from django.core.files.base import ContentFile

from .models import Message


@shared_task
def generate_thumbnail_task(message_id):

    message = Message.objects.filter(
        id=message_id
    ).first()

    if not message:
        return

    if (
        not message.file
        or message.file_type != "IMAGE"
    ):
        return

    if message.thumbnail:
        return

    try:

        response = requests.get(
            message.file.url,
            timeout=10
        )

        if response.status_code != 200:
            return

        image = Image.open(
            BytesIO(response.content)
        )

        image.thumbnail((300, 300))

        thumb_io = BytesIO()

        image.save(
            thumb_io,
            format="JPEG",
            quality=70
        )

        thumbnail_name = (
            f"thumb_{os.path.basename(message.file.name)}"
        )

        message.thumbnail.save(
            thumbnail_name,
            ContentFile(
                thumb_io.getvalue()
            ),
            save=False
        )

        message.save(
            update_fields=["thumbnail"]
        )

    except Exception as e:

        print(
            f"Thumbnail error: {e}"
        )