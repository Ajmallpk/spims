from django.urls import path
from .consumers import CommentConsumer


websocket_urlpatterns = [

    path(
        "ws/comments/<int:complaint_id>/",
        CommentConsumer.as_asgi()
    ),

]