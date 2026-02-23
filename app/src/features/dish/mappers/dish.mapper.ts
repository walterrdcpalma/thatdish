import type { DishDto } from "@/src/shared/api/dishesApi";
import type { Dish } from "../types";

/**
 * Maps backend DTO to frontend Dish. Uses aggregate counts and optional user-context flags.
 * Supports both camelCase and PascalCase from API.
 */
export function mapDishDtoToDish(dto: DishDto): Dish {
  const raw = dto as unknown as Record<string, unknown>;
  const foodType = (raw.foodType ?? raw.FoodType ?? "") as string;
  const restaurantName = (raw.restaurantName ?? raw.RestaurantName ?? "") as string;
  const dishCategoryId = (raw.dishCategoryId ?? raw.DishCategoryId) as string | undefined;
  const dishCategoryName = (raw.dishCategoryName ?? raw.DishCategoryName) as string | undefined;
  const dishFamilyName = (raw.dishFamilyName ?? raw.DishFamilyName) as string | undefined;
  const n = (v: unknown): number => (typeof v === "number" && !Number.isNaN(v) ? v : 0);
  const likesCount = n(raw.likesCount ?? raw.LikesCount);
  const savesCount = n(raw.savesCount ?? raw.SavesCount);
  const ratingsCount = n(raw.ratingsCount ?? raw.RatingsCount);
  const averageRating = n(raw.averageRating ?? raw.AverageRating);
  const isLikedByCurrentUser = raw.isLikedByCurrentUser ?? raw.IsLikedByCurrentUser;
  const isSavedByCurrentUser = raw.isSavedByCurrentUser ?? raw.IsSavedByCurrentUser;
  const myRating = raw.myRating ?? raw.MyRating;

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
    likesCount,
    savesCount,
    ratingsCount,
    averageRating,
    ...(isLikedByCurrentUser !== undefined && isLikedByCurrentUser !== null ? { isLikedByCurrentUser: Boolean(isLikedByCurrentUser) } : {}),
    ...(isSavedByCurrentUser !== undefined && isSavedByCurrentUser !== null ? { isSavedByCurrentUser: Boolean(isSavedByCurrentUser) } : {}),
    ...(typeof myRating === "number" && !Number.isNaN(myRating) ? { myRating } : {}),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? dto.createdAt,
    createdByUserId: dto.createdByUserId,
    lastEditedByUserId: dto.lastEditedByUserId ?? null,
    isArchived: dto.isArchived,
  };
}
