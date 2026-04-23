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
# Create your views here.



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
                
            if user.role == "WARD" and complaint.ward != user:
                return error_response(
                    message="This complaint is not assigned to you",
                    status=403
                )

            if user.role == "PANCHAYATH" and complaint.panchayath != user:
                return error_response(
                    message="This compalaint is not assigned to you",
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
            
            
            
class SendMessageview(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self,request,complaint_id):
        try:
            user = request.user
            message_text = request.data.get("message","").strip()
            
            if not message_text:
                return error_response(
                    message="Message cannot be empty",
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
                          
            message = Message.objects.create(
                chat=chat,
                sender = user,
                message= message_text
            )
            
            receiver = chat.citizen if user == chat.authority else chat.authority

            send_notification(
                user=receiver,
                title="New Message",
                message=f"{user.username}: {message_text[:30]}",
                n_type="CHAT",
                complaint=complaint,
                sender=user
            )
                
            logger.info(f"User {user.id} send message in chat {chat.id}")
            
            return success_response(
                message="Message send sucessfully",
                data = {
                    "id":message.id,
                    "message":message.message,
                    "sender":user.username,
                    "created_at":message.created_at
                },
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
            
            if user not in [chat.citizen,chat.authority]:
                return Message.objects.none()
            
            return Message.objects.filter(
                chat = chat
            ).select_related("sender").order_by("created_at")
            
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
                    citizen = user,
                    chat_type = "COMPLAINT"
                ).select_related("complaint").prefetch_related("messages").order_by("-created_at")
                
                
            elif user.role in ["WARD","PANCHAYATH"]:
                return Chat.objects.filter(
                    authority = user,
                    chat_type = "COMPLAINT",
                    
                ).select_related("comaplaint").prefetch_related("-created_at")
                
                
            return Chat.objects.none()
        
        except Exception:
            return Chat.objects.none()
        
        


     