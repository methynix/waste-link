import uuid as uuid_module

import graphene
from graphene_django import DjangoObjectType

from .models import DepositRequest, Transaction, Wallet, WithdrawalRequest


class WalletType(DjangoObjectType):
    class Meta:
        model = Wallet
        fields = "__all__"


class TransactionType(DjangoObjectType):
    class Meta:
        model = Transaction
        fields = "__all__"
        convert_choices_to_enum = False


class WithdrawalRequestType(DjangoObjectType):
    class Meta:
        model = WithdrawalRequest
        fields = "__all__"
        convert_choices_to_enum = False


class DepositRequestType(DjangoObjectType):
    class Meta:
        model = DepositRequest
        fields = "__all__"
        convert_choices_to_enum = False


def _require_user(info):
    user = info.context.user
    if not user.is_authenticated:
        raise Exception("You need to sign in first.")
    return user


class RequestWithdrawal(graphene.Mutation):
    class Arguments:
        amount = graphene.Decimal(required=True)
        mobile_money_number = graphene.String(required=True)

    withdrawal = graphene.Field(WithdrawalRequestType)

    def mutate(self, info, amount, mobile_money_number):
        user = _require_user(info)
        wallet = user.wallet
        if amount <= 0 or amount > wallet.balance:
            raise Exception("Amount is more than your available balance.")
        withdrawal = WithdrawalRequest.objects.create(
            wallet=wallet, amount=amount, mobile_money_number=mobile_money_number
        )
        return RequestWithdrawal(withdrawal=withdrawal)


class InitiateDeposit(graphene.Mutation):
    class Arguments:
        amount = graphene.Decimal(required=True)
        mobile_money_number = graphene.String(required=True)

    deposit_id = graphene.UUID()
    message = graphene.String()

    def mutate(self, info, amount, mobile_money_number):
        from platform_core.services.azampay import initiate_checkout
        user = _require_user(info)
        if amount <= 0:
            raise Exception("Amount must be greater than zero.")
        external_id = f"wt-{uuid_module.uuid4().hex}"
        deposit = DepositRequest.objects.create(
            wallet=user.wallet,
            amount=amount,
            mobile_money_number=mobile_money_number,
            azampay_external_id=external_id,
        )
        try:
            initiate_checkout(
                phone=mobile_money_number,
                amount=str(amount),
                external_id=external_id,
            )
        except Exception as exc:
            deposit.status = "failed"
            deposit.save(update_fields=["status"])
            raise Exception(f"Could not initiate payment: {exc}")
        return InitiateDeposit(
            deposit_id=deposit.id,
            message="USSD push sent — approve the prompt on your phone.",
        )


class Query(graphene.ObjectType):
    my_wallet = graphene.Field(WalletType)
    my_transactions = graphene.List(TransactionType)

    def resolve_my_wallet(self, info):
        user = _require_user(info)
        return user.wallet

    def resolve_my_transactions(self, info):
        user = _require_user(info)
        return Transaction.objects.filter(wallet=user.wallet)


class Mutation(graphene.ObjectType):
    request_withdrawal = RequestWithdrawal.Field()
    initiate_deposit = InitiateDeposit.Field()
