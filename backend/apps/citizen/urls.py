from django.urls import path
from . import views


urlpatterns = [

    path("profile/", views.CitizenProfileView.as_view()),
    path("profile/update/", views.UpdateCitizenProfileView.as_view()),
    path("verification/submit/",views.CitizenVerificationSubmitView.as_view()),
    path("verification/status/",views.CitizenVerificationStatusView.as_view()),

]