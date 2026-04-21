from rest_framework.response import Response

def success_response(message="", data=None, status=200):
    return Response({
        "success": True,
        "message": message,
        "data": data or {}
    }, status=status)


def error_response(message="", errors=None, status=400):
    return Response({
        "success": False,
        "message": message,
        "errors": errors or {}
    }, status=status)