from django.urls import path
from . import views


urlpatterns = [

    path("profile/", views.CitizenProfileView.as_view()),
    path("profile/update/", views.UpdateCitizenProfileView.as_view()),
    path("verification/submit/",views.CitizenVerificationSubmitView.as_view()),
    path("verification/status/",views.CitizenVerificationStatusView.as_view()),
    path("upload-avatar/", views.UploadAvatarView.as_view()),
    path("wards/", views.WardListView.as_view()),
    path("change-password/", views.ChangePasswordView.as_view()),
    # path("change-email/", views.ChangeEmailView.as_view()),
    path("change-email/", views.ChangeEmailRequestView.as_view()),
    path("change-email/verify/<str:token>/", views.ChangeEmailVerifyView.as_view()),

]