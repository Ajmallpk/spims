from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.complaints.models import Complaint
from django.shortcuts import get_object_or_404
from .models import Chat,Message
from apps.notification.utils import send_notification
from .utils import success_response,error_response
from .serializers import MessageSerializer,ChatListSerializer
from rest_framework.generics import ListAPIView
from apps.notification.models import Notification
import logging
from django.db.models import (
    Q,
    Count,
    Prefetch
)
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser,FormParser
import mimetypes
from .permissions import (
    can_access_complaint_chat,
    can_access_authority_chat,
    can_start_authority_chat,
    can_start_complaint_chat,
)
from .file_validations import validate_chat_file
from .pagination import ChatMessagePagination
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now
from .throttles import ChatMessageThrottle,ChatUploadThrottle
from django.utils.timezone import now
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.generics import ListAPIView
from .tasks import generate_thumbnail_task
# Create your views here.


User = get_user_model()
logger = logging.getLogger(__name__)



class StartComplaintChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request,complaint_id):
        try:
            user = request.user 
            
            if user.role not in ["WARD","PANCHAYATH"]:
                return error_response(
                    message="Only authority can start chat",
                    status=403
                )
                
            complaint = Complaint.objects.filter(id=complaint_id).first()
            
            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )
                
            if not can_start_complaint_chat(user, complaint):

                return error_response(
                    message="This complaint is not assigned to you",
                    status=403
                )

            chat , created = Chat.objects.get_or_create(
                complaint = complaint,
                defaults={
                    "chat_type":"COMPLAINT",
                    "citizen":complaint.citizen,
                    "authority":user
                }
            )
            
            if not created:
                chat.is_closed = False 
                chat.save()
                
            send_notification(
                user = complaint.citizen,
                title="Chat started",
                message=f"{user.username} started a chat for your complaint",
                n_type="CHAT",
                complaint=complaint,
                sender=user
            )
            
            logger.info(f"{user.role} {user.id} started chat for complaint{complaint.id}")
            
            return success_response(
                message="Chat started successfully"
            )
            
        except Exception as e:
            logger.error(f"StartComplaintChat error:{str(e)}")
            
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
class DeleteMessageView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, message_id):

        try:

            user = request.user

            message = Message.objects.filter(
                id=message_id
            ).first()

            if not message:

                return error_response(
                    message="Message not found",
                    status=404
                )

            if message.sender != user:

                return error_response(
                    message="You can delete only your messages",
                    status=403
                )

            if message.is_deleted:

                return error_response(
                    message="Message already deleted",
                    status=400
                )

            message.is_deleted = True

            message.deleted_at = now()

            message.save(
                update_fields=[
                    "is_deleted",
                    "deleted_at"
                ]
            )
            
            
            channel_layer = get_channel_layer()

            if message.chat.chat_type == "COMPLAINT":

                group_name = (
                    f"complaint_chat_{message.chat.complaint.id}"
                )

            else:

                group_name = (
                    f"authority_chat_{message.chat.id}"
                )

            async_to_sync(
                channel_layer.group_send
            )(
                group_name,
                {
                    "type": "message_deleted",
                    "event_type": "message_deleted",
                    "message_id": message.id
                }
            )

            return success_response(
                message="Message deleted successfully"
            )

        except Exception as e:

            logger.error(
                f"DeleteMessageView error: {str(e)}"
            )

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
class ForwardMessageView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            user = request.user

            message_id = request.data.get(
                "message_id"
            )

            target_chat_id = request.data.get(
                "target_chat_id"
            )

            if not message_id or not target_chat_id:

                return error_response(
                    message="message_id and target_chat_id are required",
                    status=400
                )

            original_message = Message.objects.filter(
                id=message_id,
                is_deleted=False
            ).first()

            if not original_message:

                return error_response(
                    message="Original message not found",
                    status=404
                )

            target_chat = Chat.objects.filter(
                id=target_chat_id
            ).first()

            if not target_chat:

                return error_response(
                    message="Target chat not found",
                    status=404
                )

            has_access = False

            if target_chat.chat_type == "COMPLAINT":

                has_access = can_access_complaint_chat(
                    user,
                    target_chat
                )

            elif target_chat.chat_type == "AUTHORITY":

                has_access = can_access_authority_chat(
                    user,
                    target_chat
                )

            if not has_access:

                return error_response(
                    message="You are not allowed to forward to this chat",
                    status=403
                )

            forwarded_message = Message.objects.create(
                chat=target_chat,
                sender=user,
                message=original_message.message,
                file=original_message.file,
                file_type=original_message.file_type,
                reply_to=original_message.reply_to,
                is_forwarded=True,
                forwarded_from=original_message.sender
            )

            serializer = MessageSerializer(
                forwarded_message,
                context={"request": request}
            )
            
            
            channel_layer = get_channel_layer()

            if target_chat.chat_type == "COMPLAINT":

                group_name = (
                    f"complaint_chat_{target_chat.complaint.id}"
                )

            else:

                group_name = (
                    f"authority_chat_{target_chat.id}"
                )

            async_to_sync(
                channel_layer.group_send
            )(
                group_name,
                {
                    "type": "chat_message",
                    "event_type": "message",
                    "message_data": serializer.data
                }
            )

            return success_response(
                message="Message forwarded successfully",
                data=serializer.data,
                status=201
            )


        except Exception as e:

            logger.error(
                f"ForwardMessageView error: {str(e)}"
            )

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
            

