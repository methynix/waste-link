import random

import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.shortcuts import get_token

from .models import EmailOTP, PhoneOTP, User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            "id", "phone", "email", "username", "role", "verified",
            "collector_type", "document_url", "latitude", "longitude",
            "address", "rating", "rating_count", "created_at",
        )
        # Without this, graphene-django converts CharField choices to GraphQL Enums,
        # which are serialized as their uppercase name ("WASTE_GENERATOR") instead of
        # the stored database value ("waste_generator"), breaking frontend comparisons.
        convert_choices_to_enum = False


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
        from platform_core.services.meseji import send_sms
        code = f"{random.randint(0, 999999):06d}"
        PhoneOTP.issue(phone=phone, code=code)
        send_sms(phone, f"Your WasteTech verification code is {code}. It expires in 10 minutes.")
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


class LoginUser(graphene.Mutation):
    """Authenticate with either a phone number or an email address."""

    class Arguments:
        identifier = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, identifier, password):
        identifier = identifier.strip()
        user = (
            User.objects.filter(phone=identifier).first()
            or User.objects.filter(email__iexact=identifier).first()
        )
        if user is None or not user.check_password(password):
            raise Exception("Those login details are incorrect.")
        return LoginUser(token=get_token(user), user=user)


class RequestPasswordReset(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    sent = graphene.Boolean()

    def mutate(self, info, email):
        from platform_core.services.email import send_email

        email = email.strip()
        # Always report success so we don't reveal which emails are registered.
        user = User.objects.filter(email__iexact=email).first()
        if user is not None:
            code = f"{random.randint(0, 999999):06d}"
            EmailOTP.issue(email=email, code=code)
            send_email(
                email,
                "WasteLink password reset code",
                f"Your WasteLink password reset code is {code}. "
                f"It expires in 10 minutes. If you did not request this, ignore this email.",
            )
        return RequestPasswordReset(sent=True)


class ResetPassword(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        code = graphene.String(required=True)
        new_password = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, email, code, new_password):
        email = email.strip()
        otp = (
            EmailOTP.objects.filter(email__iexact=email, code=code).first()
        )
        if not otp or not otp.is_valid():
            raise Exception("That code is wrong or has expired.")
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise Exception("No account found for that email.")
        user.set_password(new_password)
        user.save(update_fields=["password"])
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        return ResetPassword(success=True)


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        return user if user.is_authenticated else None


class Mutation(graphene.ObjectType):
    register_user = RegisterUser.Field()
    request_otp = RequestOTP.Field()
    verify_otp = VerifyOTP.Field()
    login_user = LoginUser.Field()
    request_password_reset = RequestPasswordReset.Field()
    reset_password = ResetPassword.Field()
