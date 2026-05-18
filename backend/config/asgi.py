# import os
# import django

# os.environ.setdefault(
#     "DJANGO_SETTINGS_MODULE",
#     "config.settings"
# )

# django.setup()

# from .routing import application



# import os

# os.environ.setdefault(
#     "DJANGO_SETTINGS_MODULE",
#     "config.settings"
# )

# from django.core.asgi import get_asgi_application

# django_asgi_app = get_asgi_application()


# from channels.routing import (
#     ProtocolTypeRouter,
#     URLRouter
# )

# from channels.auth import AuthMiddlewareStack

# from apps.chat.routing import websocket_urlpatterns


# application = ProtocolTypeRouter({

#     "http": django_asgi_app,

#     "websocket": AuthMiddlewareStack(

#         URLRouter(
#             websocket_urlpatterns
#         )

#     ),

# })


import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

from channels.routing import (
    ProtocolTypeRouter,
    URLRouter
)

from apps.chat.routing import websocket_urlpatterns

from apps.chat.middleware import JWTAuthMiddleware


application = ProtocolTypeRouter({

    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(

        URLRouter(
            websocket_urlpatterns
        )

    ),

})