export type Role = "waste_generator" | "collector" | "recycler" | "admin";
export type CollectorType = "normal" | "truck_driver";

export interface User {
  id: string;
  phone: string;
  email?: string | null;
  role: Role;
  verified: boolean;
  collectorType?: CollectorType | null;
  rating: string;
  ratingCount: number;
}

export type WasteType =
  | "household"
  | "commercial"
  | "industrial"
  | "hazardous"
  | "recyclable";

export type Volume = "small" | "medium" | "large" | "xlarge";

export type JobStatus =
  | "searching"
  | "accepted"
  | "en_route"
  | "arrived"
  | "collected"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "held" | "released" | "failed";

export interface CollectionJob {
  id: string;
  wasteType: WasteType;
  volume: string;
  pickupAddress: string;
  preferredTime: string;
  status: JobStatus;
  paymentStatus: PaymentStatus;
  estimatedPrice: string;
  finalPrice?: string | null;
  createdAt: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  nameSw?: string | null;
  basePricePerKg: string;
}

export type ListingStatus = "active" | "negotiating" | "sold" | "cancelled";

export interface RecyclingListing {
  id: string;
  material: MaterialCategory;
  weightKg: string;
  askingPrice: string;
  locationAddress: string;
  status: ListingStatus;
  createdAt: string;
}

export type OfferStatus = "pending" | "accepted" | "rejected" | "countered";

export interface Offer {
  id: string;
  offeredPrice: string;
  counterPrice?: string | null;
  status: OfferStatus;
  createdAt: string;
}

export interface Wallet {
  id: string;
  balance: string;
  held: string;
  totalEarned: string;
  totalWithdrawn: string;
}

export interface Transaction {
  id: string;
  transactionType: string;
  amount: string;
  reference: string;
  status: string;
  createdAt: string;
}

export type DepositStatus = "pending" | "completed" | "failed";

export interface DepositRequest {
  id: string;
  amount: string;
  mobileMoneyNumber: string;
  status: DepositStatus;
  createdAt: string;
}
