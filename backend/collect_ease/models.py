import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models


class PricingRule(models.Model):
    VOLUME_CHOICES = (
        ("small", "Small (a few bags)"),
        ("medium", "Medium (a bin)"),
        ("large", "Large (a cart load)"),
        ("xlarge", "Extra large (a truck load)"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    waste_type = models.CharField(max_length=20)
    volume = models.CharField(max_length=20, choices=VOLUME_CHOICES)
    base_fee = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("waste_type", "volume")

    def __str__(self):
        return f"{self.waste_type}/{self.volume} = {self.base_fee}"


class CollectionJob(models.Model):
    WASTE_TYPES = (
        ("household", "Household"),
        ("commercial", "Commercial"),
        ("industrial", "Industrial"),
        ("hazardous", "Hazardous"),
        ("recyclable", "Recyclable Only"),
    )
    STATUS_CHOICES = (
        ("searching", "Searching for Collector"),
        ("accepted", "Accepted"),
        ("en_route", "En Route"),
        ("arrived", "Arrived"),
        ("collected", "Collected"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )
    PAYMENT_STATUS = (
        ("unpaid", "Unpaid"),
        ("held", "Held"),
        ("released", "Released"),
        ("failed", "Failed"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="requested_jobs"
    )
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="assigned_jobs",
    )
    waste_type = models.CharField(max_length=20, choices=WASTE_TYPES)
    volume = models.CharField(max_length=50)
    photo_url = models.URLField(null=True, blank=True)
    preferred_time = models.DateTimeField()
    pickup_address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    collector_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="searching")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="unpaid")

    generator_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    collector_rating = models.PositiveSmallIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.waste_type} pickup ({self.status})"


def estimate_price(waste_type, volume):
    rule = PricingRule.objects.filter(waste_type=waste_type, volume=volume).first()
    if rule:
        return rule.base_fee
    return Decimal("0.00")
