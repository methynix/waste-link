import uuid

from django.conf import settings
from django.db import models


class MaterialCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    name_sw = models.CharField(max_length=50, blank=True)
    base_price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name_plural = "Material categories"

    def __str__(self):
        return self.name


class RecyclingListing(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("negotiating", "Negotiating"),
        ("sold", "Sold"),
        ("cancelled", "Cancelled"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings"
    )
    material = models.ForeignKey(MaterialCategory, on_delete=models.RESTRICT)
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2)
    asking_price = models.DecimalField(max_digits=10, decimal_places=2)
    photo_url = models.URLField(null=True, blank=True)
    location_address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.weight_kg}kg of {self.material.name}"


class Offer(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("countered", "Countered"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(RecyclingListing, on_delete=models.CASCADE, related_name="offers")
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="made_offers"
    )
    offered_price = models.DecimalField(max_digits=10, decimal_places=2)
    counter_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class SaleTransaction(models.Model):
    STATUS_CHOICES = (
        ("escrow_held", "Payment Held in Escrow"),
        ("inspecting", "Buyer Inspecting"),
        ("completed", "Completed & Funds Released"),
        ("disputed", "Disputed"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(RecyclingListing, on_delete=models.CASCADE)
    offer = models.ForeignKey(Offer, on_delete=models.SET_NULL, null=True, blank=True)
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="purchases"
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sales"
    )
    agreed_price = models.DecimalField(max_digits=12, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2)
    seller_payout = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="escrow_held")
    buyer_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    seller_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
