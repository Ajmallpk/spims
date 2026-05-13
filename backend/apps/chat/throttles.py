from rest_framework.throttling import UserRateThrottle


class ChatMessageThrottle(UserRateThrottle):

    scope = "chat_message"
    
    
    
class ChatUploadThrottle(UserRateThrottle):

    scope = "chat_upload"