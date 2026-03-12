
from django.urls import path
from . import views

urlpatterns = [
    path("profile/", views.PanchayathProfileView.as_view()),
    path("dashboard/", views.PanchayathDashboardView.as_view()),
    
    # Panchayath verification
    path("submit-verification/", views.SubmitPanchayathVerificationView.as_view()),
    path("verification-status/", views.PanchayathVerificationStatusView.as_view()),
    
    # Ward management
    path("wards/", views.PanchayathWardListView.as_view()),
    path("ward-verifications/", views.PanchayathWardVerificationListView.as_view()),
    path("ward/<int:pk>/", views.WardVerificationDetailView.as_view()),
    path("approve-ward/<int:pk>/", views.ApproveWardView.as_view()),
    path("reject-ward/<int:pk>/", views.RejectWardView.as_view()),
    
    
]