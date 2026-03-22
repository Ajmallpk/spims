from django.urls import path
from . import views
urlpatterns = [
    path("profile/",views.WardProfile.as_view()),
    path("dashboard/",views.WardDashboardView.as_view()),
    path("submit-verification/",views.SubmitWardVerificationView.as_view()),
    path("verification-status/",views.WardVerificationStatusView.as_view()),
    path("citizen-verifications/",views.CitizenVerificationListView.as_view()),
    path("citizens/",views.ApprovedCitizenListView.as_view()),
    path("citizen/<int:pk>/details/", views.CitizenVerificationDetailView.as_view()),
    path("approve-citizen/<int:pk>/",views.ApproveCitizenView.as_view()),
    path("reject-citizen/<int:pk>/",views.RejectCitizenView.as_view()),
    path("recent-citizen-verifications/",views.RecentCitizenVerificationView.as_view()),
    path("panchayath-dropdown/", views.PanchayathDropdownListView.as_view()),
    path("change-password/", views.WardChangePasswordView.as_view()),
    path("change-email/", views.WardChangeEmailRequestView.as_view()),
    path("change-email/verify/<str:token>/", views.WardChangeEmailVerifyView.as_view()),
    path("citizen/<int:pk>/full-details/", views.CitizenFullDetailView.as_view()),
    path("complaints/", views.WardComplaintListView.as_view()),
    # path("complaint/<int:complaint_id>/resolve/", views.ResolveComplaintView.as_view()),
    path("complaint/<int:complaint_id>/escalate/", views.EscalateComplaintView.as_view()),
]