class SearchMessagesView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    pagination_class = ChatMessagePagination


    def get_queryset(self):

        try:

            user = self.request.user

            query = self.request.query_params.get(
                "q",
                ""
            ).strip()

            complaint_id = self.kwargs.get(
                "complaint_id"
            )

            if not query:

                return Message.objects.none()

            complaint = Complaint.objects.filter(
                id=complaint_id
            ).first()

            if not complaint:
                return Message.objects.none()

            chat = Chat.objects.filter(
                complaint=complaint,
                chat_type="COMPLAINT"
            ).first()

            if not chat:
                return Message.objects.none()

            if not can_access_complaint_chat(
                user,
                chat
            ):
                return Message.objects.none()

            return Message.objects.filter(
                chat=chat,
                is_deleted=False,
            ).filter(
                Q(message__icontains=query) |
                Q(sender__username__icontains=query) |
                Q(reply_to__message__icontains=query) |
                Q(file__icontains=query) |
                Q(file_type__icontains=query)
            ).select_related(
                "sender",
                "reply_to",
                "reply_to__sender"
            ).order_by("-created_at")

        except Exception as e:

            logger.error(
                f"SearchMessagesView error: {str(e)}"
            )

            return Message.objects.none()
            
            
            
            
class SearchAuthorityMessagesView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    pagination_class = ChatMessagePagination

    def get_queryset(self):

        try:

            user = self.request.user

            query = self.request.query_params.get(
                "q",
                ""
            ).strip()

            chat_id = self.kwargs.get("chat_id")

            if not query:
                return Message.objects.none()

            chat = Chat.objects.filter(
                id=chat_id,
                chat_type="AUTHORITY"
            ).first()

            if not chat:
                return Message.objects.none()

            if not can_access_authority_chat(
                user,
                chat
            ):
                return Message.objects.none()

            return Message.objects.filter(
                chat=chat,
                is_deleted=False,
            ).filter(
                Q(message__icontains=query) |
                Q(sender__username__icontains=query) |
                Q(reply_to__message__icontains=query) |
                Q(file__icontains=query) |
                Q(file_type__icontains=query)
            ).select_related(
                "sender",
                "reply_to",
                "reply_to__sender"
            ).order_by("-created_at")

        except Exception as e:

            logger.error(
                f"SearchAuthorityMessagesView error: {str(e)}"
            )

            return Message.objects.none()
            
            
            
            
