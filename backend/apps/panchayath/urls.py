from django.urls import path
from . import views 

urlpatterns = [
    path("panchayath/submit-verification/", views.SubmitPanchayathVerificationView.as_view()),
    path("panchayath/profile/", views.PanchayathProfileView.as_view()),
    path("panchayath/wards/", views.PanchayathWardListView.as_view()),
    path("panchayath/ward/<int:pk>/", views.WardVerificationDetailView.as_view()),
    path("panchayath/dashboard/", views.PanchayathDashboardView.as_view()),
    path("panchayath/ward/approve/<int:pk>/", views.ApproveWardView.as_view()),
    path("panchayath/ward/reject/<int:pk>/", views.RejectWardView.as_view()),
]