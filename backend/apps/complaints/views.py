from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Complaint,ComplaintUpvote,ComplaintComment,ComplaintHistory,ComplaintMedia,ResolutionMedia
from .serializers import ComplaintCreateSerializer,ComplaintDetailSerializer,NotificationSerializer,UpdateComplaintStatusSerializer
from rest_framework.generics import ListAPIView
from apps.ward.models import WardVerification
from .serializers import ComplaintFeedSerializer,ComplaintCommentSerializer,ComplaintResolutionSerializer,ComplaintUpdateSerializer
from django.db.models import Count
from .pagination import ComplaintFeedPagination,CommentPagination
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from apps.citizen.models import CitizenVerification
import mimetypes
from .utils import error_response,success_response
import logging
from apps.notification.utils import send_notification

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.functions import Random

from apps.notification.models import Notification
import re
from apps.accounts.models import (
    Ward,
    District,
    Panchayath,
    User,
)

from apps.ward.models import WardVerification
from apps.panchayath.models import PanchayathVerification


User = get_user_model()

logger = logging.getLogger(__name__)


class CitizenCreateComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            if user.role != "CITIZEN":
                return error_response(
                    message="Only citizens can create complaints",
                    status=403
                )

            verification = CitizenVerification.objects.filter(
                user=user,
                status="APPROVED"
            ).exists()

            if not verification:
                return error_response(
                    message="Complete verification before posting complaints",
                    status=403
                )

            serializer = ComplaintCreateSerializer(data=request.data)
            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            selected_ward = serializer.validated_data["ward"]

            ward_verification = WardVerification.objects.filter(
                ward_master=selected_ward,
                status="APPROVED"
            ).first()

            if not ward_verification:
                return error_response(
                    message="No verified ward officer for this ward.",
                    status=400
                )

            ward_officer = ward_verification.user

            complaint = serializer.save(
                citizen=user,
                ward=selected_ward,
                assigned_ward_officer=ward_officer,
                panchayath=ward_verification.panchayath
            )
                        
            
            

            files = request.FILES.getlist("media_files")

            for file in files:
                if file.size > 5 * 1024 * 1024:
                    continue 

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
            
            
            send_notification(
                user=ward_officer,
                title="New Complaint",
                message=f"A new complaint has been submitted: {complaint.title}",
                n_type="NEW_COMPLAINT",
                complaint=complaint,
                sender=user,
                
            )

            logger.info(f"Citizen {user.id} created complaint {complaint.id}")

            return success_response(
                message="Complaint created successfully",
                status=201
            )

        except Exception as e:
            logger.error(f"CreateComplaint error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    
    
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
        upvotes_count=Count("upvotes",distinct=True),
        comments_count=Count("comments",distinct=True)
    ).order_by("-created_at")
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        
        category = self.request.query_params.get("category")
        ward = self.request.query_params.get("ward")
        panchayath = self.request.query_params.get("panchayath")
        sort = self.request.query_params.get("sort")
        
        if category:
            queryset = queryset.filter(category=category)
            
        if ward:
            queryset = queryset.filter(ward_id=ward)
            
        if panchayath:
            queryset = queryset.filter(panchayath_id=panchayath)
            
            
        if sort == "oldest":
            queryset = queryset.order_by("created_at")
            
        if sort == "most_upvoted":
            queryset = queryset.order_by("-upvotes_count")
            
        else:
            queryset = queryset.order_by("-created_at")
            
        return queryset
    
    
    
class ComplaintUpvoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        try:
            user = request.user
            if user.role != "CITIZEN":
                return error_response(
                    message="Only citizens can upvote complaints",
                    status=403
                )
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )
            upvote, created = ComplaintUpvote.objects.get_or_create(
                complaint=complaint,
                user=user
            )

            if not created:
                upvote.delete()

                logger.info(f"Citizen {user.id} removed upvote from {complaint.id}")

                return success_response(
                    message="Upvote removed",
                    data={
                        "upvotes_count": complaint.upvotes.count(),
                        "is_upvoted": False
                    }
                )
                
                

            if complaint.citizen != user:
                send_notification(
                    user=complaint.citizen,
                    title="New Upvote",
                    message="Someone upvoted your complaint",
                    n_type="UPVOTE",
                    complaint=complaint,
                    sender=user
                )

            logger.info(f"Citizen {user.id} upvoted complaint {complaint.id}")

            return success_response(
                message="Complaint upvoted",
                status=201,
                data={
                    "upvotes_count": complaint.upvotes.count(),
                    "is_upvoted": True
                }
            )

        except Exception as e:
            logger.error(f"Upvote error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
        
        
        
class ComplaintCommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        try:
            user = request.user
            if user.role != "CITIZEN":
                return error_response(
                    message="Only citizens can comment",
                    status=403
                )

            comment_text = request.data.get("comment", "").strip()
            parent_id = request.data.get("parent")
            parent_comment = None
            
            if parent_id:
                parent_comment = ComplaintComment.objects.filter(id=parent_id).first()

            if not comment_text:
                return error_response(
                    message="Comment cannot be empty",
                    status=400
                )

            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            comment = ComplaintComment.objects.create(
                complaint=complaint,
                user=user,
                comment=comment_text,
                parent = parent_comment
            )
            
            
            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                f"comments_{complaint.id}",
                {
                    "type": "send_comment",

                    "id": comment.id,
                    "comment": comment.comment,
                    "user_name": user.username,
                    "user_id": user.id,
                    "created_at": str(comment.created_at),

                    "parent_id": (
                        parent_comment.id
                        if parent_comment
                        else None
                    )

                }
            )
            
            
            mentions = re.findall(r'@(\w+)', comment_text)

            for username in mentions:

                mentioned_user = User.objects.filter(
                    username=username
                ).first()

                if mentioned_user and mentioned_user != user:

                    send_notification(
                        user=mentioned_user,
                        title="Mentioned in Comment",
                        message=f"{user.username} mentioned you in a comment",
                        n_type="COMMENT",
                        complaint=complaint,
                        sender=user
                    )

            if complaint.citizen != request.user:
                send_notification(
                    user=complaint.citizen,
                    title="New Comment",
                    message="New commented on your complaint",
                    n_type="COMMENT",
                    complaint=complaint,
                    sender=request.user
                )
                
            if parent_comment and parent_comment.user != user:
                send_notification(
                    user=parent_comment.user,
                    title="New Reply",
                    message=f"{user.username} replied to your comment",
                    n_type="COMMENT",
                    complaint=complaint,
                    sender=user
                )

            logger.info(f"Citizen {user.id} commented on complaint {complaint.id}")

            serializer = ComplaintCommentSerializer(comment)

            return success_response(
                message="Comment added successfully",
                data=serializer.data,
                status=201
            )

        except Exception as e:
            logger.error(f"CommentCreate error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
class ComplaintCommentListView(ListAPIView):

    serializer_class = ComplaintCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination

    def get_queryset(self):

        complaint_id = self.kwargs["complaint_id"]

        return ComplaintComment.objects.filter(
            complaint_id=complaint_id,
            parent__isnull=True  
        ).select_related("user").prefetch_related("replies").order_by("-created_at")
        
          
    
    
class ComplaintResolutionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, complaint_id):
        try:
            user = request.user
            if user.role not in ["WARD", "PANCHAYATH"]:
                return error_response(
                    message="Only authorities can resolve complaints",
                    status=403
                )

            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            if hasattr(complaint, "resolution"):
                return error_response(
                    message="Complaint already resolved",
                    status=400
                )

            serializer = ComplaintResolutionSerializer(data=request.data)

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            resolution = serializer.save(
                complaint=complaint,
                authority=user
            )

            files = request.FILES.getlist("media_files")

            for file in files:
                if file.size > 5 * 1024 * 1024:
                    continue

                mime_type, _ = mimetypes.guess_type(file.name)

                if mime_type and mime_type.startswith("video"):
                    file_type = "VIDEO"
                else:
                    file_type = "IMAGE"

                ResolutionMedia.objects.create(
                    resolution=resolution,
                    file=file,
                    file_type=file_type
                )

            complaint.status = "RESOLVED"
            complaint.save()
            
            
            ComplaintHistory.objects.create(
                complaint=complaint,
                action="RESOLVED",
                performed_by=user,
                note="Complaint resolved"
            )

            send_notification(
                user=complaint.citizen,
                title="Complaint Resolved",
                message="Your complaint has been resolved.",
                n_type="RESOLUTION",
                complaint=complaint,
                sender=user,
            )

            logger.info(f"Complaint {complaint.id} resolved by user {user.id}")

            return success_response(
                message="Complaint resolved successfully",
                data=ComplaintResolutionSerializer(resolution).data,
                status=201
            )

        except Exception as e:
            logger.error(f"Resolution error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
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
            ).filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            user = request.user

            # if user not in [complaint.citizen, complaint.ward, complaint.panchayath]:
            #     return error_response(
            #         message="You are not allowed to view this complaint",
            #         status=403
            #     )

            serializer = ComplaintDetailSerializer(complaint)

            logger.info(f"User {user.id} viewed complaint {complaint.id}")

            return success_response(
                message="Complaint details fetched",
                data=serializer.data
            )

        except Exception as e:
            logger.error(f"ComplaintDetail error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    

        
        
        
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
            upvotes_count=Count("upvotes",distinct=True),
            comments_count=Count("comments",distinct=True)
        ).order_by("-created_at")
        
   
   

class UpdateComplaintStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, complaint_id):
        try:
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            old_status = complaint.status

            serializer = UpdateComplaintStatusSerializer(
                complaint,
                data=request.data,
                partial=True,
                context={"request": request}
            )

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            serializer.save()

            new_status = serializer.data.get("status")

            Notification.objects.create(
                user=complaint.citizen,
                complaint=complaint,
                message=f"Your complaint status updated to {new_status}",
                notification_type="RESOLUTION"
            )

            # ComplaintHistory.objects.create(
            #     complaint=complaint,
            #     action="STATUS_UPDATED",
            #     performed_by=request.user,
            #     note=f"{old_status} → {complaint.status}"
            # )

            logger.info(f"Complaint {complaint.id} status changed to {new_status} by {request.user.id}")

            return success_response(
                message=f"Status updated to {new_status}"
            )

        except Exception as e:
            logger.error(f"UpdateStatus error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )



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

    def patch(self, request, complaint_id):
        try:
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            if request.user != complaint.citizen:
                return error_response(
                    message="Permission denied",
                    status=403
                )

            serializer = ComplaintUpdateSerializer(
                complaint,
                data=request.data,
                partial=True
            )

            if not serializer.is_valid():
                return error_response(
                    message="Validation failed",
                    errors=serializer.errors,
                    status=400
                )

            serializer.save()

            files = request.FILES.getlist("media_files")

            if files:
                # complaint.media.all().delete()
                for media in complaint.media.all():
                    media.file.delete(save=False)
                    media.delete()
                    
                for file in files:
                    if file.size > 5 * 1024 * 1024:
                        continue

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
                action="UPDATED",
                performed_by=request.user,
                note="Complaint updated"
            )
            
            send_notification(
                user=complaint.assigned_ward_officer,
                title="Complaint Updated",
                message=f"{request.user.username} updated a complaint.",
                n_type="COMPLAINT_STATUS",
                complaint=complaint,
                sender=request.user,
            )

            logger.info(f"Complaint {complaint.id} updated by {request.user.id}")

            return success_response(
                message="Complaint updated successfully"
            )

        except Exception as e:
            logger.error(f"UpdateComplaint error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
    
    
    
    


class DeleteComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, complaint_id):
        try:
            complaint = Complaint.objects.filter(id=complaint_id).first()

            if not complaint:
                return error_response(
                    message="Complaint not found",
                    status=404
                )

            if request.user != complaint.citizen:
                return error_response(
                    message="Permission denied",
                    status=403
                )

            if complaint.status != "PENDING":
                return error_response(
                    message="Cannot delete after processing started",
                    status=400
                )

            ComplaintHistory.objects.create(
                complaint=complaint,
                action="DELETED",
                performed_by=request.user,
                note="Complaint deleted"
            )
            
            
            if complaint.image_proof:
                complaint.image_proof.delete(save=False)

            if complaint.video_proof:
                complaint.video_proof.delete(save=False)

            for media in complaint.media.all():

                if media.file:
                    media.file.delete(save=False)

            for resolution_media in ResolutionMedia.objects.filter(
                resolution__complaint=complaint
            ):

                if resolution_media.file:
                    resolution_media.file.delete(save=False)
                    

            complaint.delete()

            logger.info(f"Complaint {complaint.id} deleted by {request.user.id}")

            return success_response(
                message="Deleted successfully"
            )

        except Exception as e:
            logger.error(f"DeleteComplaint error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            )
 
 
 
 
class DeleteCommentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self,request,comment_id):
        try:
            comment = ComplaintComment.objects.filter(id=comment_id).first()
            
            if not comment:
                return error_response(
                    message="Comment not found",
                    status=404
                )   
                
            if request.user != comment.user:
                return error_response(
                    message="Permission denied",
                    status=403
                )
                
                
            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"comments_{comment.complaint.id}",
                {
                    "type":"delete_comment",
                    "id":comment.id
                }
            )
                
                
            comment.delete()
            
            
            return success_response(
                message="Comment deleted successfully"
            )
            
        except Exception as e:
            logger.error(f"Deletecomment error:{str(e)}")
            
            return error_response(
                message="Something went wrong",
                status=500
            )
    
   
   
   
class EditCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, comment_id):
        try:
            comment = ComplaintComment.objects.filter(
                id=comment_id
            ).first()

            if not comment:
                return error_response(
                    message="Comment not found",
                    status=404
                )

            if request.user != comment.user:
                return error_response(
                    message="Permission denied",
                    status=403
                )

            new_comment = request.data.get("comment", "").strip()

            if not new_comment:
                return error_response(
                    message="Comment cannot be empty",
                    status=400
                )

            comment.comment = new_comment
            comment.save()
            
            channel_layer = get_channel_layer()

            async_to_sync(
                channel_layer.group_send
            )(
                f"comments_{comment.complaint.id}",
                {
                    "type": "edit_comment",

                    "id": comment.id,

                    "comment": comment.comment
                }
            )

            serializer = ComplaintCommentSerializer(comment)

            return success_response(
                message="Comment updated successfully",
                data=serializer.data
            )

        except Exception as e:
            logger.error(f"EditComment error: {str(e)}")

            return error_response(
                message="Something went wrong",
                status=500
            ) 
            
            
            
class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        query = request.GET.get("q", "")

        users = User.objects.filter(
            username__icontains=query
        )[:5]

        data = [
            {
                "id": user.id,
                "username": user.username,
            }
            for user in users
        ]

        return Response(data)
    
    
    

class ExploreComplaintView(ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintFeedSerializer
    pagination_class = ComplaintFeedPagination

    def get_queryset(self):

        queryset = (
            Complaint.objects
            .select_related(
                "citizen",
                "ward",
                "panchayath",
                "resolution"
            )
            .prefetch_related(
                "media",
                "resolution__media"
            )
            .annotate(
                upvotes_count=Count("upvotes", distinct=True),
                comments_count=Count("comments", distinct=True)
            )
        )

        search = self.request.query_params.get("search")
        ward = self.request.query_params.get("ward")
        panchayath = self.request.query_params.get("panchayath")
        category = self.request.query_params.get("category")
        status = self.request.query_params.get("status")
        district = self.request.query_params.get("district")

        if search:
            queryset = queryset.filter(
                citizen__username__icontains=search
            )

        if ward:
            queryset = queryset.filter(
                ward_id=ward
            )

        if panchayath:
            queryset = queryset.filter(
                ward__panchayath_id=panchayath
            )
            
            
        if district:
            queryset = queryset.filter(
                ward__panchayath__district_id=district
            )

        if category:
            queryset = queryset.filter(
                category=category
            )

        if status:
            queryset = queryset.filter(
                status=status
            )

        
        if not any([search, district,ward, panchayath, category, status]):
            queryset = queryset.order_by(Random())

        return queryset
    
    
    def get(self, request, *args, **kwargs):

        response = super().get(request, *args, **kwargs)

        district = request.query_params.get("district")
        panchayath = request.query_params.get("panchayath")
        ward = request.query_params.get("ward")

        authority = {
            "ward_available": True,
            "panchayath_available": True,
        }

        if ward:

            authority["ward_available"] = WardVerification.objects.filter(
                ward_master_id=ward,
                status="APPROVED"
            ).exists()

        if panchayath:

            authority["panchayath_available"] = (
                PanchayathVerification.objects.filter(
                    panchayath_master_id=panchayath,
                    status="APPROVED"
                ).exists()
            )

        if district:

            authority["district_has_ward"] = WardVerification.objects.filter(
                district_id=district,
                status="APPROVED"
            ).exists()

            authority["district_has_panchayath"] = (
                PanchayathVerification.objects.filter(
                    district_master_id=district,
                    status="APPROVED"
                ).exists()
            )

        response.data["authority"] = authority

        return response
    

class ExploreFilterDataView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        districts = District.objects.all().values(
            "id",
            "name"
        )

        panchayaths = Panchayath.objects.select_related(
            "district"
        ).values(
            "id",
            "name",
            "district_id",
        )

        wards = Ward.objects.select_related(
            "panchayath"
        ).values(
            "id",
            "ward_number",
            "ward_name",
            "panchayath_id",
        )

        return Response({

            "districts": list(districts),

            "panchayaths": list(panchayaths),

            "wards": list(wards),

        })