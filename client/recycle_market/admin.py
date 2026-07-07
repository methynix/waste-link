from django.contrib import admin

from .models import MaterialCategory, Offer, RecyclingListing, SaleTransaction


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "name_sw", "base_price_per_kg")


@admin.register(RecyclingListing)
class RecyclingListingAdmin(admin.ModelAdmin):
    list_display = ("id", "material", "weight_kg", "asking_price", "status", "seller", "created_at")
    list_filter = ("status", "material")


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "buyer", "offered_price", "counter_price", "status")
    list_filter = ("status",)


@admin.register(SaleTransaction)
class SaleTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "buyer", "seller", "agreed_price", "status", "created_at")
    list_filter = ("status",)
