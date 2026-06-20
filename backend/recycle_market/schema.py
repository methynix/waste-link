import graphene
from graphene_django import DjangoObjectType

from .models import MaterialCategory, Offer, RecyclingListing, SaleTransaction


class MaterialCategoryType(DjangoObjectType):
    class Meta:
        model = MaterialCategory
        fields = "__all__"


class RecyclingListingType(DjangoObjectType):
    class Meta:
        model = RecyclingListing
        fields = "__all__"


class OfferType(DjangoObjectType):
    class Meta:
        model = Offer
        fields = "__all__"


class SaleTransactionType(DjangoObjectType):
    class Meta:
        model = SaleTransaction
        fields = "__all__"


def _require_user(info):
    user = info.context.user
    if not user.is_authenticated:
        raise Exception("You need to sign in first.")
    return user


class CreateListing(graphene.Mutation):
    class Arguments:
        material_id = graphene.UUID(required=True)
        weight_kg = graphene.Decimal(required=True)
        asking_price = graphene.Decimal(required=True)
        location_address = graphene.String(required=True)
        photo_url = graphene.String()
        latitude = graphene.Float()
        longitude = graphene.Float()

    listing = graphene.Field(RecyclingListingType)

    def mutate(self, info, material_id, weight_kg, asking_price, location_address,
               photo_url=None, latitude=None, longitude=None):
        user = _require_user(info)
        listing = RecyclingListing.objects.create(
            seller=user,
            material_id=material_id,
            weight_kg=weight_kg,
            asking_price=asking_price,
            location_address=location_address,
            photo_url=photo_url,
            latitude=latitude,
            longitude=longitude,
        )
        return CreateListing(listing=listing)


class MakeOffer(graphene.Mutation):
    class Arguments:
        listing_id = graphene.UUID(required=True)
        offered_price = graphene.Decimal(required=True)

    offer = graphene.Field(OfferType)

    def mutate(self, info, listing_id, offered_price):
        user = _require_user(info)
        listing = RecyclingListing.objects.get(id=listing_id)
        if listing.status not in ("active", "negotiating"):
            raise Exception("This listing is closed.")
        offer = Offer.objects.create(
            listing=listing, buyer=user, offered_price=offered_price
        )
        listing.status = "negotiating"
        listing.save(update_fields=["status"])
        return MakeOffer(offer=offer)


class RespondOffer(graphene.Mutation):
    class Arguments:
        offer_id = graphene.UUID(required=True)
        action = graphene.String(required=True)
        counter_price = graphene.Decimal()

    offer = graphene.Field(OfferType)

    def mutate(self, info, offer_id, action, counter_price=None):
        user = _require_user(info)
        offer = Offer.objects.get(id=offer_id)
        if offer.listing.seller_id != user.id:
            raise Exception("Only the seller can respond to this offer.")
        if action == "accept":
            offer.status = "accepted"
        elif action == "reject":
            offer.status = "rejected"
        elif action == "counter":
            if counter_price is None:
                raise Exception("A counter offer needs a price.")
            offer.status = "countered"
            offer.counter_price = counter_price
        else:
            raise Exception("Unknown action.")
        offer.save()
        return RespondOffer(offer=offer)


class Query(graphene.ObjectType):
    materials = graphene.List(MaterialCategoryType)
    listings = graphene.List(
        RecyclingListingType, material_id=graphene.UUID()
    )
    my_listings = graphene.List(RecyclingListingType)

    def resolve_materials(self, info):
        return MaterialCategory.objects.all()

    def resolve_listings(self, info, material_id=None):
        qs = RecyclingListing.objects.filter(status="active")
        if material_id:
            qs = qs.filter(material_id=material_id)
        return qs

    def resolve_my_listings(self, info):
        user = _require_user(info)
        return RecyclingListing.objects.filter(seller=user)


class Mutation(graphene.ObjectType):
    create_listing = CreateListing.Field()
    make_offer = MakeOffer.Field()
    respond_offer = RespondOffer.Field()
