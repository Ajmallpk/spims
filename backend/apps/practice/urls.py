from django.urls import path
from . import views

urlpatterns = [
    path("server-health/", views.ServerHealthView.as_view()),
]