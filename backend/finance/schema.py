import graphene
from graphene_django import DjangoObjectType

from .models import Transaction, Wallet, WithdrawalRequest


class WalletType(DjangoObjectType):
    class Meta:
        model = Wallet
        fields = "__all__"


class TransactionType(DjangoObjectType):
    class Meta:
        model = Transaction
        fields = "__all__"


class WithdrawalRequestType(DjangoObjectType):
    class Meta:
        model = WithdrawalRequest
        fields = "__all__"


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
