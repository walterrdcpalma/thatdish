import type { DishDto } from "@/src/shared/api/dishesApi";
import type { Dish } from "../types";

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
