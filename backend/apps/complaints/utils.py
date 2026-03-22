ALLOWED_TRANSITIONS = {
    "PENDING": ["IN_PROGRESS", "ESCALATED", "REJECTED"],
    "IN_PROGRESS": ["RESOLVED", "ESCALATED"],
    "ESCALATED": ["IN_PROGRESS", "RESOLVED"],
    "RESOLVED": [],
    "REJECTED": [],
}

def can_change_status(current, new):
    return new in ALLOWED_TRANSITIONS.get(current, [])