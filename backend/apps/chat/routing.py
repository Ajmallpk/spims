from django.urls import path
from .consumers import ComplaintChatConsumer, AuthorityChatConsumer

websocket_urlpatterns = [

    path(
        "ws/chat/complaint/<int:complaint_id>/",
        ComplaintChatConsumer.as_asgi()
    ),

    path(
        "ws/chat/authority/<int:chat_id>/",
        AuthorityChatConsumer.as_asgi()
    ),
]