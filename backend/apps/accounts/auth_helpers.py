import secrets
from django.conf import settings


def prepare_password_setup(user):
    """
    Prepares an authority account for password setup.

    Used for:
    - Account Creation
    - Password Reset
    - Officer Replacement
    - Official Email Update
    """

    user.set_unusable_password()

    user.set_password_token = secrets.token_urlsafe(32)

    user.must_change_password = True

    user.failed_attempts = 0
    user.lock_until = None

    user.save()

    return (
        f"{settings.FRONTEND_URL}/set-password/"
        f"{user.set_password_token}"
    )