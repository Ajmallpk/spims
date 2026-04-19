from django.urls import path 
from . import views




urlpatterns = [
    path("login/", views.AdminLoginView.as_view()),
    path("dashboard/", views.AdminDashboardView.as_view()),
    path("panchayath-verifications/", views.PanchayathVerificationListView.as_view()),
    path("panchayath-verifications/<int:pk>/", views.PanchayathVerificationDetailView.as_view()),
    path("panchayath/approve/<int:pk>/", views.ApprovePanchayathView.as_view()),
    path("panchayath/reject/<int:pk>/", views.RejectPanchayathView.as_view()),
    path("recent-verifications/", views.RecentVerificationsView.as_view()),
    path("critical-alerts/", views.CriticalAlertsView.as_view()),
    path("panchayaths/", views.AdminPanchayathListView.as_view()),
    path("panchayath/suspend/<int:user_id>/", views.SuspendPanchayathView.as_view()),
    path("panchayath/activate/<int:user_id>/", views.ActivatePanchayathView.as_view()),
    path("wards/", views.AdminWardListView.as_view()),
    path("ward/suspend/<int:user_id>/", views.SuspendWardView.as_view()),
    path("ward/activate/<int:user_id>/", views.ActivateWardView.as_view()),
    path("profile/", views.AdminProfileView.as_view()),
    path("panchayath/<int:user_id>/", views.AdminPanchayathDetailView.as_view()),
    path("wards/<int:pk>/", views.AdminWardDetailView.as_view(), name="admin-ward-detail"),
    path("request-email-change/", views.RequestAdminEmailChange.as_view()),
    path("verify-email-change/", views.VerifyAdminEmailChange.as_view()),
    path("change-password/", views.AdminChangePasswordView.as_view()),
    path("citizens/", views.AdminCitizenListView.as_view()),
    path("citizen/suspend/<int:user_id>/", views.SuspendCitizenView.as_view()),
    path("citizen/activate/<int:user_id>/", views.ActivateCitizenView.as_view()),
    path("citizen/<int:user_id>/", views.AdminCitizenDetailView.as_view()),
    path("auth/me/", views.MeView.as_view()),
]


