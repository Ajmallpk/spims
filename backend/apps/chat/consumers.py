from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from apps.complaints.models import Complaint
from apps.chat.models import Chat, Message
from django.contrib.auth import get_user_model
from apps.notification.utils import send_notification 
from apps.notification.models import Notification
from .serializers import MessageSerializer
from .permissions import (
    can_access_complaint_chat,
    can_access_authority_chat,
)
from .rate_limit import is_rate_limited
from asgiref.sync import async_to_sync
from django.core.cache import cache
import asyncio
from django.db.models import Q



User = get_user_model()



class ComplaintChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]
        
        
        print("=" * 50)
        print("COMPLAINT CHAT CONNECT")
        print("USER =", self.user)

        if self.user.is_anonymous:

            print("ANONYMOUS USER REJECTED")

            await self.close()
            return

        self.complaint_id = self.scope["url_route"]["kwargs"]["complaint_id"]

        print("ROLE =", self.user.role)
        print("ID =", self.user.id)
        print("COMPLAINT =", self.complaint_id)
        print("=" * 50)


        if self.user.is_anonymous:
            await self.close()
            return

        self.complaint_id = self.scope["url_route"]["kwargs"]["complaint_id"]

        self.room_group_name = f"complaint_chat_{self.complaint_id}"

        is_allowed = await self.is_user_allowed()

        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.set_user_online()


    async def disconnect(self, close_code):

        if hasattr(self, "room_group_name"):

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

        if not self.user.is_anonymous:

            await self.set_user_offline()
        
        
    @database_sync_to_async
    def set_user_online(self):

        cache_key = (
            f"user_connections_{self.user.id}"
        )

        connections = cache.get(
            cache_key,
            0
        )

        cache.set(
            cache_key,
            connections + 1
        )

        if connections == 0:

            self.user.is_online = True

            self.user.save(
                update_fields=["is_online"]
            )

            # async_to_sync(
            #     self.channel_layer.group_send
            # )(
            #     self.room_group_name,
            #     {
            #         "type": "presence_update",
            #         "event_type": "presence",
            #         "username": self.user.username,
            #         "is_online": True
            #     }
            # )
            
            
            chat_ids = Chat.objects.filter(
                Q(sender_authority=self.user) |
                Q(receiver_authority=self.user)
            ).values_list(
                "id",
                flat=True
            )

            for chat_id in chat_ids:

                async_to_sync(
                    self.channel_layer.group_send
                )(
                    f"authority_chat_{chat_id}",
                    {
                        "type":"presence_update",
                        "event_type":"presence",
                        "username":self.user.username,
                        "is_online":True,
                    }
                )
        
        
    @database_sync_to_async
    def set_user_offline(self):

        from django.utils.timezone import now

        cache_key = (
            f"user_connections_{self.user.id}"
        )

        connections = cache.get(
            cache_key,
            0
        )

        remaining_connections = max(
            connections - 1,
            0
        )

        cache.set(
            cache_key,
            remaining_connections
        )

        if remaining_connections == 0:

            self.user.is_online = False

            self.user.last_seen = now()

            self.user.save(
                update_fields=[
                    "is_online",
                    "last_seen"
                ]
            )

            async_to_sync(
                self.channel_layer.group_send
            )(
                self.room_group_name,
                {
                    "type": "presence_update",
                    "event_type": "presence",
                    "username": self.user.username,
                    "is_online": False,
                    "last_seen": str(
                        self.user.last_seen
                    )
                }
            )
        
        
    async def send_error(self, message):

        await self.send(text_data=json.dumps({
            "type": "error",
            "message": message
        }))
        
    
        
    async def send_event(self, event_type, data):

        await self.send(text_data=json.dumps({
            "type": event_type,
            "data": data
        }))


    async def receive(self, text_data):

        try:
            
            print("MESSAGE RECEIVED FROM", self.user)
            print(text_data)

            data = json.loads(text_data)

        except json.JSONDecodeError:

            await self.send_error(
                "Invalid JSON data"
            )

            return

        event_type = data.get("type")
        
        allowed_events = [
            "message",
            "typing",
            "seen",
            "delivered"
        ]

        if event_type not in allowed_events:

            await self.send_error(
                "Invalid event type"
            )

            return

        if event_type == "delivered":

            message_id = data.get("message_id")

            await self.mark_message_delivered(
                message_id
            )

            return
        
        
        if event_type == "seen":

            message_id = data.get("message_id")

            await self.mark_message_seen(
                message_id
            )

            return
        
        
        if event_type == "typing":

            is_typing = data.get(
                "is_typing",
                False
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "event_type": "typing",
                    "username": self.user.username,
                    "is_typing": is_typing
                }
            )

            return
        message = data.get("message", "")

        reply_to_id = data.get("reply_to")

        voice_duration = data.get(
            "voice_duration"
        )

        if not isinstance(message, str):

            await self.send_error(
                "Invalid message format"
            )

            return

        message = message.strip()

        if (
            reply_to_id is not None
            and not isinstance(reply_to_id, int)
        ):

            await self.send_error(
                "Invalid reply_to format"
            )

            return

        if (
            voice_duration is not None
            and not isinstance(
                voice_duration,
                int
            )
        ):

            await self.send_error(
                "Invalid voice duration"
            )

            return

        
        message = message.strip()

        if (
            reply_to_id is not None
            and not isinstance(reply_to_id, int)
        ):

            await self.send_error(
                "Invalid reply_to format"
            )

            return

        if (
            voice_duration is not None
            and not isinstance(
                voice_duration,
                int
            )
        ):

            await self.send_error(
                "Invalid voice duration"
            )

            return
        
        
        
        
        
        
        if is_rate_limited(self.user.id):

            await self.send_error(
                "Too many messages. Please slow down."
            )

            return

        if not message:

            await self.send_error(
                "Message cannot be empty"
            )

            return

        result = await self.save_message(
            message,
            reply_to_id,
            voice_duration
            )

        if not result:
            return

        if "error" in result:

            await self.send_error(
                result["error"]
            )

            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "event_type": "message",
                "message_data": result
            }
        )
        
        
    


    async def chat_message(self, event):
        
        print("BROADCASTING MESSAGE")
        print(event)

        await self.send_event(
            event["event_type"],
            event["message_data"]
        )
        
        
    async def delivery_update(self, event):
        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )
        
    async def seen_update(self, event):
        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )   
        
    async def typing_status(self, event):

        if event["username"] == self.user.username:
            return

        await self.send_event(
            event["event_type"],
            {
                "user": event["username"],
                "is_typing": event["is_typing"]
            }
        )
        
        
    async def presence_update(self, event):

        if event["username"] == self.user.username:
            return

        await self.send_event(
            event["event_type"],
            {
                "user": event["username"],
                "is_online": event["is_online"],
                "last_seen": event.get("last_seen")
            }
        )
        
        
    async def message_deleted(self, event):

        print("MESSAGE DELETE EVENT", event)
        
        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )
        
        
        
        
    @database_sync_to_async
    def mark_message_delivered(self, message_id):

        from django.utils.timezone import now

        message = Message.objects.filter(
            id=message_id
        ).exclude(
            sender=self.user
        ).first()

        if not message:
            return

        if message.is_delivered:
            return

        message.is_delivered = True

        message.delivered_at = now()

        message.save()
        
        async_to_sync(
            self.channel_layer.group_send
        )(
            self.room_group_name,
            {
                "type": "delivery_update",
                "event_type": "delivery_update",
                "message_id": message.id
            }
        )
        
    @database_sync_to_async
    def mark_message_seen(self, message_id):

        from django.utils.timezone import now

        message = Message.objects.filter(
            id=message_id
        ).exclude(
            sender=self.user
        ).first()

        if not message:
            return None

        if message.is_read:
            return None

        message.is_read = True

        message.read_at = now()

        message.save()

        async_to_sync(
            self.channel_layer.group_send
        )(
            self.room_group_name,
            {
                "type": "seen_update",
                "event_type": "seen_update",
                "message_id": message.id
            }
        )

        return message.id


    @database_sync_to_async
    def is_user_allowed(self):

        try:
            complaint = Complaint.objects.get(id=self.complaint_id)

        except Complaint.DoesNotExist:
            return False

        chat = Chat.objects.filter(
            complaint=complaint,
            chat_type="COMPLAINT"
        ).first()

        if not chat:

            return self.user in [
                complaint.citizen,
                complaint.ward,
                complaint.panchayath
            ]

        return can_access_complaint_chat(
            self.user,
            chat
        )


    @database_sync_to_async
    def save_message(self, message,reply_to_id=None,voice_duration=None):

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
                return {
                    "error": "Chat is closed by authority"
                }

            if self.user.role == "CITIZEN":

                first_message_exists = Message.objects.filter(
                    chat=chat
                ).exists()

                if not first_message_exists:
                    return {
                        "error": "Wait for authority to start the conversation"
                    }
                    
                    
            reply_message = None

            if reply_to_id:

                reply_message = Message.objects.filter(
                    id=reply_to_id,
                    chat=chat
                ).first()

        
            message_obj = Message.objects.create(
                chat=chat,
                sender=self.user,
                message=message,
                reply_to=reply_message,
                voice_duration=voice_duration,
            )

            if self.user == complaint.citizen:
                receiver = chat.authority
            else:
                receiver = complaint.citizen

            send_notification(
                user=receiver,
                title="New Chat Message",
                message=f"{self.user.username} sent a message",
                n_type="CHAT",
                complaint=complaint,
                sender=self.user
            )

            message_obj = Message.objects.select_related(
                "sender",
                "reply_to",
                "reply_to__sender",
                "forwarded_from"
            ).get(
                id=message_obj.id
            )

            serializer = MessageSerializer(message_obj)


            if self.user == complaint.citizen:

                async_to_sync(
                    self.channel_layer.group_send
                )(
                    f"authority_inbox_{receiver.id}",
                    {
                        "type": "sidebar_update",
                        "chat_id": complaint.id,
                        "last_message": (
                            message_obj.message
                            or "Attachment"
                        ),
                        "sender": self.user.username,
                    }
                )

            else:

                async_to_sync(
                    self.channel_layer.group_send
                )(
                    f"authority_inbox_{complaint.citizen.id}",
                    {
                        "type": "sidebar_update",
                        "chat_id": complaint.id,
                        "last_message": (
                            message_obj.message
                            or "Attachment"
                        ),
                        "sender": self.user.username,
                    }
                )

            return serializer.data
        
        

        except Exception as e:
            return {
                "error": str(e)
            }
        
        
        
class AuthorityChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]
        
        print("WEBSOCKET USER:", self.user)
        print("IS AUTH:", self.user.is_authenticated)

        if self.user.is_anonymous:
            await self.close()
            return

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]

        self.room_group_name = f"authority_chat_{self.chat_id}"

        is_allowed = await self.is_user_allowed()

        if not is_allowed:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        
        
        
        await self.channel_layer.group_add(
            f"user_inbox_{self.user.id}",
            self.channel_name
        )
        
        
        # await self.send(text_data=json.dumps({
        #     "type": "presence",
        #     "data": {
        #         "user": self.user.username,
        #         "is_online": True
        #     }
        # }))
        
        
        
        await self.set_user_online()
        
        


    async def disconnect(self, close_code):
        
        await self.channel_layer.group_discard(
            f"user_inbox_{self.user.id}",
            self.channel_name
        )

        if hasattr(self, "room_group_name"):

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
        # await asyncio.sleep(3)

        await self.set_user_offline()
        
        
    @database_sync_to_async
    def set_user_online(self):

        cache_key = (
            f"user_connections_{self.user.id}"
        )
        print(
            "ONLINE",
            self.user.username,
            cache.get(cache_key)
        )

        connections = cache.get(
            cache_key,
            0
        )

        cache.set(
            cache_key,
            connections + 1,
            timeout=120
        )

        if connections == 0:

            self.user.is_online = True

            self.user.save(
                update_fields=["is_online"]
            )

            # async_to_sync(
            #     self.channel_layer.group_send
            # )(
            #     self.room_group_name,
            #     {
            #         "type": "presence_update",
            #         "event_type": "presence",
            #         "username": self.user.username,
            #         "is_online": True
            #     }
            # )
            
            
            chat_ids = Chat.objects.filter(
                Q(sender_authority=self.user) |
                Q(receiver_authority=self.user)
            ).values_list(
                "id",
                flat=True
            )

            for chat_id in chat_ids:

                async_to_sync(
                    self.channel_layer.group_send
                )(
                    f"authority_chat_{chat_id}",
                    {
                        "type":"presence_update",
                        "event_type":"presence",
                        "username":self.user.username,
                        "is_online":True,
                    }
                )
        
        
    # @database_sync_to_async
    # def set_user_offline(self):

    #     from django.utils.timezone import now

    #     cache_key = (
    #         f"user_connections_{self.user.id}"
    #     )

    #     connections = cache.get(
    #         cache_key,
    #         0
    #     )

    #     remaining_connections = max(
    #         connections - 1,
    #         0
    #     )

    #     cache.set(
    #         cache_key,
    #         remaining_connections
    #     )

    #     if remaining_connections == 0:

    #         self.user.is_online = False

    #         self.user.last_seen = now()

    #         self.user.save(
    #             update_fields=[
    #                 "is_online",
    #                 "last_seen"
    #             ]
    #         )

    #         # async_to_sync(
    #         #     self.channel_layer.group_send
    #         # )(
    #         #     self.room_group_name,
    #         #     {
    #         #         "type": "presence_update",
    #         #         "event_type": "presence",
    #         #         "username": self.user.username,
    #         #         "is_online": False,
    #         #         "last_seen": str(
    #         #             self.user.last_seen
    #         #         )
    #         #     }
    #         # )
            
    #         chat_ids = Chat.objects.filter(
    #             Q(sender_authority=self.user) |
    #             Q(receiver_authority=self.user)
    #         ).values_list(
    #             "id",
    #             flat=True
    #         )

    #         for chat_id in chat_ids:

    #             async_to_sync(
    #                 self.channel_layer.group_send
    #             )(
    #                 f"authority_chat_{chat_id}",
    #                 {
    #                     "type":"presence_update",
    #                     "event_type":"presence",
    #                     "username":self.user.username,
    #                     "is_online":False,
    #                     "last_seen":str(
    #                         self.user.last_seen
    #                     )
    #                 }
    #             )
    
    @database_sync_to_async
    def set_user_offline(self):

        from django.utils.timezone import now

        cache_key = f"user_connections_{self.user.id}"
        
        print(
            "OFFLINE",
            self.user.username,
            cache.get(cache_key)
        )

        connections = cache.get(
            cache_key,
            0
        )

        remaining_connections = max(
            connections - 1,
            0
        )

        cache.set(
            cache_key,
            remaining_connections,
            timeout=300
        )

        fresh_connections = cache.get(
            cache_key,
            0
        )

        if fresh_connections > 0:

            return

        self.user.refresh_from_db()

        self.user.is_online = False

        self.user.last_seen = now()

        self.user.save(
            update_fields=[
                "is_online",
                "last_seen"
            ]
        )

        chat_ids = Chat.objects.filter(
            Q(sender_authority=self.user) |
            Q(receiver_authority=self.user)
        ).values_list(
            "id",
            flat=True
        )

        for chat_id in chat_ids:

            async_to_sync(
                self.channel_layer.group_send
            )(
                f"authority_chat_{chat_id}",
                {
                    "type":"presence_update",
                    "event_type":"presence",
                    "username":self.user.username,
                    "is_online":False,
                    "last_seen":str(
                        self.user.last_seen
                    )
                }
            )
    
            
        
    async def send_error(self, message):

        await self.send(text_data=json.dumps({
            "type": "error",
            "message": message
        }))
        
        
        
        
    async def send_event(self, event_type, data):

        await self.send(text_data=json.dumps({
            "type": event_type,
            "data": data
        }))


    async def receive(self, text_data):

        try:

            data = json.loads(text_data)

        except json.JSONDecodeError:

            await self.send_error(
                "Invalid JSON data"
            )

            return

        event_type = data.get("type")
        
        allowed_events = [
            "message",
            "typing",
            "seen",
            "delivered"
        ]

        if event_type not in allowed_events:

            await self.send_error(
                "Invalid event type"
            )

            return

        if event_type == "delivered":

            message_id = data.get("message_id")

            await self.mark_message_delivered(
                message_id
            )

            return
        
        
        if event_type == "seen":
            message_id = data.get("message_id")

            await self.mark_message_seen(
                message_id
            )

            return
        
        
        if event_type == "typing":

            is_typing = data.get(
                "is_typing",
                False
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "event_type": "typing",
                    "username": self.user.username,
                    "is_typing": is_typing
                }
            )

            return
        message = data.get("message", "")
        
        if len(message) > 2000:

            await self.send_error(
                "Message too long"
            )

            return
        
        
        reply_to_id = data.get("reply_to")

        voice_duration = data.get(
            "voice_duration"
        )

        if not isinstance(message, str):

            await self.send_error(
                "Invalid message format"
            )

            return
        
        message = message.strip()

        if (
            reply_to_id is not None
            and not isinstance(reply_to_id, int)
        ):

            await self.send_error(
                "Invalid reply_to format"
            )

            return

        if (
            voice_duration is not None
            and not isinstance(
                voice_duration,
                int
            )
        ):

            await self.send_error(
                "Invalid voice duration"
            )

            return
                
        
        if is_rate_limited(self.user.id):

            await self.send_error(
                "Too many messages. Please slow down."
            )

            return

        if not message:

            await self.send_error(
                "Message cannot be empty"
            )

            return

        result = await self.save_message(
            message,
            reply_to_id,
            voice_duration
            )

        if not result:
            return

        if "error" in result:

            await self.send_error(
                result["error"]
            )

            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "event_type": "message",
                "message_data": result
            }
        )


    async def chat_message(self, event):
        await self.send_event(
            event["event_type"],
            event["message_data"]
        )
        
        
    async def delivery_update(self, event):
        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )
        
    async def seen_update(self, event):

        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )    
        
    
    async def typing_status(self, event):

        if event["username"] == self.user.username:
            return

        await self.send_event(
            event["event_type"],
            {
                "user": event["username"],
                "is_typing": event["is_typing"]
            }
        )
        
        
    async def presence_update(self, event):

        if event["username"] == self.user.username:
            return

        await self.send_event(
            event["event_type"],
            {
                "user": event["username"],
                "is_online": event["is_online"],
                "last_seen": event.get("last_seen")
            }
        )
        
        
        
    async def sidebar_update(self, event):
        
        print(
            "SIDEBAR UPDATE EVENT",
            self.user.username,
            event
        )

        await self.send_event(
            "sidebar_update",
            {
                "chat_id": event["chat_id"],
                "last_message": event["last_message"],
                "sender": event["sender"],
            }
        )
        
        
        
    async def message_deleted(self, event):
        await self.send_event(
            event["event_type"],
            {
                "message_id": event["message_id"]
            }
        )
        
    @database_sync_to_async
    def mark_message_delivered(self, message_id):

        from django.utils.timezone import now

        message = Message.objects.filter(
            id=message_id
        ).exclude(
            sender=self.user
        ).first()

        if not message:
            return

        if message.is_delivered:
            return

        message.is_delivered = True

        message.delivered_at = now()

        message.save()
        
        
        async_to_sync(
            self.channel_layer.group_send
        )(
            self.room_group_name,
            {
                "type": "delivery_update",
                "event_type": "delivery_update",
                "message_id": message.id
            }
        )
        
        
    @database_sync_to_async
    def mark_message_seen(self, message_id):

        from django.utils.timezone import now

        message = Message.objects.filter(
            id=message_id
        ).exclude(
            sender=self.user
        ).first()

        if not message:
            return None

        if message.is_read:
            return None

        message.is_read = True

        message.read_at = now()

        message.save()

        async_to_sync(
            self.channel_layer.group_send
        )(
            self.room_group_name,
            {
                "type": "seen_update",
                "event_type": "seen_update",
                "message_id": message.id
            }
        )

        return message.id


    @database_sync_to_async
    def is_user_allowed(self):

        try:
            chat = Chat.objects.get(
                id=self.chat_id,
                chat_type="AUTHORITY"
            )

        except Chat.DoesNotExist:
            return False

        return can_access_authority_chat(
            self.user,
            chat
        )


    @database_sync_to_async
    def save_message(self, message,reply_to_id=None,voice_duration=None):

        try:
            chat = Chat.objects.filter(
                id=self.chat_id,
                chat_type="AUTHORITY"
            ).first()
            
            if not chat:

                return {
                    "error": "Chat not found"
                }

            if self.user not in [
                chat.sender_authority,
                chat.receiver_authority
            ]:

                return {
                    "error": "You are not allowed to send messages in this chat"
                }

            reply_message = None

            if reply_to_id:

                reply_message = Message.objects.filter(
                    id=reply_to_id,
                    chat=chat
                ).first()


            message_obj = Message.objects.create(
                chat=chat,
                sender=self.user,
                message=message,
                reply_to=reply_message,
                voice_duration=voice_duration,
            )

            receiver = (
                chat.receiver_authority
                if self.user == chat.sender_authority
                else chat.sender_authority
            )

            send_notification(
                user=receiver,
                title="New Authority Message",
                message=f"{self.user.username} sent a message",
                n_type="CHAT",
                sender=self.user
            )

            message_obj = Message.objects.select_related(
                "sender",
                "reply_to",
                "reply_to__sender",
                "forwarded_from"
            ).get(
                id=message_obj.id
            )

            serializer = MessageSerializer(message_obj)
            
            async_to_sync(
                self.channel_layer.group_send
            )(
                f"user_inbox_{receiver.id}",
                {
                    "type": "sidebar_update",
                    "chat_id": chat.id,
                    "last_message": (
                        message_obj.message
                        or "Attachment"
                    ),
                    "sender": self.user.username,
                }
            )
            
            print(
                "SIDEBAR SENT TO",
                receiver.id,
                chat.id
            )

            return serializer.data

        except Exception as e:
            return {
                "error": str(e)
            }
        
        
        