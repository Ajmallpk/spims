# def validate_image(file, field_name):
#     allowed_types = ["image/jpeg", "image/png", "image/jpg"]
#     max_size = 5 * 1024 * 1024  # 5MB

#     if not file:
#         return None

#     if file.content_type not in allowed_types:
#         return Response(
#             {"error": f"{field_name} must be JPG or PNG"},
#             status=400
#         )

#     if file.size > max_size:
#         return Response(
#             {"error": f"{field_name} must be smaller than 5MB"},
#             status=400
#         )

#     return None