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
  savedCount: number;
  savedByUserIds: string[];
  createdAt: string;
  updatedAt: string | null;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
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