class SendMessageview(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ChatMessageThrottle]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self,request,complaint_id):
        try:
            user = request.user
            message_text = request.data.get("message", "").strip()
            reply_to_id = request.data.get("reply_to")
            uploaded_file = request.FILES.get("file")
            voice_duration = request.data.get(
                "voice_duration"
            )
            
            
            if uploaded_file:

                throttle = ChatUploadThrottle()

                if throttle.allow_request(request, self):

                    pass

                else:

                    return error_response(
                        message="Too many file uploads. Please try again later.",
                        status=429
                    )
            
            if not message_text and not uploaded_file:
                return error_response(
                    message="Message or file is required",
                    status=400
                )
                
            if uploaded_file:

                is_valid, error_message = validate_chat_file(
                    uploaded_file
                )

                if not is_valid:

                    return error_response(
                        message=error_message,
                        status=400
                    )
                
            complaint = Complaint.objects.filter(id=complaint_id).first()
            
            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )
                
            chat = Chat.objects.filter(
                complaint = complaint,
                chat_type = "COMPLAINT",
                
            ).first()
            
            if not chat:
                return error_response(
                    message="Chat not started by authority",
                    status=403
                )
                
            if chat.is_closed:
                return error_response(
                    message="Chat closed by authority",
                    status=400
                )
                 
            if user.role == "CITIZEN":
                first_message_exists = Message.objects.filter(chat=chat).exists()
                
                if not first_message_exists:
                    return error_response(
                        message="Wait for authority to start the conversation",
                        status=403
                    )
                          
            file_type = None

            if uploaded_file:

                mime_type, _ = mimetypes.guess_type(
                    uploaded_file.name
                )

                if mime_type:

                    if mime_type.startswith("image"):
                        file_type = "IMAGE"

                    elif mime_type.startswith("video"):
                        file_type = "VIDEO"

                    elif mime_type.startswith("audio"):
                        file_type = "VOICE"

                    elif mime_type == "application/pdf":
                        file_type = "PDF"

                    else:
                        file_type = "FILE"
                        
                        
            reply_message = None

            if reply_to_id:

                reply_message = Message.objects.filter(
                    id=reply_to_id,
                    chat=chat
                ).first()

            message = Message.objects.create(
                chat=chat,
                sender=user,
                message=message_text,
                file=uploaded_file,
                file_type=file_type,
                voice_duration=voice_duration,
                reply_to=reply_message,
                
            )
            
                
            logger.info(f"User {user.id} send message in chat {chat.id}")
            
            serializer = MessageSerializer(
                message,
                context={"request": request}
            )
            
            
            if message.file_type == "IMAGE":

                generate_thumbnail_task.delay(
                    message.id
                )

            return success_response(
                message="Message sent successfully",
                data=serializer.data,
                status=201
            )
        except Exception as e:
            logger.error(f"SendMessage error:{str(e)}")
            
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
class ToggleChatStatusView(APIView):
    permission_classes  = [IsAuthenticated]
    
    def post(self,request,complaint_id):
        try:
            user = request.user
            if user.role not in ["WARD","PANCHAYATH"]:
                return error_response(
                    message="Only authority can control chat ",
                    status=403
                )
                
            complaint = Complaint.objects.filter(id=complaint_id).first()
            
            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )
                
            chat = Chat.objects.filter(
                complaint = complaint,
                chat_type = "COMPLAINT",
            ).first()
            
            if not chat:
                return error_response(
                    message="Chat not started yet",
                    status=400
                )
            
            if chat.authority != user:
                return error_response(
                    message="Youre not allowed to control this chat",
                    status=403
                )
                
                
            chat.is_closed = not chat.is_closed
            chat.save()
            
            if chat.is_closed:
                send_notification(
                    user=chat.citizen,
                    title="Chat closed",
                    message="Authority closed the chat for your complaint",
                    n_type="CHAT",
                    complaint=complaint,
                    sender=user
                )
                
                logger.info(f"Chat {chat.id} closed by {user.id}")
                
                return success_response(
                    message="Chat closed succesfully"
                )

            else:
                send_notification(
                    user=chat.citizen,
                    title="Chat Reopened",
                    message="Authority Reopened the chat",
                    n_type="CHAT",
                    complaint=complaint,
                    sender=user
                )
                
                logger.info(f"Chat {chat.id} reopened by {user.id}")
                return success_response(
                    message="Chat reopened successfully"
                )
        except Exception as e:
            logger.error(f"ToggleChatStatus error: {str(e)}")
            
            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
class ChatMessageListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    pagination_class = ChatMessagePagination
    
    def get_queryset(self):
        try:
            user = self.request.user
            Complaint_id = self.kwargs.get("complaint_id")
            
            complaint = Complaint.objects.filter(id=Complaint_id).first()
            
            if not complaint:
                return Message.objects.none()
            
            chat = Chat.objects.filter(
                complaint=complaint,
                chat_type = "COMPLAINT",
                
            ).first()
            
            if not chat:
                return Message.objects.none()
            
            if not can_access_complaint_chat(user, chat):
                return Message.objects.none()
            
            unread_messages = Message.objects.filter(
                chat=chat,
                is_read=False
            ).exclude(
                sender=user
            )

            message_ids = list(
                unread_messages.values_list(
                    "id",
                    flat=True
                )
            )

            unread_messages.update(
                is_read=True,
                read_at=now()
            )
            
            channel_layer = get_channel_layer()

            for message_id in message_ids:

                async_to_sync(
                    channel_layer.group_send
                )(
                    f"complaint_chat_{complaint.id}",
                    {
                        "type": "seen_update",
                        "event_type": "seen_update",
                        "message_id": message_id
                    }
                )
            
            return Message.objects.filter(
                chat = chat
            ).select_related("sender","reply_to","reply_to__sender").order_by("-created_at")
            
        except Exception as e:
            logger.error(f"ChatMessageList error :{str(e)}")
            return Message.objects.none()
    
    
    
