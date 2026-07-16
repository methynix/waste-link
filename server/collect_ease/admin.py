from django.contrib import admin

from .models import CollectionJob, PricingRule


@admin.register(CollectionJob)
class CollectionJobAdmin(admin.ModelAdmin):
    list_display = ("id", "waste_type", "status", "payment_status",
                    "customer", "collector", "estimated_price", "created_at")
    list_filter = ("status", "payment_status", "waste_type")


@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ("waste_type", "volume", "base_fee")
    list_filter = ("waste_type", "volume")
