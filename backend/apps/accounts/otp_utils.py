import random
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings


OTP_EXPAIRY_SECONDS = 300
MAX_RESEND_LIMIT = 3 


def generate_otp():
    return str(random.randint(100000,999999))

def send_otp_email(email,otp):
    subject = "SPIMS Email Verification OTP"
    message = f"""
    
    Your OTP for SPIMS signup is:{otp}
    
    This OTP is valid for 5 minutes.

    Do not share this with anyone.
    """
    
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
    
def store_signup_data(email,data):
    cache_key = f"signup_otp_{email}"
    cache.set(cache_key,data,timeout=OTP_EXPAIRY_SECONDS)
    
def get_signup_data(email):
    cache_key = f"signup_otp_{email}"
    return cache.get(cache_key)

def delete_signup_data(email):
    cache_key = f"signup_otp_{email}"
    cache.delete(cache_key)
    
    
    
# ---------------- RESET PASSWORD OTP ---------------- #

RESET_OTP_EXPIRY_SECONDS = 300   # 5 minutes
MAX_RESET_RESEND_LIMIT = 3


def store_reset_data(email, data):
    cache_key = f"reset_otp_{email}"
    cache.set(cache_key, data, timeout=RESET_OTP_EXPIRY_SECONDS)


def get_reset_data(email):
    cache_key = f"reset_otp_{email}"
    return cache.get(cache_key)


def delete_reset_data(email):
    cache_key = f"reset_otp_{email}"
    cache.delete(cache_key)