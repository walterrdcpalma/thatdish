import type { Restaurant } from "@/src/features/restaurant/types";

/**
 * Raw shape of a restaurant from GET /api/restaurants (camelCase JSON).
 * Kept in API layer; mapping to domain Restaurant happens here.
 */
export interface RestaurantDto {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  contactInfo: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

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

/**
 * Fetches restaurants from GET /api/restaurants. Base URL must be passed (from config).
 * Returns parsed Restaurant[] or throws on non-OK or parse error.
 */
export async function fetchRestaurants(baseUrl: string): Promise<Restaurant[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Restaurants request failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("Restaurants response is not an array");
  }
  return raw.map((item) => mapRestaurantDtoToRestaurant(item as RestaurantDto));
}
