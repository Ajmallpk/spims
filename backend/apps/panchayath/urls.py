
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
    
    path("change-password/", views.PanchayathChangePasswordView.as_view()),
    path("request-email-change/", views.PanchayathRequestEmailChangeView.as_view()),
    path("confirm-email-change/<str:token>/", views.PanchayathConfirmEmailChangeView.as_view()),
    path("complaints/", views.PanchayathComplaintListView.as_view()),
    # path("panchayath/complaint/<int:complaint_id>/resolve/", views.PanchayathResolveView.as_view()),
    path("complaints/<int:complaint_id>/reassign/", views.ReassignComplaintView.as_view()),
    path("complaints/<int:complaint_id>/", views.PanchayathComplaintDetailView.as_view()),
    path("complaints/<int:complaint_id>/resolve/", views.PanchayathResolveView.as_view()),
]