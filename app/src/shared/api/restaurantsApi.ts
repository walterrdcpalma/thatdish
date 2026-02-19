import type { Restaurant } from "@/src/features/restaurant/types";
import { mapRestaurantDtoToRestaurant } from "@/src/features/restaurant/mappers/restaurant.mapper";

/**
 * Raw shape of a restaurant from GET /api/restaurants (camelCase JSON).
 * Kept in API layer; mapping to domain Restaurant happens in feature mapper.
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
  /** Community | OwnerManaged */
  ownershipType?: string | null;
  /** None | Pending | Verified | Rejected */
  claimStatus?: string | null;
  /** User id who submitted the claim (if any) */
  claimedByUserId?: string | null;
  /** Set when claim is Verified */
  ownerUserId?: string | null;
  claimRequestedAtUtc?: string | null;
  claimReviewedAtUtc?: string | null;
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

/**
 * Response item from GET /api/restaurants?search=term (lightweight).
 */
export interface RestaurantSearchResultDto {
  id: string;
  name: string;
}

/**
 * Fetches restaurant name suggestions from GET /api/restaurants?search=term.
 * Returns up to 10 matches. Base URL must be passed (from config).
 */
export async function fetchRestaurantSearch(
  baseUrl: string,
  term: string
): Promise<RestaurantSearchResultDto[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants?search=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Restaurant search failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) return [];
  return raw as RestaurantSearchResultDto[];
}

/**
 * Fetches a single restaurant by id from GET /api/restaurants/{id}.
 * Returns parsed Restaurant or throws on non-OK or parse error.
 */
export async function fetchRestaurantById(
  baseUrl: string,
  id: string
): Promise<Restaurant> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants/${encodeURIComponent(id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Restaurant not found");
    }
    throw new Error(`Restaurants request failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  return mapRestaurantDtoToRestaurant(raw as RestaurantDto);
}

/**
 * Fetches My Restaurants from GET /api/restaurants/mine (restaurants claimed by current user).
 */
export async function fetchMyRestaurants(baseUrl: string): Promise<Restaurant[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants/mine`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 503) {
      const text = await response.text();
      throw new Error(text || "Seed user not found.");
    }
    throw new Error(`My restaurants request failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("My restaurants response is not an array");
  }
  return raw.map((item) => mapRestaurantDtoToRestaurant(item as RestaurantDto));
}

/**
 * Updates claim state (simulate verification). PATCH /api/restaurants/{id}/claim-state.
 * Body: { state: "Verified" | "Rejected" }.
 */
export async function updateClaimState(
  baseUrl: string,
  restaurantId: string,
  state: "Verified" | "Rejected"
): Promise<Restaurant> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants/${encodeURIComponent(restaurantId)}/claim-state`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) {
    const text = await response.text();
    const message =
      text && text.length < 200 ? text : `Update claim state failed: ${response.status}`;
    throw new Error(message);
  }
  const raw: unknown = await response.json();
  return mapRestaurantDtoToRestaurant(raw as RestaurantDto);
}

/**
 * Submits a claim for a restaurant. POST /api/restaurants/{id}/claims.
 * Returns updated restaurant if backend returns 200 with body; otherwise throws.
 */
export async function submitClaim(
  baseUrl: string,
  restaurantId: string
): Promise<Restaurant> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/restaurants/${encodeURIComponent(restaurantId)}/claims`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    const text = await response.text();
    const message =
      text && text.length < 200 ? text : `Claim failed: ${response.status}`;
    throw new Error(message);
  }
  if (response.status === 204) {
    return fetchRestaurantById(baseUrl, restaurantId);
  }
  const raw: unknown = await response.json();
  return mapRestaurantDtoToRestaurant(raw as RestaurantDto);
}
