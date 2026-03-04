import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings

OTP_EXPIRY = 300
MAX_ATTEMPTS = 5
RESEND_LIMIT = 3


def generate_otp():
    return str(random.randint(100000, 999999))


def get_cache_key(email, purpose):
    return f"otp_{purpose}_{email}"


def store_otp(email, otp, purpose):
    data = {
        "otp": otp,
        "attempts": 0,
        "resend_count": 0,
        "verified": False
    }
    cache.set(get_cache_key(email, purpose), data, timeout=OTP_EXPIRY)


def verify_otp(email, entered_otp, purpose):
    key = get_cache_key(email, purpose)
    data = cache.get(key)

    if not data:
        return False, "OTP expired"

    if data["attempts"] >= MAX_ATTEMPTS:
        return False, "Too many attempts"

    if str(data["otp"]) != str(entered_otp):
        data["attempts"] += 1
        cache.set(key, data, timeout=OTP_EXPIRY)
        return False, "Invalid OTP"

    data["verified"] = True
    cache.set(key, data, timeout=OTP_EXPIRY)
    return True, "OTP verified"


def resend_otp(email, purpose):
    key = get_cache_key(email, purpose)
    data = cache.get(key)

    if not data:
        return False, "OTP expired"

    if data["resend_count"] >= RESEND_LIMIT:
        return False, "Resend limit reached"

    new_otp = generate_otp()
    data["otp"] = new_otp
    data["resend_count"] += 1

    cache.set(key, data, timeout=OTP_EXPIRY)

    remaining = RESEND_LIMIT - data["resend_count"]
    return True, {"otp": new_otp, "remaining": remaining}


def clear_otp(email, purpose):
    cache.delete(get_cache_key(email, purpose))
    
def get_signup_key(email):
    return f"signup_data_{email}"


def store_signup_data(email, data, role):
    data["role"] = role
    cache.set(get_signup_key(email), data, timeout=OTP_EXPIRY)


def get_signup_data(email):
    return cache.get(get_signup_key(email))


def delete_signup_data(email):
    cache.delete(get_signup_key(email))
    
    
def send_otp_email(email, otp):
    send_mail(
        "SPIMS OTP Verification",
        f"Your OTP is {otp}. It expires in 5 minutes.",
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )