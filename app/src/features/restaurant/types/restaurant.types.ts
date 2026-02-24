/** Backend ownership type. Public label: Community | Owner */
export type OwnershipType = "Community" | "OwnerManaged";

/** Backend claim status. Only shown to claimer in My Restaurants. */
export type ClaimStatus = "None" | "Pending" | "Verified" | "Rejected";

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  signatureDishId: string | null;
  /** Set when claim is Verified; used for edit rights and "owner" context. */
  ownerUserId: string | null;
  /** User who submitted the claim (if any). Claim status only shown to this user in My Restaurants. */
  claimedByUserId: string | null;
  claimStatus: ClaimStatus;
  /** Public label: Community | OwnerManaged → "Community" | "Owner" */
  ownershipType: OwnershipType;
  imageUrl?: string;
  cuisine?: string;
}
