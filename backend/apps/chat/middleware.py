# from urllib.parse import parse_qs

# from channels.middleware import BaseMiddleware

# from channels.db import database_sync_to_async

# from django.contrib.auth import get_user_model

# from rest_framework_simplejwt.tokens import AccessToken

# from rest_framework_simplejwt.exceptions import TokenError


# User = get_user_model()


# @database_sync_to_async
# def get_user(token):

#     try:

#         print("TOKEN:", token)

#         access_token = AccessToken(token)

#         print("PAYLOAD:", access_token.payload)

#         user_id = access_token["user_id"]

#         print("USER ID:", user_id)

#         user = User.objects.get(id=user_id)

#         print("FOUND USER:", user)

#         return user

#     except Exception as e:

#         print("JWT ERROR:", str(e))

#         return None


# # class JWTAuthMiddleware(BaseMiddleware):

# #     async def __call__(self, scope, receive, send):

# #         headers = dict(scope["headers"])

# #         cookies = headers.get(b"cookie", b"").decode()

# #         token = None

# #         for cookie in cookies.split(";"):

# #             cookie = cookie.strip()

# #             if cookie.startswith("access_token="):

# #                 token = cookie.split("=")[1]

# #                 break

# #         if token:

# #             user = await get_user(token)

# #             scope["user"] = user

# #         else:

# #             scope["user"] = None

# #         return await super().__call__(
# #             scope,
# #             receive,
# #             send
# #         )



# # from urllib.parse import parse_qs

# # class JWTAuthMiddleware(BaseMiddleware):

# #     async def __call__(
# #         self,
# #         scope,
# #         receive,
# #         send
# #     ):

# #         query_string = parse_qs(
# #             scope["query_string"].decode()
# #         )

# #         token = query_string.get(
# #             "token",
# #             [None]
# #         )[0]

# #         if token:

# #             user = await get_user(
# #                 token
# #             )

# #             scope["user"] = user

# #         else:

# #             scope["user"] = None

# #         return await super().__call__(
# #             scope,
# #             receive,
# #             send
# #         )





# from urllib.parse import parse_qs

# class JWTAuthMiddleware(BaseMiddleware):

#     async def __call__(
#         self,
#         scope,
#         receive,
#         send
#     ):

#         query_string = parse_qs(
#             scope["query_string"].decode()
#         )

#         token = query_string.get(
#             "token",
#             [None]
#         )[0]

#         print("TOKEN:", token)

#         if token:

#             user = await get_user(token)

#             scope["user"] = user

#         else:

#             scope["user"] = None

#         return await super().__call__(
#             scope,
#             receive,
#             send
#         )






from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser

User = get_user_model()


@database_sync_to_async
def get_user(token):

    try:

        

        access_token = AccessToken(token)

        

        user_id = access_token["user_id"]

        

        user = User.objects.get(id=user_id)

        

        return user

    except Exception as e:

        print("JWT ERROR =", str(e))

        return None


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(
        self,
        scope,
        receive,
        send
    ):

        headers = dict(
            scope["headers"]
        )

        cookie_header = headers.get(
            b"cookie",
            b""
        ).decode()
        
        print("COOKIE HEADER =", cookie_header)

        

        cookies = {}

        for cookie in cookie_header.split(";"):

            if "=" in cookie:

                key, value = (
                    cookie.strip().split(
                        "=",
                        1
                    )
                )

                cookies[key] = value

        

        query_params = parse_qs(
            scope["query_string"].decode()
        )

        role = query_params.get(
            "role",
            [None]
        )[0]
        
        

        if role == "admin":

            token = cookies.get(
                "admin_access_token"
            )

        elif role == "ward":

            token = cookies.get(
                "ward_access_token"
            )

        elif role == "panchayath":

            token = cookies.get(
                "panchayath_access_token"
            )

        elif role == "citizen":

            token = cookies.get(
                "citizen_access_token"
            )

        else:

            token = None
            
        
        print("ROLE =", role)
        print("TOKEN =", token)

        if token:

            user = await get_user(token)

            scope["user"] = (
                user
                if user
                else AnonymousUser()
            )

        else:

            scope["user"] = AnonymousUser()

        return await super().__call__(
            scope,
            receive,
            send
        )