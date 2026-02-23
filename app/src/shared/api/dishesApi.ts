import type { Dish } from "@/src/features/dish/types";
import { mapDishDtoToDish } from "@/src/features/dish/mappers/dish.mapper";

/**
 * Raw shape of a dish from GET /api/dishes (camelCase JSON).
 * Kept in API layer; mapping to domain Dish happens in feature mapper.
 */
export interface DishDto {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName?: string;
  image: string;
  foodType: string;
  dishCategoryId?: string;
  dishCategoryName?: string;
  dishFamilyName?: string;
  savedCount: number;
  savedByUserIds: string[];
  likeCount: number;
  likedByUserIds: string[];
  createdAt: string;
  updatedAt: string | null;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
}

/**
 * Search dishes by name or restaurant name via GET /api/dishes/search?query=term.
 * Returns parsed Dish[] or throws on non-OK. Empty query returns [].
 */
export async function searchDishes(baseUrl: string, query: string): Promise<Dish[]> {
  const trimmed = (query ?? "").trim();
  if (!trimmed) return [];
  const url = `${baseUrl.replace(/\/$/, "")}/api/dishes/search?query=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dish search failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => mapDishDtoToDish(item as DishDto));
}

/**
 * Fetches dishes from GET /api/dishes. Base URL must be passed (from config).
 * Returns parsed Dish[] or throws on non-OK or parse error.
 */
export async function fetchDishes(baseUrl: string): Promise<Dish[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/dishes`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Dishes request failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("Dishes response is not an array");
  }
  return raw.map((item) => mapDishDtoToDish(item as DishDto));
}

/**
 * Fetches My Contributions from GET /api/dishes/my-contributions (dishes created by current user).
 */
export async function fetchMyContributions(baseUrl: string): Promise<Dish[]> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/dishes/my-contributions`;
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 503) {
      const text = await response.text();
      throw new Error(text || "Seed user not found.");
    }
    throw new Error(`My contributions request failed: ${response.status}`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("My contributions response is not an array");
  }
  return raw.map((item) => mapDishDtoToDish(item as DishDto));
}

/** Request body for POST /api/dishes. */
export interface CreateDishRequest {
  name: string;
  restaurantName: string;
  foodType?: string;
  image?: string;
}

/**
 * Creates a dish via POST /api/dishes. Creates the restaurant if it does not exist.
 * Backend expects: dishName, restaurantName, foodType, image.
 */
export async function createDish(
  baseUrl: string,
  body: CreateDishRequest
): Promise<Dish> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/dishes`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dishName: body.name.trim(),
      restaurantName: body.restaurantName.trim(),
      foodType: body.foodType?.trim() || "Other",
      image: body.image?.trim() || "",
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    const message =
      text && text.length < 200 ? text : `Create dish failed: ${response.status}`;
    throw new Error(message);
  }
  const raw: unknown = await response.json();
  return mapDishDtoToDish(raw as DishDto);
}

/**
 * Creates a dish via POST /api/dishes with multipart/form-data (name, restaurantName, image file).
 * Do not set Content-Type header so fetch sets multipart/form-data with boundary.
 */
export async function createDishMultipart(
  baseUrl: string,
  formData: FormData
): Promise<Dish> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/dishes`;
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text();
    const message =
      text && text.length < 200 ? text : `Create dish failed: ${response.status}`;
    throw new Error(message);
  }
  const raw: unknown = await response.json();
  return mapDishDtoToDish(raw as DishDto);
}
