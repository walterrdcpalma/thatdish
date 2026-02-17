export type ClaimStatus = "unclaimed" | "pending" | "verified";

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  /** Restaurant address (required when creating; optional for legacy records). */
  address?: string;
  latitude?: number;
  longitude?: number;
  signatureDishId: string | null;
  ownerUserId: string | null;
  claimStatus: ClaimStatus;
  imageUrl?: string;
  /** Cuisine type for filtering (e.g. Portuguese, Italian). */
  cuisine?: string;
}
