from channels.generic.websocket import AsyncWebsocketConsumer
import json


class CommentConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.complaint_id = self.scope["url_route"]["kwargs"]["complaint_id"]

        self.group_name = f"comments_{self.complaint_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )


    async def send_comment(self, event):

        await self.send(
            text_data=json.dumps({

                "id": event["id"],
                "comment": event["comment"],
                "user_name": event["user_name"],
                "user_id": event["user_id"],
                "created_at": event["created_at"],

                "parent_id": event.get(
                    "parent_id"
                )

            })
        )
        
        
    async def edit_comment(self, event):

        await self.send(
            text_data=json.dumps({

                "action":"edit",

                "id":event["id"],

                "comment":event["comment"]

            })
        )
        
        
    async def delete_comment(self, event):

        await self.send(
            text_data=json.dumps({

                "action": "delete",

                "id": event["id"]

            })
        )