from django.urls import path
from . import views


urlpatterns = [
    path("deployment/", views.DeploymentPracticeView.as_view()),
]