# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from django.core.asgi import get_asgi_application
# from apps.chat.routing import websocket_urlpatterns

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),

#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from apps.chat.routing import websocket_urlpatterns as chat_ws
from apps.notification.routing import websocket_urlpatterns as notification_ws

application = ProtocolTypeRouter({

    "websocket": AuthMiddlewareStack(

        URLRouter(
            chat_ws + notification_ws
        )
    )
})