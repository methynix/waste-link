import { graphql } from "./api";
import type { MaterialCategory, Offer, RecyclingListing } from "@/types";

const LISTING_FIELDS = `
  id weightKg askingPrice locationAddress status createdAt
  material { id name nameSw basePricePerKg }
`;

export async function materials(): Promise<MaterialCategory[]> {
  const data = await graphql<{ materials: MaterialCategory[] }>(
    `query { materials { id name nameSw basePricePerKg } }`
  );
  return data.materials;
}

export async function listings(materialId?: string): Promise<RecyclingListing[]> {
  const data = await graphql<{ listings: RecyclingListing[] }>(
    `query ($materialId: UUID) { listings(materialId: $materialId) { ${LISTING_FIELDS} } }`,
    { materialId }
  );
  return data.listings;
}

export async function myListings(): Promise<RecyclingListing[]> {
  const data = await graphql<{ myListings: RecyclingListing[] }>(
    `query { myListings { ${LISTING_FIELDS} } }`
  );
  return data.myListings;
}

export interface CreateListingInput {
  materialId: string;
  weightKg: string;
  askingPrice: string;
  locationAddress: string;
}

export async function createListing(
  input: CreateListingInput
): Promise<RecyclingListing> {
  const data = await graphql<{ createListing: { listing: RecyclingListing } }>(
    `mutation ($materialId: UUID!, $weightKg: Decimal!, $askingPrice: Decimal!, $locationAddress: String!) {
      createListing(materialId: $materialId, weightKg: $weightKg, askingPrice: $askingPrice, locationAddress: $locationAddress) {
        listing { ${LISTING_FIELDS} }
      }
    }`,
    input
  );
  return data.createListing.listing;
}

export async function makeOffer(
  listingId: string,
  offeredPrice: string
): Promise<Offer> {
  const data = await graphql<{ makeOffer: { offer: Offer } }>(
    `mutation ($listingId: UUID!, $offeredPrice: Decimal!) {
      makeOffer(listingId: $listingId, offeredPrice: $offeredPrice) {
        offer { id offeredPrice counterPrice status createdAt }
      }
    }`,
    { listingId, offeredPrice }
  );
  return data.makeOffer.offer;
}
