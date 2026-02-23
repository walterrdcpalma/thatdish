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
  const dishCategoryId = (raw.dishCategoryId ?? raw.DishCategoryId) as string | undefined;
  const dishCategoryName = (raw.dishCategoryName ?? raw.DishCategoryName) as string | undefined;
  const dishFamilyName = (raw.dishFamilyName ?? raw.DishFamilyName) as string | undefined;
  const savedCountRaw = raw.savedCount ?? raw.SavedCount;
  const savedCount = typeof savedCountRaw === "number" && !Number.isNaN(savedCountRaw) ? savedCountRaw : 0;
  const savedByUserIdsRaw = raw.savedByUserIds ?? raw.SavedByUserIds;
  const savedByUserIds = Array.isArray(savedByUserIdsRaw) ? savedByUserIdsRaw as string[] : [];
  const likeCountRaw = raw.likeCount ?? raw.LikeCount;
  const likeCount = typeof likeCountRaw === "number" && !Number.isNaN(likeCountRaw) ? likeCountRaw : 0;
  const likedByUserIdsRaw = raw.likedByUserIds ?? raw.LikedByUserIds;
  const likedByUserIds = Array.isArray(likedByUserIdsRaw) ? likedByUserIdsRaw as string[] : [];

  return {
    id: dto.id,
    name: dto.name,
    restaurantId: dto.restaurantId,
    restaurantName: typeof restaurantName === "string" && restaurantName ? restaurantName : undefined,
    image: (raw.image ?? raw.Image ?? "") as string,
    foodType: typeof foodType === "string" ? foodType : "",
    ...(typeof dishCategoryId === "string" && dishCategoryId ? { dishCategoryId } : {}),
    ...(typeof dishCategoryName === "string" ? { dishCategoryName } : {}),
    ...(typeof dishFamilyName === "string" ? { dishFamilyName } : {}),
    savedCount,
    savedByUserIds,
    likeCount,
    likedByUserIds,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
    createdByUserId: dto.createdByUserId,
    lastEditedByUserId: dto.lastEditedByUserId ?? null,
    isArchived: dto.isArchived,
  };
}
