from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import PhoneOTP, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("phone",)
    list_display = ("phone", "role", "verified", "rating", "is_staff")
    list_filter = ("role", "verified", "is_staff")
    search_fields = ("phone", "email")
    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Profile", {"fields": ("email", "username", "role", "collector_type",
                                 "document_url", "verified")}),
        ("Location", {"fields": ("address", "latitude", "longitude")}),
        ("Reputation", {"fields": ("rating", "rating_count")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser",
                                     "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",),
                "fields": ("phone", "role", "password1", "password2")}),
    )


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    list_display = ("phone", "code", "is_used", "expires_at", "created_at")
    search_fields = ("phone",)
