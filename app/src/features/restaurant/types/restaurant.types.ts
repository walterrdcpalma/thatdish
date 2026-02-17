export type ClaimStatus = "unclaimed" | "pending" | "verified";

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  signatureDishId: string | null;
  ownerUserId: string | null;
  claimStatus: ClaimStatus;
  imageUrl?: string;
}
