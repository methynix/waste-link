import graphene
from graphene_django import DjangoObjectType

from .models import Dispute, Notification


class NotificationType(DjangoObjectType):
    class Meta:
        model = Notification
        fields = "__all__"
        convert_choices_to_enum = False


class DisputeType(DjangoObjectType):
    class Meta:
        model = Dispute
        fields = "__all__"
        convert_choices_to_enum = False


def _require_user(info):
    user = info.context.user
    if not user.is_authenticated:
        raise Exception("You need to sign in first.")
    return user


class FlagDispute(graphene.Mutation):
    class Arguments:
        reason = graphene.String(required=True)
        collection_job_id = graphene.UUID()
        sale_transaction_id = graphene.UUID()

    dispute = graphene.Field(DisputeType)

    def mutate(self, info, reason, collection_job_id=None, sale_transaction_id=None):
        user = _require_user(info)
        dispute = Dispute.objects.create(
            raised_by=user,
            reason=reason,
            collection_job_id=collection_job_id,
            sale_transaction_id=sale_transaction_id,
        )
        return FlagDispute(dispute=dispute)


class MarkNotificationRead(graphene.Mutation):
    class Arguments:
        notification_id = graphene.UUID(required=True)

    notification = graphene.Field(NotificationType)

    def mutate(self, info, notification_id):
        user = _require_user(info)
        note = Notification.objects.get(id=notification_id, user=user)
        note.is_read = True
        note.save(update_fields=["is_read"])
        return MarkNotificationRead(notification=note)


class Query(graphene.ObjectType):
    my_notifications = graphene.List(NotificationType)

    def resolve_my_notifications(self, info):
        user = _require_user(info)
        return Notification.objects.filter(user=user)


class Mutation(graphene.ObjectType):
    flag_dispute = FlagDispute.Field()
    mark_notification_read = MarkNotificationRead.Field()
