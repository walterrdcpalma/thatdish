import type { Dish } from "@/src/features/dish/types";

/**
 * Raw shape of a dish from GET /api/dishes (camelCase JSON).
 * Kept in API layer; mapping to domain Dish happens here.
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
 * Maps backend DTO to frontend Dish. Uses backend values as-is (image, foodType).
 * Supports both camelCase (foodType) and PascalCase (FoodType) from API.
 */
export function mapDishDtoToDish(dto: DishDto): Dish {
  const raw = dto as unknown as Record<string, unknown>;
  const foodType = (raw.foodType ?? raw.FoodType ?? "") as string;
  const restaurantName = (raw.restaurantName ?? raw.RestaurantName ?? "") as string;
  return {
    id: dto.id,
    name: dto.name,
    restaurantId: dto.restaurantId,
    restaurantName: typeof restaurantName === "string" && restaurantName ? restaurantName : undefined,
    image: (raw.image ?? raw.Image ?? "") as string,
    foodType: typeof foodType === "string" ? foodType : "",
    savedCount: dto.savedCount,
    savedByUserIds: Array.isArray(dto.savedByUserIds) ? dto.savedByUserIds : [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
    createdByUserId: dto.createdByUserId,
    lastEditedByUserId: dto.lastEditedByUserId ?? null,
    isArchived: dto.isArchived,
  };
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
