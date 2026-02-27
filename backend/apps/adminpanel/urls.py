from django.urls import path 
from . import views




urlpatterns = [
    path("dashboard/", views.AdminDashboardView.as_view()),
    path("panchayath/verifications/", views.PanchayathVerificationListView.as_view()),
    path("panchayath/verifications/<int:pk>/", views.PanchayathVerificationDetailView.as_view()),
    path("panchayath/approve/<int:pk>/", views.ApprovePanchayathView.as_view()),
    path("panchayath/reject/<int:pk>/", views.RejectPanchayathView.as_view()),
]
