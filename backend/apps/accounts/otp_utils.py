# import random
# from django.core.cache import cache
# from django.core.mail import send_mail
# from django.conf import settings
# from django.utils import timezone

# OTP_EXPIRY = 300
# MAX_ATTEMPTS = 5
# RESEND_LIMIT = 3


# def generate_otp():
#     return str(random.randint(100000, 999999))


# def get_cache_key(email, purpose):
#     return f"otp_{purpose}_{email}"


# def store_otp(email, otp, purpose):
#     data = {
#         "otp": otp,
#         "attempts": 0,
#         "resend_count": 0,
#         "verified": False
#     }
#     cache.set(get_cache_key(email, purpose), data, timeout=OTP_EXPIRY)


# def verify_otp(email, entered_otp, purpose):
#     key = get_cache_key(email, purpose)
#     data = cache.get(key)

#     if not data:
#         return False, "OTP expired"

#     if data["attempts"] >= MAX_ATTEMPTS:
#         return False, "Too many attempts"

#     if str(data["otp"]) != str(entered_otp):
#         data["attempts"] += 1
#         cache.set(key, data, timeout=OTP_EXPIRY)
#         return False, "Invalid OTP"

#     data["verified"] = True
#     cache.set(key, data, timeout=OTP_EXPIRY)
#     return True, "OTP verified"


# def resend_otp(email, purpose):
#     key = get_cache_key(email, purpose)
#     data = cache.get(key)

#     if not data:
#         return False, "OTP expired"

#     if data["resend_count"] >= RESEND_LIMIT:
#         return False, "Resend limit reached"

#     new_otp = generate_otp()
#     data["otp"] = new_otp
#     data["resend_count"] += 1

#     cache.set(key, data, timeout=OTP_EXPIRY)

#     remaining = RESEND_LIMIT - data["resend_count"]
#     return True, {"otp": new_otp, "remaining": remaining}


# def clear_otp(email, purpose):
#     cache.delete(get_cache_key(email, purpose))
    
# def get_signup_key(email):
#     return f"signup_data_{email}"


# def store_signup_data(email, data, role):
#     data["role"] = role
#     cache.set(get_signup_key(email), data, timeout=OTP_EXPIRY)


# def get_signup_data(email):
#     return cache.get(get_signup_key(email))


# def delete_signup_data(email):
#     cache.delete(get_signup_key(email))
    
    
# def send_otp_email(email, otp, username):
#     subject = "SPIMS Account Verification OTP"

#     generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

#     message = f"""
# Dear {username},

# Welcome to SPIMS (Smart Panchayath Issue Management System).

# Your One-Time Password (OTP) for verifying your account is:

# ========================
#         {otp}
# ========================

# This OTP will expire in 5 minutes.

# Generated at: {generated_time}
# System: SPIMS Security

# Security Notice:
# • Never share your OTP with anyone.
# • SPIMS team will never ask for your OTP.
# • If you did not request this verification, please ignore this email.

# Best Regards,
# SPIMS Security Team
# """

#     send_mail(
#         subject,
#         message,
#         settings.EMAIL_HOST_USER,
#         [email],
#         fail_silently=False,
#     )



import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

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

    
    if data.get("attempts", 0) >= MAX_ATTEMPTS:
        return False, "Too many attempts. Please request a new OTP."

    
    if str(data.get("otp")) != str(entered_otp):
        data["attempts"] = data.get("attempts", 0) + 1
        cache.set(key, data, timeout=OTP_EXPIRY)
        return False, "Invalid OTP"
    
    data["verified"] = True

    data["attempts"] = 0

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

    
    data["attempts"] = 0

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


def send_otp_email(email, otp, username):
    subject = "SPIMS Account Verification OTP"

    generated_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

    message = f"""
Dear {username},

Welcome to SPIMS (Smart Panchayath Issue Management System).

Your One-Time Password (OTP) for verifying your account is:

========================
        {otp}
========================

This OTP will expire in 5 minutes.

Generated at: {generated_time}
System: SPIMS Security

Security Notice:
• Never share your OTP with anyone.
• SPIMS team will never ask for your OTP.
• If you did not request this verification, please ignore this email.

Best Regards,
SPIMS Security Team
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )