from django.urls import path

from .views import (
    StartComplaintChatView,
    SendMessageview,
    ToggleChatStatusView,
    ChatMessageListView,
    ChatInboxView,
    DeleteMessageView,

    AuthorityInboxView,
    AuthorityMessageListView,
    StartAuthorityChatView,
    SendAuthorityMessageView,
    DeleteAuthorityMessageView,
)

urlpatterns = [

    # Complaint Chat
    path(
        "complaint/<int:complaint_id>/start/",
        StartComplaintChatView.as_view()
    ),

    path(
        "complaint/<int:complaint_id>/send/",
        SendMessageview.as_view()
    ),

    path(
        "complaint/<int:complaint_id>/toggle/",
        ToggleChatStatusView.as_view()
    ),

    path(
        "complaint/<int:complaint_id>/messages/",
        ChatMessageListView.as_view()
    ),

    path(
        "complaint/inbox/",
        ChatInboxView.as_view()
    ),
    
    
    path(
        "complaint/delete-message/<int:message_id>/",
        DeleteMessageView.as_view(),
    ),


    # Authority Chat
    path(
        "authority/start/",
        StartAuthorityChatView.as_view()
    ),

    path(
        "authority/inbox/",
        AuthorityInboxView.as_view()
    ),

    path(
        "authority/<int:chat_id>/messages/",
        AuthorityMessageListView.as_view()
    ),
    
    path(
        "authority/send-message/<int:chat_id>/",
        SendAuthorityMessageView.as_view(),
        name="send-authority-message"
    ),
    
    path(
        "authority/delete-message/<int:message_id>/",
        DeleteAuthorityMessageView.as_view(),
    ),
]