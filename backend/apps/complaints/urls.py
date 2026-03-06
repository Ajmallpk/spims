from django.urls import path
from . import views 

urlpatterns = [

    path("citizen/complaints/create/",views.CitizenCreateComplaintView.as_view()),
    path("citizen/complaints/feed/",views.CitizenComplaintFeedView.as_view()),
    path("complaints/<int:complaint_id>/upvote/",views.ComplaintUpvoteView.as_view()),
    path("complaints/<int:complaint_id>/comments/",views.ComplaintCommentListView.as_view()),
    path("complaints/<int:complaint_id>/comment/",views.ComplaintCommentCreateView.as_view()),
    path("complaints/<int:complaint_id>/chat/",views.ComplaintChatMessagesView.as_view()),
    path("complaints/<int:complaint_id>/chat/send/",views.ComplaintSendMessageView.as_view()),
    path("complaints/<int:complaint_id>/resolve/",views.ComplaintResolutionCreateView.as_view()),
    path("complaints/<int:complaint_id>/",views.ComplaintDetailView.as_view()),
    path("citizen/messages/",views.CitizenChatInboxView.as_view()),
    path("citizen/notifications/",views.CitizenNotificationListView.as_view()),
    path("notifications/<int:notification_id>/read/",views.MarkNotificationReadView.as_view()),
]