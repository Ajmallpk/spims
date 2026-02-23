from django.urls import path 
from . import views



urlpatterns = [
    path("me/", views.AdminMeView.as_view()),
    path("dashboard/", views.AdminDashboardView.as_view()),
    path("block-verifications/", views.BlockVerificationListView.as_view(),name="list_block"),
    path("block-verification/<int:pk>/", views.BlockVerificationDetailView.as_view(),name="view_block"),
    path("block-approve/<int:pk>/", views.BlockApproveView.as_view(),name="approve_block"),
    path("block-reject/<int:pk>/", views.BlockRejectView.as_view(),name="reject_block"),
]