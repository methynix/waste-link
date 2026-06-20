import uuid

from django.conf import settings
from django.db import models


class PlatformConfig(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collection_commission_rate = models.DecimalField(
        max_digits=4, decimal_places=2, default=0.15
    )
    recycle_commission_rate = models.DecimalField(
        max_digits=4, decimal_places=2, default=0.10
    )
    matching_radius_km = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    accept_window_seconds = models.PositiveIntegerField(default=60)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Platform configuration"
        verbose_name_plural = "Platform configuration"

    @classmethod
    def current(cls):
        config = cls.objects.first()
        if config is None:
            config = cls.objects.create()
        return config


class Notification(models.Model):
    CHANNELS = (
        ("sms", "SMS"),
        ("push", "Push"),
        ("in_app", "In App"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    channel = models.CharField(max_length=10, choices=CHANNELS, default="in_app")
    title = models.CharField(max_length=120)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class Dispute(models.Model):
    STATUS_CHOICES = (
        ("open", "Open"),
        ("reviewing", "Reviewing"),
        ("resolved", "Resolved"),
        ("rejected", "Rejected"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raised_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="disputes"
    )
    collection_job = models.ForeignKey(
        "collect_ease.CollectionJob", on_delete=models.SET_NULL, null=True, blank=True
    )
    sale_transaction = models.ForeignKey(
        "recycle_market.SaleTransaction", on_delete=models.SET_NULL, null=True, blank=True
    )
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    resolution_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
