import random

import graphene
from graphene_django import DjangoObjectType

from .models import PhoneOTP, User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            "id", "phone", "email", "username", "role", "verified",
            "collector_type", "document_url", "latitude", "longitude",
            "address", "rating", "rating_count", "created_at",
        )


class RegisterUser(graphene.Mutation):
    class Arguments:
        phone = graphene.String(required=True)
        password = graphene.String(required=True)
        role = graphene.String(required=True)
        email = graphene.String()
        collector_type = graphene.String()

    user = graphene.Field(UserType)

    def mutate(self, info, phone, password, role, email=None, collector_type=None):
        if User.objects.filter(phone=phone).exists():
            raise Exception("This phone number is already registered.")
        user = User.objects.create_user(
            phone=phone, password=password, role=role,
            email=email, collector_type=collector_type,
        )
        return RegisterUser(user=user)


class RequestOTP(graphene.Mutation):
    class Arguments:
        phone = graphene.String(required=True)

    sent = graphene.Boolean()

    def mutate(self, info, phone):
        code = f"{random.randint(0, 999999):06d}"
        PhoneOTP.issue(phone=phone, code=code)
        return RequestOTP(sent=True)


class VerifyOTP(graphene.Mutation):
    class Arguments:
        phone = graphene.String(required=True)
        code = graphene.String(required=True)

    verified = graphene.Boolean()

    def mutate(self, info, phone, code):
        otp = PhoneOTP.objects.filter(phone=phone, code=code).first()
        if not otp or not otp.is_valid():
            raise Exception("That code is wrong or has expired.")
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        User.objects.filter(phone=phone).update(verified=True)
        return VerifyOTP(verified=True)


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        return user if user.is_authenticated else None


class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    request_otp = RequestOTP.Field()
    verify_otp = VerifyOTP.Field()
