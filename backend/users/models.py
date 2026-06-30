import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractUser):
    ROLE_CHOICES = (
        ("waste_generator", "Waste Generator"),
        ("collector", "Collector"),
        ("recycler", "Recycler"),
        ("admin", "Admin"),
    )

    COLLECTOR_TYPE_CHOICES = (
        ("normal", "Local Collector (Pushcart/Wheelbarrow)"),
        ("truck_driver", "Truck Driver"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    username = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="waste_generator")

    verified = models.BooleanField(default=False)

    collector_type = models.CharField(
        max_length=20, choices=COLLECTOR_TYPE_CHOICES, null=True, blank=True
    )
    document_url = models.URLField(null=True, blank=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    rating_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["role"]

    def __str__(self):
        return f"{self.phone} - {self.role}"


class PhoneOTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=15, db_index=True)
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    @classmethod
    def issue(cls, phone, code, ttl_minutes=10):
        return cls.objects.create(
            phone=phone,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )


class EmailOTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    @classmethod
    def issue(cls, email, code, ttl_minutes=10):
        return cls.objects.create(
            email=email,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )
