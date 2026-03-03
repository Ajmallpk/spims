from django.urls import path
from . import views
urlpatterns = [
    path("profile/",views.WardProfile.as_view()),
    path("dashboard/",views.WardDashboardView.as_view()),
    path("submit-verification/",views.SubmitWardVerificationView.as_view()),
    path("verification-status/",views.WardVerificationStatusView.as_view()),
    path("citizen-verifications/",views.CitizenVerificationListView.as_view()),
    path("citizens/",views.ApproveCitizenListView.as_view()),
    path("citizen/<int:pk>/",views.CitizenVerificationDetailView.as_view()),
    path("approve-citizen/<int:pk>/",views.ApproveCitizenView.as_view()),
    path("reject-citzen/<int:pk>",views.RejectCitizenView.as_view()),
]