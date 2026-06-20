import uuid
from decimal import Decimal

import graphene
from django.utils import timezone
from graphene_django import DjangoObjectType

from finance.models import Transaction
from platform_core.models import PlatformConfig
from .models import CollectionJob, PricingRule, estimate_price


class CollectionJobType(DjangoObjectType):
    class Meta:
        model = CollectionJob
        fields = "__all__"


class PricingRuleType(DjangoObjectType):
    class Meta:
        model = PricingRule
        fields = "__all__"


def _require_user(info):
    user = info.context.user
    if not user.is_authenticated:
        raise Exception("You need to sign in first.")
    return user


class CreatePickup(graphene.Mutation):
    class Arguments:
        waste_type = graphene.String(required=True)
        volume = graphene.String(required=True)
        preferred_time = graphene.DateTime(required=True)
        pickup_address = graphene.String(required=True)
        latitude = graphene.Float()
        longitude = graphene.Float()
        photo_url = graphene.String()

    job = graphene.Field(CollectionJobType)

    def mutate(self, info, waste_type, volume, preferred_time, pickup_address,
               latitude=None, longitude=None, photo_url=None):
        user = _require_user(info)
        price = estimate_price(waste_type, volume)
        job = CollectionJob.objects.create(
            customer=user,
            waste_type=waste_type,
            volume=volume,
            preferred_time=preferred_time,
            pickup_address=pickup_address,
            latitude=latitude,
            longitude=longitude,
            photo_url=photo_url,
            estimated_price=price,
        )
        return CreatePickup(job=job)


class AcceptJob(graphene.Mutation):
    class Arguments:
        job_id = graphene.UUID(required=True)

    job = graphene.Field(CollectionJobType)

    def mutate(self, info, job_id):
        user = _require_user(info)
        job = CollectionJob.objects.get(id=job_id)
        if job.status != "searching":
            raise Exception("This job is no longer available.")
        job.collector = user
        job.status = "accepted"
        job.accepted_at = timezone.now()
        job.save()
        return AcceptJob(job=job)


class UpdateJobStatus(graphene.Mutation):
    class Arguments:
        job_id = graphene.UUID(required=True)
        status = graphene.String(required=True)

    job = graphene.Field(CollectionJobType)

    def mutate(self, info, job_id, status):
        user = _require_user(info)
        job = CollectionJob.objects.get(id=job_id)
        if job.collector_id != user.id:
            raise Exception("Only the assigned collector can update this job.")
        allowed = {"en_route", "arrived", "collected", "completed"}
        if status not in allowed:
            raise Exception("That status is not allowed here.")
        job.status = status
        job.save()
        return UpdateJobStatus(job=job)


class ConfirmCompletion(graphene.Mutation):
    class Arguments:
        job_id = graphene.UUID(required=True)
        final_price = graphene.Decimal()

    job = graphene.Field(CollectionJobType)

    def mutate(self, info, job_id, final_price=None):
        user = _require_user(info)
        job = CollectionJob.objects.get(id=job_id)
        if job.customer_id != user.id:
            raise Exception("Only the customer can confirm completion.")
        config = PlatformConfig.current()
        price = Decimal(final_price) if final_price is not None else job.estimated_price
        commission = (price * config.collection_commission_rate).quantize(Decimal("0.01"))
        job.final_price = price
        job.commission = commission
        job.collector_payout = price - commission
        job.status = "completed"
        job.payment_status = "released"
        job.completed_at = timezone.now()
        job.save()
        if job.collector and hasattr(job.collector, "wallet"):
            wallet = job.collector.wallet
            wallet.balance += job.collector_payout
            wallet.total_earned += job.collector_payout
            wallet.save()
            Transaction.objects.create(
                wallet=wallet,
                transaction_type="payout",
                amount=job.collector_payout,
                reference=f"job-{job.id}-{uuid.uuid4().hex[:8]}",
                status="completed",
            )
        return ConfirmCompletion(job=job)


class RateJob(graphene.Mutation):
    class Arguments:
        job_id = graphene.UUID(required=True)
        score = graphene.Int(required=True)

    job = graphene.Field(CollectionJobType)

    def mutate(self, info, job_id, score):
        user = _require_user(info)
        job = CollectionJob.objects.get(id=job_id)
        if user.id == job.customer_id:
            job.collector_rating = score
        elif user.id == job.collector_id:
            job.generator_rating = score
        else:
            raise Exception("You are not part of this job.")
        job.save()
        return RateJob(job=job)


class Query(graphene.ObjectType):
    my_jobs = graphene.List(CollectionJobType)
    open_jobs = graphene.List(CollectionJobType)
    estimate_pickup = graphene.Decimal(
        waste_type=graphene.String(required=True),
        volume=graphene.String(required=True),
    )

    def resolve_my_jobs(self, info):
        user = _require_user(info)
        return CollectionJob.objects.filter(customer=user)

    def resolve_open_jobs(self, info):
        _require_user(info)
        return CollectionJob.objects.filter(status="searching")

    def resolve_estimate_pickup(self, info, waste_type, volume):
        return estimate_price(waste_type, volume)


class Mutation(graphene.ObjectType):
    create_pickup = CreatePickup.Field()
    accept_job = AcceptJob.Field()
    update_job_status = UpdateJobStatus.Field()
    confirm_completion = ConfirmCompletion.Field()
    rate_job = RateJob.Field()
