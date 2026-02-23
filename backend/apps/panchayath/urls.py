from django.urls import path
from .views import PanchayathVerificationSubmitView

urlpatterns = [
    path("submit-verification/", PanchayathVerificationSubmitView.as_view()),
]