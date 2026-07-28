
import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta



OTP_EXPIRY = 300          
MAX_ATTEMPTS = 5
RESEND_LIMIT = 5
RESEND_COOLDOWN = 1800    


def generate_otp():
    return str(random.randint(100000, 999999))


def get_cache_key(email, purpose):
    return f"otp_{purpose}_{email}"




def get_cooldown_key(email, purpose):
    return f"otp_cooldown:{purpose}:{email.lower()}"


def store_otp(email, otp, purpose):
    data = {
        "otp": otp,
        "attempts": 0,
        "resend_count": 0,
        "verified": False,
        
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



from datetime import timedelta

def resend_otp(email, purpose):
    otp_key = get_cache_key(email, purpose)
    cooldown_key = get_cooldown_key(email, purpose)

    data = cache.get(otp_key)

    if not data:
        return False, "OTP has expired. Please request a new OTP."

    cooldown = cache.get(cooldown_key)

    if cooldown:
        remaining = int((cooldown - timezone.now()).total_seconds())

        if remaining > 0:
            minutes = (remaining + 59) // 60
            return False, (
                f"Resend limit exceeded. Please try again after {minutes} minute(s)."
            )

    if data["resend_count"] >= RESEND_LIMIT:
        blocked_until = timezone.now() + timedelta(seconds=RESEND_COOLDOWN)

        cache.set(
            cooldown_key,
            blocked_until,
            timeout=RESEND_COOLDOWN,
        )

        return False, (
            "Resend limit exceeded. Please try again after 30 minutes."
        )

    new_otp = generate_otp()

    data["otp"] = new_otp
    data["attempts"] = 0
    data["resend_count"] += 1

    cache.set(
        otp_key,
        data,
        timeout=OTP_EXPIRY,
    )

    return True, {
        "otp": new_otp,
        "remaining": RESEND_LIMIT - data["resend_count"],
    }
    
    
    
    
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
    
    
    

from django.core.mail import send_mail
from django.conf import settings


def send_set_password_email(
    personal_email,
    official_email,
    link,
):
    send_mail(
        subject="SPIMS Account Created",

        message=f"""
Your SPIMS account has been created.

Official Email:
{official_email}

Please click the link below to set your password:

{link}
        """,

        from_email=settings.DEFAULT_FROM_EMAIL,

        recipient_list=[
            personal_email
        ],

        fail_silently=False,
    )