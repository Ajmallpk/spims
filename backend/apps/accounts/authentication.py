# from rest_framework_simplejwt.authentication import JWTAuthentication


# class CookieJWTAuthentication(JWTAuthentication):

#     def authenticate(self, request):

#         path = request.path

#         if path.startswith("/api/admin/"):
#             cookie_name = "admin_access_token"

#         elif path.startswith("/api/panchayath/"):
#             cookie_name = "panchayath_access_token"

#         elif path.startswith("/api/ward/"):
#             cookie_name = "ward_access_token"

#         else:
#             cookie_name = "citizen_access_token"
            
            
#         print("COOKIE =", cookie_name)

#         raw_token = request.COOKIES.get(cookie_name)

#         if not raw_token:
#             return None

#         try:
#             validated_token = self.get_validated_token(raw_token)

#             return (
#                 self.get_user(validated_token),
#                 validated_token
#             )

#         except Exception:
#             return None



from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(
    JWTAuthentication
):

    def authenticate(
        self,
        request
    ):
        
        print("PATH =", request.path)
        print("COOKIES =", request.COOKIES)

        path = request.path

        raw_token = None

        # if path.startswith("/api/admin/"):

        #     raw_token = request.COOKIES.get(
        #         "admin_access_token"
        #     )

        # elif path.startswith("/api/ward/"):

        #     raw_token = request.COOKIES.get(
        #         "ward_access_token"
        #     )

        # elif path.startswith("/api/panchayath/"):

        #     raw_token = request.COOKIES.get(
        #         "panchayath_access_token"
        #     )

        # else:

        #     raw_token = request.COOKIES.get(
        #         "citizen_access_token"
        #     )
        
        
        if path.startswith("/api/admin/"):
            raw_token = request.COOKIES.get("admin_access_token")

        elif path.startswith("/api/ward/"):
            raw_token = request.COOKIES.get("ward_access_token")

        elif path.startswith("/api/panchayath/"):
            raw_token = request.COOKIES.get("panchayath_access_token")

        elif path.startswith("/api/citizen/"):
            raw_token = request.COOKIES.get("citizen_access_token")

        else:
            raw_token = (
                request.COOKIES.get("admin_access_token")
                or request.COOKIES.get("ward_access_token")
                or request.COOKIES.get("panchayath_access_token")
                or request.COOKIES.get("citizen_access_token")
            )

        if not raw_token:
            return None

        try:

            validated_token = (
                self.get_validated_token(
                    raw_token
                )
            )

            return (
                self.get_user(
                    validated_token
                ),
                validated_token
            )

        except Exception:

            return None