from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Complaint,ComplaintUpvote,ComplaintComment,ComplaintChatMessage,ComplaintChat,Notification,ComplaintHistory,ComplaintMedia,ResolutionMedia
from .serializers import ComplaintCreateSerializer,ComplaintDetailSerializer,ComplaintChatListSerializer,NotificationSerializer,UpdateComplaintStatusSerializer
from rest_framework.generics import ListAPIView
from apps.ward.models import WardVerification
from .serializers import ComplaintFeedSerializer,ComplaintCommentSerializer,ComplaintChatMessageSerializer,ComplaintResolutionSerializer,ComplaintUpdateSerializer
from django.db.models import Count
from .pagination import ComplaintFeedPagination
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from apps.citizen.models import CitizenVerification
import mimetypes


User = get_user_model()




class CitizenCreateComplaintView(APIView):

    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        if user.role != "CITIZEN":
            return Response(
                {"error": "Only citizens can create complaints"},
                status=403
            )
        verification = CitizenVerification.objects.filter(
            user=user,
            status="APPROVED"
        ).exists()

        if not verification:
            return Response(
                {"error": "You must complete verification before posting complaints"},
                status=403
            )
        serializer = ComplaintCreateSerializer(data=request.data)
        if serializer.is_valid():
            ward = serializer.validated_data["ward"]
            try:
                ward_verification = WardVerification.objects.get(user=ward)
            except WardVerification.DoesNotExist:
                return Response(
                    {"error": "Selected ward is not verified"},
                    status=400
                )

            panchayath = ward_verification.panchayath

            complaint = serializer.save(
                citizen=user,
                ward=ward,
                panchayath=panchayath
            )
            
            
            files = request.FILES.getlist("media_files")
            
            
            for file in files:
                file_type = "IMAGE"
                
            
                mime_type, _ = mimetypes.guess_type(file.name)

                if mime_type and mime_type.startswith("video"):
                    file_type = "VIDEO"
                else:
                    file_type = "IMAGE"

                ComplaintMedia.objects.create(
                    complaint=complaint,
                    file=file,
                    file_type=file_type
                )
            
            
            ComplaintHistory.objects.create(
                complaint=complaint,
                action="CREATED",
                performed_by=user,
                note="Complaint created"
            )
            
            return Response(
                {"message": "Complaint created successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=400)
    
    
    
    
    
class CitizenComplaintFeedView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintFeedSerializer
    pagination_class = ComplaintFeedPagination

    queryset = Complaint.objects.select_related(
        "citizen",
        "ward",
        "resolution",
    ).prefetch_related(
        "resolution__media"
    ).annotate(
        upvotes_count=Count("upvotes"),
        comments_count=Count("comments")
    ).order_by("-created_at")
    
    
    
class ComplaintUpvoteView(APIView):

    permission_classes = [IsAuthenticated]
    def post(self, request, complaint_id):
        user = request.user
        
        if user.role != "CITIZEN":
            return Response(
                {"error": "Only citizens can upvote complaints"},
                status=403
            )
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response(
                {"error": "Complaint not found"},
                status=404
            )
        upvote, created = ComplaintUpvote.objects.get_or_create(
            complaint=complaint,
            user=user
        )
        
        if created and complaint.citizen != user:
            Notification.objects.create(
                user=complaint.citizen,
                complaint=complaint,
                message="Someone upvoted your complaint",
                notification_type="UPVOTE"
            )
            
        if not created:
            upvote.delete()
            return Response(
                {"message": "Upvote removed"},
                status=200
            )
        return Response(
            {"message": "Complaint upvoted"},
            status=201
        )
        
        
        
class ComplaintCommentCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):

        user = request.user
        if user.role != "CITIZEN":
            return Response(
                {"error": "Only citizens can comment on complaints"},
                status=403
            )

        comment_text = request.data.get("comment")

        if not comment_text:
            return Response(
                {"error": "Comment cannot be empty"},
                status=400
            )

        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response(
                {"error": "Complaint not found"},
                status=404
            )

        comment = ComplaintComment.objects.create(
            complaint=complaint,
            user=user,
            comment=comment_text
        )
        
        if complaint.citizen != user:
            Notification.objects.create(
                user=complaint.citizen,
                complaint=complaint,
                message="Someone commented on your complaint",
                notification_type="COMMENT"
            )

        serializer = ComplaintCommentSerializer(comment)

        return Response(serializer.data, status=201)
    
    
    
class ComplaintCommentListView(ListAPIView):

    serializer_class = ComplaintCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        complaint_id = self.kwargs["complaint_id"]

        return ComplaintComment.objects.filter(
            complaint_id=complaint_id
        ).select_related("user").order_by("-created_at")
        
        
class ComplaintChatMessagesView(ListAPIView):

    serializer_class = ComplaintChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        complaint_id = self.kwargs["complaint_id"]
        user = self.request.user

        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return ComplaintChatMessage.objects.none()

        if user not in [complaint.citizen, complaint.ward, complaint.panchayath]:
            return ComplaintChatMessage.objects.none()

        return ComplaintChatMessage.objects.filter(
            chat__complaint_id=complaint_id
        ).select_related("sender").order_by("created_at")
    
    
    
        
class ComplaintSendMessageView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):

        user = request.user
        message_text = request.data.get("message")

        try:
            chat = ComplaintChat.objects.get(complaint_id=complaint_id)
        except ComplaintChat.DoesNotExist:
            if user.role not in ["WARD", "PANCHAYATH"]:
                return Response(
                    {"error": "Chat not started yet"},
                    status=400
                )
            try:
                complaint = Complaint.objects.get(id=complaint_id)
            except Complaint.DoesNotExist:
                return Response({"error": "Complaint not found"}, status=404)

            chat = ComplaintChat.objects.create(
                complaint=complaint,
                citizen=complaint.citizen,
                authority=user
            )

        complaint = chat.complaint

        if user not in [complaint.citizen, complaint.ward, complaint.panchayath]:
            return Response(
                {"error": "You are not allowed to access this chat"},
                status=403
            )

        if chat.is_closed:
            return Response(
                {"error": "Chat is closed"},
                status=400
            )
        if user.role == "CITIZEN":

            first_message_exists = ComplaintChatMessage.objects.filter(chat=chat).exists()

            if not first_message_exists:
                return Response(
                    {"error": "Citizen cannot start chat. Wait for authority message."},
                    status=403
                )

        message = ComplaintChatMessage.objects.create(
            chat=chat,
            sender=user,
            message=message_text
        )
        
        if user.role in ["WARD", "PANCHAYATH"]:
            Notification.objects.create(
                user=chat.citizen,
                complaint=chat.complaint,
                message="Authority replied to your complaint",
                notification_type="CHAT"
            )

        serializer = ComplaintChatMessageSerializer(message)

        return Response(serializer.data, status=201)
    
    
    
    
    
class ComplaintResolutionCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):

        user = request.user

        if user.role not in ["WARD", "PANCHAYATH"]:
            return Response(
                {"error": "Only authorities can resolve complaints"},
                status=403
            )

        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({"error": "Complaint not found"}, status=404)

        if hasattr(complaint, "resolution"):
            return Response(
                {"error": "Complaint already resolved"},
                status=400
            )

        serializer = ComplaintResolutionSerializer(data=request.data)

        if serializer.is_valid():

            resolution = serializer.save(
                complaint=complaint,
                authority=user
            )
            
            files = request.FILES.getlist("media_files")
            
            for file in files:
                file_type = "IMAGE"
                
                mime_type, _ = mimetypes.guess_type(file.name)
                
                
                if mime_type and mime_type.startswith("video"):
                    file_type = "VIDEO"
                    

                ResolutionMedia.objects.create(
                    resolution = resolution,
                    file = file ,
                    file_type = file_type
                )

            complaint.status = "RESOLVED"
            complaint.save()
            
            Notification.objects.create(
                user=complaint.citizen,
                complaint=complaint,
                message="Your complaint has been resolved",
                notification_type="RESOLUTION"
            )

            return Response(
                ComplaintResolutionSerializer(resolution).data,
                status=201
            )

        return Response(serializer.errors, status=400)
    
    
    
class ComplaintDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, complaint_id):

        try:
            complaint = Complaint.objects.select_related(
                "citizen",
                "ward",
                "panchayath"
            ).prefetch_related(
                "comments",
                "upvotes"
            ).get(id=complaint_id)

            user = request.user

            if user not in [complaint.citizen, complaint.ward, complaint.panchayath]:
                return Response(
                    {"error": "You are not allowed to view this complaint"},
                    status=403
                )

        except Complaint.DoesNotExist:
            return Response(
                {"error": "Complaint not found"},
                status=404
            )

        serializer = ComplaintDetailSerializer(complaint)

        return Response(serializer.data)
    
    
    
    
class CitizenChatInboxView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintChatListSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role != "CITIZEN":
            return ComplaintChat.objects.none()

        return ComplaintChat.objects.filter(
            citizen=user
        ).select_related(
            "complaint",
            "complaint__ward"
        ).prefetch_related(
            "messages"
        ).order_by("-created_at")
        
        
        
class CitizenNotificationListView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role != "CITIZEN":
            return Notification.objects.none()

        return Notification.objects.filter(
            user=user
        ).order_by("-created_at")
        
        


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):

        user = request.user

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=user
            )
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=404
            )

        notification.is_read = True
        notification.save()

        return Response({"message": "Notification marked as read"})
    
    
    

class CitizenMyComplaintsView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintFeedSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role != "CITIZEN":
            return Complaint.objects.none()

        return Complaint.objects.filter(
            citizen=user
        ).select_related(
            "ward"
        ).annotate(
            upvotes_count=Count("upvotes"),
            comments_count=Count("comments")
        ).order_by("-created_at")
        
   
   

class UpdateComplaintStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, complaint_id):

        complaint = get_object_or_404(Complaint, id=complaint_id)
        
        old_status = complaint.status

        serializer = UpdateComplaintStatusSerializer(
            complaint,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        new_status = serializer.data.get("status")

        Notification.objects.create(
            user=complaint.citizen,
            complaint=complaint,
            message=f"Your complaint status updated to {new_status}",
            notification_type="RESOLUTION" 
        )
        
        ComplaintHistory.objects.create(
            complaint=complaint,
            action="STATUS_UPDATED",
            performed_by=request.user,
            note=f"{old_status} → {complaint.status}"
        )

        return Response({
            "message": f"Status updated to {serializer.data['status']}"
            
        })



class ComplaintTimelineView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request,complaint_id):
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({"error":"Not found"},status=404)
        
        history = complaint.history.all().order_by("-created_at")
        
        data = [
            {
                "action":h.action,
                "user":h.performed_by.email if h.performed_by else None,
                "note":h.note,
                "time":h.created_at,
            }
            for h in history
        ]    
        
        return Response(data)



class UpdateComplaintView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def patch(self,request,complaint_id):
        complaint = get_object_or_404(Complaint,id=complaint_id)
        
        if request.user != complaint.citizen:
            return Response({"error":"Permission denied"},status=403)
        
        
        serializer = ComplaintUpdateSerializer(
            complaint,
            data = request.data,
            partial = True
        )
        
        
        if serializer.is_valid():
            serializer.save()
            
            files = request.FILES.getlist("media_files")

            if files:
                
                complaint.media.all().delete()


                for file in files:
                    file_type = "IMAGE"

                    mime_type, _ = mimetypes.guess_type(file.name)

                    if mime_type and mime_type.startswith("video"):
                        file_type = "VIDEO"

                    ComplaintMedia.objects.create(
                        complaint=complaint,
                        file=file,
                        file_type=file_type
                    )
            
            
            ComplaintHistory.objects.create(
                complaint = complaint,
                action = "UPDATED",
                performed_by = request.user,
                note = "Complaint updated"
            )
            
            return Response({"message":"Complaint updated"})
        
        return Response(serializer.errors,status=400)
    
    
    
    


class DeleteComplaintView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self,request,complaint_id):
        complaint = get_object_or_404(Complaint,id=complaint_id)
        
        if request.user != complaint.citizen:
            return Response({"error":"Permission denied"},status=403)
        
        if complaint.status != "PENDING":
            return Response(
                {"error":"Cannot delete after processing started"},
                status=400
            )
            
        ComplaintHistory.objects.create(
            complaint=complaint,
            action = "DELETED",
            performed_by = request.user,
            note = "Complaint deleted",
        )
            
        complaint.delete()
        return Response({"message":"Deleted successfully"})
    
    
    
