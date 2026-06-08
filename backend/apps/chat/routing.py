from django.urls import path
from .consumers import ComplaintChatConsumer, AuthorityChatConsumer
from .inbox_consumer import InboxConsumer
websocket_urlpatterns = [

    path(
        "ws/chat/complaint/<int:complaint_id>/",
        ComplaintChatConsumer.as_asgi()
    ),

    path(
        "ws/chat/authority/<int:chat_id>/",
        AuthorityChatConsumer.as_asgi()
    ),
    
    path(
        "ws/inbox/",
        InboxConsumer.as_asgi()
    ),
    
]