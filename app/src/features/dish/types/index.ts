export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  /** Restaurant name from API (GET /api/dishes). */
  restaurantName?: string;
  /** Image URL from backend (seed). */
  image: string;
  /** Exact string from backend (e.g. "Traditional", "Seafood"). */
  foodType: string;
  dishCategoryId?: string;
  dishCategoryName?: string;
  dishFamilyName?: string;
  savedCount: number;
  savedByUserIds: string[];
  likeCount: number;
  likedByUserIds: string[];
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
}

/** Minimal shape for feed card: image, author, dish name, like/save counts and state. */
export type FeedDishItem = Pick<
  Dish,
  "id" | "name" | "image" | "restaurantName" | "savedCount" | "savedByUserIds" | "likeCount" | "likedByUserIds"
> & { restaurantId: Dish["restaurantId"] };
