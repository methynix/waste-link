from django.contrib import admin

from .models import Dispute, Notification, PlatformConfig


@admin.register(PlatformConfig)
class PlatformConfigAdmin(admin.ModelAdmin):
    list_display = ("collection_commission_rate", "recycle_commission_rate",
                    "matching_radius_km", "accept_window_seconds", "updated_at")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "channel", "title", "is_read", "is_sent", "created_at")
    list_filter = ("channel", "is_read", "is_sent")


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ("id", "raised_by", "status", "created_at")
    list_filter = ("status",)
