from django.http import JsonResponse



class BlockSuspendedUserMiddleware:
    def __init__(self,get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        user = request.user
        
        if user.is_authenticated:
            if hasattr(user,"status") and user.status == "SUSPENDED":
                return JsonResponse(
                    {
                        "error": "ACCOUNT_SUSPENDED",
                        "message": "Your account has been suspended by the administrator."
                    },
                    status=403
                )
        return self.get_response(request)
        