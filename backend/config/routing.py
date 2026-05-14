from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

from apps.chat.routing import websocket_urlpatterns as chat_ws
from apps.notification.routing import websocket_urlpatterns as notification_ws
from apps.complaints.routing import websocket_urlpatterns as complaint_ws


django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({

    "http": django_asgi_app,

    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat_ws + notification_ws + complaint_ws
        )
    ),
})