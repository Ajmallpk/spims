from django.urls import path
from . import views


urlpatterns = [
    path("me/",views.BlockMeView.as_view(),name="block_me"),
    path('home/',views.BlockHomeView.as_view(),name="block_home"),
    path("submit-verification/", views.BlockVerificationSubmitView.as_view(), name="block_submit_verification"),
    path("panchayath-approvals/", views.PanchayathApprovalListView.as_view()),
    path("panchayath-verification/<int:pk>/", views.PanchayathVerificationDetailView.as_view(),name="panchayath_verification_detail"),
    path("panchayath-approve/<int:pk>/", views.PanchayathApproveView.as_view(),name="panachayth_verification_approve"),
    path("panchayath-reject/<int:pk>/", views.PanchayathRejectView.as_view(),name="panachayth_verification_reject"),
]