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
