from channels.generic.websocket import AsyncWebsocketConsumer
import json


class InboxConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        print(
            "INBOX USER:",
            self.user
        )

        if self.user.is_anonymous:

            await self.close()
            return

        self.group_name = (
            f"authority_inbox_{self.user.id}"
        )

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()


    # async def disconnect(
    #     self,
    #     close_code
    # ):

    #     await self.channel_layer.group_discard(
    #         self.group_name,
    #         self.channel_name
    #     )

    
    async def disconnect(
        self,
        close_code
    ):

        if hasattr(self, "group_name"):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def sidebar_update(
        self,
        event
    ):

        await self.send(
            text_data=json.dumps({
                "type":
                "sidebar_update",

                "data": {
                    "chat_id":
                    event["chat_id"],

                    "last_message":
                    event["last_message"],

                    "sender":
                    event["sender"]
                }
            })
        )