from django.conf import settings
from django.core.mail import send_mail


def send_account_created_email(
    *,
    personal_email,
    official_email,
    set_password_link,
):
    subject = "SPIMS Account Created"

    message = f"""
Dear Officer,

A new SPIMS office account has been created for you.

Official Login Email

{official_email}

Please click the link below to create your password.

{set_password_link}

This password setup link can only be used once.

Regards,

SPIMS Administration
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[personal_email],
        fail_silently=False,
    )
    
    
    
    
def send_password_reset_email(
    *,
    personal_email,
    official_email,
    set_password_link,
):
    subject = "SPIMS Password Reset"

    message = f"""
Dear Officer,

A password reset has been requested for your SPIMS office account.

Official Login Email

{official_email}

For security reasons, your previous password has been revoked.

Please create a new password using the link below.

{set_password_link}

This password setup link can only be used once.

If you did not expect this change, please contact the SPIMS Administrator immediately.

Regards,

SPIMS Administration
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[personal_email],
        fail_silently=False,
    )
    
    
    
    
def send_officer_replaced_email(
    *,
    personal_email,
    official_email,
    set_password_link,
):
    subject = "SPIMS Officer Assignment Updated"

    message = f"""
Dear Officer,

You have been assigned as the new officer for an existing SPIMS office account.

Official Login Email

{official_email}

For security reasons, you must create your own password before accessing the system.

Please use the link below to create your password.

{set_password_link}

This password setup link can only be used once.

All office data, complaints, verification records, and permissions remain unchanged.

Regards,

SPIMS Administration
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[personal_email],
        fail_silently=False,
    )
    
    
    
    
def send_official_email_updated_email(
    *,
    personal_email,
    previous_official_email,
    new_official_email,
    reason,
    set_password_link,
):
    subject = "SPIMS Official Office Email Updated"

    message = f"""
Dear Officer,

The official login email for your SPIMS office account has been updated by the SPIMS Administrator.

Reason for the change:
{reason}

Previous Official Email:
{previous_official_email}

New Official Email:
{new_official_email}

For security reasons, your previous password has been revoked.

Please use the NEW official email together with the password you create using the link below.

Password Setup Link

{set_password_link}

IMPORTANT

• Your SPIMS office account remains the same.
• Your verification status remains unchanged.
• Your complaints remain unchanged.
• Your citizens remain unchanged.
• Your permissions remain unchanged.
• Only the official login email has changed.

This password setup link can only be used once.

Regards,

SPIMS Administration
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[personal_email],
        fail_silently=False,
    )
    
    
    
def send_official_phone_updated_email(
    *,
    personal_email,
    official_email,
    previous_phone,
    new_phone,
    reason,
):
    subject = "SPIMS Official Office Phone Updated"

    message = f"""
Dear Officer,

The official office phone number for your SPIMS account has been updated.

Reason for the change:
{reason}

Official Login Email:
{official_email}

Previous Official Phone:
{previous_phone}

New Official Phone:
{new_phone}

This update does NOT affect:

• Login
• Password
• Verification
• Complaints
• Citizens
• Permissions

Only the official office phone number has been changed.

Regards,

SPIMS Administration
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[personal_email],
        fail_silently=False,
    )