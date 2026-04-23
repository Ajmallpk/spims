from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from apps.complaints.models import Complaint
from apps.chat.models import Chat, Message
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]
        self.complaint_id = self.scope["url_route"]["kwargs"]["complaint_id"]
        self.room_group_name = f"chat_{self.complaint_id}"

        is_allowed = await self.is_user_allowed()

        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data.get("message")
        chat_type = data.get("chat_type", "COMPLAINT")

        if not message:
            return

        if chat_type == "COMPLAINT":
            result = await self.handle_message(message)

        elif chat_type == "AUTHORITY":
            receiver_id = data.get("receiver_id")
            result = await self.handle_authority_message(message, receiver_id)

        else:
            return

        if not result:
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": self.user.username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))


    @database_sync_to_async
    def is_user_allowed(self):
        try:
            complaint = Complaint.objects.get(id=self.complaint_id)
        except Complaint.DoesNotExist:
            return False

        return self.user in [
            complaint.citizen,
            complaint.ward,
            complaint.panchayath
        ]


    @database_sync_to_async
    def handle_message(self, message):
        try:
            complaint = Complaint.objects.get(id=self.complaint_id)

            chat = Chat.objects.filter(
                complaint=complaint,
                chat_type="COMPLAINT"
            ).first()

            if not chat:
                if self.user.role not in ["WARD", "PANCHAYATH"]:
                    return False

                chat = Chat.objects.create(
                    chat_type="COMPLAINT",
                    complaint=complaint,
                    citizen=complaint.citizen,
                    authority=self.user
                )

            if chat.is_closed:
                return False

            if self.user.role == "CITIZEN":
                first_message_exists = Message.objects.filter(chat=chat).exists()

                if not first_message_exists:
                    return False

            Message.objects.create(
                chat=chat,
                sender=self.user,
                message=message
            )

            return True

        except Exception:
            return False


    @database_sync_to_async
    def handle_authority_message(self, message, receiver_id):
        try:
            receiver = User.objects.get(id=receiver_id)

            if self.user.role not in ["WARD", "PANCHAYATH"]:
                return False

            if receiver.role not in ["WARD", "PANCHAYATH"]:
                return False

            if self.user.role == "WARD":
                if self.user.ward_verification.panchayath != receiver:
                    return False

            if self.user.role == "PANCHAYATH":
                if not receiver.ward_verification.filter(panchayath=self.user).exists():
                    return False

            chat = Chat.objects.filter(
                chat_type="AUTHORITY",
                sender_authority=self.user,
                receiver_authority=receiver
            ).first() or Chat.objects.filter(
                chat_type="AUTHORITY",
                sender_authority=receiver,
                receiver_authority=self.user
            ).first()

            if not chat:
                chat = Chat.objects.create(
                    chat_type="AUTHORITY",
                    sender_authority=self.user,
                    receiver_authority=receiver
                )

            Message.objects.create(
                chat=chat,
                sender=self.user,
                message=message
            )

            return True

        except Exception:
            return False