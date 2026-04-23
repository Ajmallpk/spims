from django.urls import path
from . import views


urlpatterns = [
    path("notifications/", views.NotificationListView.as_view()),
    path("notifications/read/<int:notification_id>/", views.MarkNotificationReadView.as_view()),
    path("notifications/read-all/", views.MarkAllNotificationsReadView.as_view()),
    path("notifications/unread-count/", views.UnreadNotificationCountView.as_view()),
]