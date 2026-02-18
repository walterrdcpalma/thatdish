import type { RestaurantDto } from "@/src/shared/api/restaurantsApi";
import type { Restaurant } from "../types";

/**
 * Maps backend DTO to frontend Restaurant.
 * Backend does not have signatureDishId, ownerUserId, claimStatus, imageUrl, cuisine — set to defaults.
 */
export function mapRestaurantDtoToRestaurant(dto: RestaurantDto): Restaurant {
  const raw = dto as unknown as Record<string, unknown>;
  const id = String(raw.id ?? raw.Id ?? "");
  const name = String(raw.name ?? raw.Name ?? "");
  const address = raw.address ?? raw.Address;
  const addrStr =
    typeof address === "string" ? address : address == null ? "" : String(address);
  const lat = raw.latitude ?? raw.Latitude;
  const lon = raw.longitude ?? raw.Longitude;
  return {
    id,
    name,
    location: addrStr,
    address: addrStr || undefined,
    latitude: typeof lat === "number" ? lat : undefined,
    longitude: typeof lon === "number" ? lon : undefined,
    signatureDishId: null,
    ownerUserId: null,
    claimStatus: "unclaimed",
  };
}
