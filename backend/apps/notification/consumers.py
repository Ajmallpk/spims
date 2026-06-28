# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async

# import json


# class NotificationConsumer(AsyncWebsocketConsumer):

#     async def connect(self):

#         self.user = self.scope["user"]

#         if self.user.is_anonymous:
#             await self.close()
#             return

#         self.group_name = f"notifications_{self.user.id}"

#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         await self.accept()


#     async def disconnect(self, close_code):

#         if hasattr(self, "group_name"):

#             await self.channel_layer.group_discard(
#                 self.group_name,
#                 self.channel_name
#             )


#     async def send_notification(self, event):

#         await self.send(text_data=json.dumps({
#             "title": event["title"],
#             "message": event["message"],
#             "notification_type": event["notification_type"],
#         }))




from channels.generic.websocket import AsyncWebsocketConsumer
import json


class NotificationConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        self.user = self.scope.get("user")

        print("USER FROM SCOPE:", self.user)

        if not self.user:
            print("NO USER FOUND")
            await self.close()
            return

        if self.user.is_anonymous:
            await self.close()
            return

        self.group_name = (
            f"notifications_{self.user.id}"
        )

        print(
            "GROUP:",
            self.group_name
        )

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(
        self,
        close_code
    ):

        if hasattr(
            self,
            "group_name"
        ):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )


    async def send_notification(
        self,
        event
    ):

        print(
            "SENDING WS EVENT:",
            event
        )

        await self.send(
            text_data=json.dumps({
                
                "id": event["id"],

                "title":
                event["title"],

                "message":
                event["message"],

                "notification_type":
                event["notification_type"],
                
                "complaint_id":
                event.get("complaint_id"),
                
                "extra_data": event.get("extra_data", {})

            })
        )