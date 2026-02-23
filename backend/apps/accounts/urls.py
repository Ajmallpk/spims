from django.urls import path
from . import views


urlpatterns = [
    
    path("signup/",views.SignupRequestView.as_view(),name="signup"),
    path("login/",views.EmailLoginView.as_view(),name="login"),
    path("verify-otp/", views.VerifyOTPView.as_view(), name="verify_otp"),
    path("resend-otp/", views.ResendOTPView.as_view(), name="resend_otp"),
    path("forgot-password/", views.ForgotPasswordView.as_view(), name="forgot_password"),
    path("verify-reset-otp/", views.VerifyResetOTPView.as_view(), name="verify_reset_otp"),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset_password"),
]