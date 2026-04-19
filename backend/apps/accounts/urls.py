from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    
    path("signup/citizen/", views.CitizenSignupRequestView.as_view()),
    path("signup/authority/", views.AuthoritySignupRequestView.as_view()),
    path("login/citizen/", views.EmailLoginView.as_view()),
    path("login/authority/", views.EmailLoginView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("verify-otp/", views.VerifyOTPView.as_view()),
    path("resend-otp/", views.ResendOTPView.as_view()),
    path("forgot-password/", views.ForgotPasswordView.as_view(), name="forgot_password"),
    path("verify-reset-otp/", views.VerifyResetOTPView.as_view(), name="verify_reset_otp"),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset_password"),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("csrf/", views.SetCSRFTokenView.as_view()),
    path("me/", views.MeView.as_view()),
]