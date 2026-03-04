
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Complaint(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
        ("REJECTED", "Rejected"),
        ("ESCALATED", "Escalated"),
    ]

    CATEGORY_CHOICES = [
        ("ROAD", "Road Issue"),
        ("WATER", "Water Issue"),
        ("ELECTRICITY", "Electricity"),
        ("WASTE", "Waste Management"),
        ("OTHER", "Other"),
    ]

    citizen = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="complaints"
    )

    ward = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ward_complaints"
    )

    panchayath = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="panchayath_complaints"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    location = models.CharField(max_length=255)

    image = models.ImageField(upload_to="complaints/images/", blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    chat_closed = models.BooleanField(default=False)

    resolved_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"