class ChatInboxView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ChatListSerializer


    def get_queryset(self):

        try:
            user = self.request.user

            if user.role == "CITIZEN":

                return Chat.objects.filter(
                    citizen=user,
                    chat_type="COMPLAINT"
                ).annotate(
                    unread_count=Count(
                        "messages",
                        filter=Q(
                            messages__is_read=False
                        ) & ~Q(
                            messages__sender=user
                        )
                    )
                ).select_related(
                    "complaint",
                    "authority"
                ).prefetch_related(
                    Prefetch(
                        "messages",
                        queryset=Message.objects.select_related(
                            "sender"
                        ).only(
                            "id",
                            "message",
                            "created_at",
                            "sender__username"
                        ).order_by("-created_at")[:1],
                        to_attr="latest_message"
                    )
                )


            elif user.role in ["WARD", "PANCHAYATH"]:

                return Chat.objects.filter(
                    authority=user,
                    chat_type="COMPLAINT",
                ).annotate(
                    unread_count=Count(
                        "messages",
                        filter=Q(
                            messages__is_read=False
                        ) & ~Q(
                            messages__sender=user
                        )
                    )
                ).select_related(
                    "complaint",
                    "citizen"
                ).prefetch_related(
                    Prefetch(
                        "messages",
                        queryset=Message.objects.select_related(
                            "sender"
                        ).order_by("-created_at")
                    )
                ).order_by("-created_at")

            return Chat.objects.none()

        except Exception as e:

            logger.error(f"ChatInboxView error: {str(e)}")

            return Chat.objects.none()
        
        
        
        
class AuthorityInboxView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ChatListSerializer
    

    def get_queryset(self):

        try:
            user = self.request.user

            if user.role not in ["WARD", "PANCHAYATH"]:
                return Chat.objects.none()

            return Chat.objects.filter(
                chat_type="AUTHORITY"
            ).filter(
                Q(sender_authority=user) |
                Q(receiver_authority=user)
            ).annotate(
                unread_count=Count(
                    "messages",
                    filter=Q(
                        messages__is_read=False
                    ) & ~Q(
                        messages__sender=user
                    )
                )
                ).select_related(
                    "sender_authority",
                    "receiver_authority"
                ).prefetch_related(
                    Prefetch(
                        "messages",
                        queryset=Message.objects.select_related(
                            "sender"
                        ).only(
                            "id",
                            "message",
                            "created_at",
                            "sender__username"
                        ).order_by("-created_at")[:1],
                        to_attr="latest_message"
                    )
                )

        except Exception as e:

            logger.error(f"AuthorityInboxView error: {str(e)}")

            return Chat.objects.none()
        
        
        
class AuthorityMessageListView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    pagination_class = ChatMessagePagination

    def get_queryset(self):

        try:
            user = self.request.user

            chat_id = self.kwargs.get("chat_id")

            chat = Chat.objects.filter(
                id=chat_id,
                chat_type="AUTHORITY"
            ).first()

            if not chat:
                return Message.objects.none()

            if not can_access_authority_chat(user, chat):
                return Message.objects.none()

            unread_messages = Message.objects.filter(
                chat=chat,
                is_read=False
            ).exclude(
                sender=user
            )

            message_ids = list(
                unread_messages.values_list(
                    "id",
                    flat=True
                )
            )

            unread_messages.update(
                is_read=True,
                read_at=now()
            )
            
            
            channel_layer = get_channel_layer()

            for message_id in message_ids:

                async_to_sync(
                    channel_layer.group_send
                )(
                    f"authority_chat_{chat.id}",
                    {
                        "type": "seen_update",
                        "event_type": "seen_update",
                        "message_id": message_id
                    }
                )

            return Message.objects.filter(
                chat=chat
            ).select_related(
                "sender",
                "reply_to",
                "reply_to__sender",
            ).order_by("-created_at")

        except Exception as e:

            logger.error(f"AuthorityMessageList error: {str(e)}")

            return Message.objects.none()
        
        
        
class StartAuthorityChatView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            user = request.user

            receiver_id = request.data.get("receiver_id")

            if not receiver_id:
                return error_response(
                    message="receiver_id is required",
                    status=400
                )

            if user.role not in ["WARD", "PANCHAYATH"]:
                return error_response(
                    message="Only authorities can start chats",
                    status=403
                )

            receiver = User.objects.filter(
                id=receiver_id
            ).first()

            if not receiver:
                return error_response(
                    message="Receiver not found",
                    status=404
                )

            if receiver.role not in ["WARD", "PANCHAYATH"]:
                return error_response(
                    message="Invalid receiver",
                    status=400
                )

            if user == receiver:
                return error_response(
                    message="Cannot chat with yourself",
                    status=400
                )

            if not can_start_authority_chat(user, receiver):

                return error_response(
                    message="You are not allowed to start this chat",
                    status=403
                )

            chat = Chat.objects.filter(
                chat_type="AUTHORITY"
            ).filter(
                Q(
                    sender_authority=user,
                    receiver_authority=receiver
                ) |
                Q(
                    sender_authority=receiver,
                    receiver_authority=user
                )
            ).first()

            if not chat:

                chat = Chat.objects.create(
                    chat_type="AUTHORITY",
                    sender_authority=user,
                    receiver_authority=receiver
                )

            logger.info(
                f"Authority chat started between {user.id} and {receiver.id}"
            )

            return success_response(
                message="Authority chat ready",
                data={
                    "chat_id": chat.id
                }
            )

        except Exception as e:

            logger.error(f"StartAuthorityChat error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
            
class SendAuthorityMessageView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_classes = [ChatMessageThrottle]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, chat_id):

        try:
            user = request.user

            message_text = request.data.get(
                "message",
                ""
            ).strip()

            uploaded_file = request.FILES.get("file")
            
            if uploaded_file:
                throttle = ChatUploadThrottle()
                if throttle.allow_request(request, self):
                    pass
                else:
                    return error_response(
                        message="Too many file uploads. Please try again later.",
                        status=429
                    )

            if not message_text and not uploaded_file:

                return error_response(
                    message="Message or file is required",
                    status=400
                )

            if uploaded_file:

                is_valid, error_message = validate_chat_file(
                    uploaded_file
                )

                if not is_valid:

                    return error_response(
                        message=error_message,
                        status=400
                    )

            chat = Chat.objects.filter(
                id=chat_id,
                chat_type="AUTHORITY"
            ).first()

            if not chat:

                return error_response(
                    message="Chat not found",
                    status=404
                )

            if not can_access_authority_chat(
                user,
                chat
            ):

                return error_response(
                    message="You are not allowed to send messages",
                    status=403
                )

            file_type = None

            if uploaded_file:

                mime_type, _ = mimetypes.guess_type(
                    uploaded_file.name
                )

                if mime_type:

                    if mime_type.startswith("image"):
                        file_type = "IMAGE"

                    elif mime_type.startswith("video"):
                        file_type = "VIDEO"

                    elif mime_type == "application/pdf":
                        file_type = "PDF"

                    else:
                        file_type = "FILE"

            message = Message.objects.create(
                chat=chat,
                sender=user,
                message=message_text,
                file=uploaded_file,
                file_type=file_type
            )

            serializer = MessageSerializer(
                message,
                context={"request": request}
            )
            
            
            if message.file_type == "IMAGE":
                generate_thumbnail_task.delay(
                    message.id
                )
                        
            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"authority_chat_{chat.id}",
                {
                    "type": "chat_message",
                    "event_type": "message",
                    "message_data": serializer.data
                }
            )

            logger.info(
                f"Authority message sent in chat {chat.id}"
            )

            return success_response(
                message="Message sent successfully",
                data=serializer.data,
                status=201
            )

        except Exception as e:

            logger.error(
                f"SendAuthorityMessageView error: {str(e)}"
            )

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            
            
class DeleteAuthorityMessageView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):

        try:

            user = request.user

            message = Message.objects.filter(
                id=message_id
            ).first()

            if not message:

                return error_response(
                    message="Message not found",
                    status=404
                )

            if message.sender != user:

                return error_response(
                    message="You can delete only your messages",
                    status=403
                )

            message.is_deleted = True

            message.deleted_at = now()

            message.message = ""

            message.save()

            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"authority_chat_{message.chat.id}",
                {
                    "type": "message_deleted",
                    "event_type": "message_deleted",
                    "message_id": message.id
                }
            )

            return success_response(
                message="Message deleted"
            )

        except Exception as e:

            logger.error(
                f"DeleteAuthorityMessageView error: {str(e)}"
            )

            return error_response(
                message="Something went wrong",
                status=500
            )
            
            
            

        


     