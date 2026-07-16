from django.contrib import admin

from .models import Transaction, Wallet, WithdrawalRequest


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "held", "total_earned", "total_withdrawn")
    search_fields = ("user__phone",)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("reference", "wallet", "transaction_type", "amount", "status", "created_at")
    list_filter = ("transaction_type", "status")
    search_fields = ("reference",)


@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ("wallet", "amount", "mobile_money_number", "status", "created_at")
    list_filter = ("status",)
