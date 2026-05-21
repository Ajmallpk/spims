from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.group_name = f"notifications_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):

        if hasattr(self, "group_name"):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )


    async def send_notification(self, event):

        await self.send(text_data=json.dumps({
            "title": event["title"],
            "message": event["message"],
            "notification_type": event["notification_type"],
        }))