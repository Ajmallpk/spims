from django.db.models import Q

from .models import Chat


def can_access_complaint_chat(user, chat):

    if not chat:
        return False

    return user in [
        chat.citizen,
        chat.authority
    ]


def can_access_authority_chat(user, chat):

    if not chat:
        return False

    return user in [
        chat.sender_authority,
        chat.receiver_authority
    ]


def can_start_authority_chat(user, receiver):

    if user.role not in ["WARD", "PANCHAYATH"]:
        return False

    if receiver.role not in ["WARD", "PANCHAYATH"]:
        return False

    if user == receiver:
        return False

    if user.role == "WARD":

        return (
            hasattr(user, "ward_verification")
            and
            user.ward_verification.panchayath == receiver
        )

    if user.role == "PANCHAYATH":

        return (
            hasattr(receiver, "ward_verification")
            and
            receiver.ward_verification.panchayath == user
        )

    return False




def can_start_complaint_chat(user, complaint):

    if user.role == "WARD":
        return complaint.ward == user

    if user.role == "PANCHAYATH":
        return complaint.panchayath == user

    return False