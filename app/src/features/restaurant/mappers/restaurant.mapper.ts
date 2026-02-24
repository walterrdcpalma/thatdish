import type { RestaurantDto } from "@/src/shared/api/restaurantsApi";
import type { Restaurant } from "../types";
import type { OwnershipType, ClaimStatus } from "../types";

const OWNERSHIP_VALUES: OwnershipType[] = ["Community", "OwnerManaged"];
const CLAIM_STATUS_VALUES: ClaimStatus[] = ["None", "Pending", "Verified", "Rejected"];

function parseOwnershipType(v: unknown): OwnershipType {
  const s = typeof v === "string" ? v.trim() : "";
  return OWNERSHIP_VALUES.includes(s as OwnershipType) ? (s as OwnershipType) : "Community";
}

function parseClaimStatus(v: unknown): ClaimStatus {
  const s = typeof v === "string" ? v.trim() : "";
  return CLAIM_STATUS_VALUES.includes(s as ClaimStatus) ? (s as ClaimStatus) : "None";
}

/**
 * Maps backend DTO to frontend Restaurant.
 * Maps ownershipType, claimStatus, claimedByUserId, ownerUserId from backend when present.
 */
export function mapRestaurantDtoToRestaurant(dto: RestaurantDto): Restaurant {
  const raw = dto as unknown as Record<string, unknown>;
  const id = String(raw.id ?? raw.Id ?? "");
  const name = String(raw.name ?? raw.Name ?? "");
  const address = raw.address ?? raw.Address;
  const addrStr =
    typeof address === "string" ? address : address == null ? "" : String(address);
  const city = raw.city ?? raw.City;
  const cityStr =
    typeof city === "string" ? city : city == null ? undefined : String(city);
  const country = raw.country ?? raw.Country;
  const countryStr =
    typeof country === "string" ? country : country == null ? undefined : String(country);
  const lat = raw.latitude ?? raw.Latitude;
  const lon = raw.longitude ?? raw.Longitude;
  const ownershipType = parseOwnershipType(raw.ownershipType ?? raw.OwnershipType);
  const claimStatus = parseClaimStatus(raw.claimStatus ?? raw.ClaimStatus);
  const claimedByUserId = raw.claimedByUserId ?? raw.ClaimedByUserId;
  const claimedBy =
    claimedByUserId != null && claimedByUserId !== ""
      ? String(claimedByUserId)
      : null;
  const ownerUserId = raw.ownerUserId ?? raw.OwnerUserId;
  const owner =
    ownerUserId != null && ownerUserId !== ""
      ? String(ownerUserId)
      : claimStatus === "Verified" && claimedBy
        ? claimedBy
        : null;
  return {
    id,
    name,
    location: addrStr,
    address: addrStr || undefined,
    city: cityStr || undefined,
    country: countryStr || undefined,
    latitude: typeof lat === "number" ? lat : undefined,
    longitude: typeof lon === "number" ? lon : undefined,
    signatureDishId: null,
    ownerUserId: owner,
    claimedByUserId: claimedBy,
    claimStatus,
    ownershipType,
  };
}
