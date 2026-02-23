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
  likesCount: number;
  savesCount: number;
  ratingsCount: number;
  averageRating: number;
  /** Set when API has current user context. */
  isLikedByCurrentUser?: boolean | null;
  isSavedByCurrentUser?: boolean | null;
  myRating?: number | null;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
}

/** Minimal shape for feed card: image, author, dish name, like/save counts and state. */
export type FeedDishItem = Pick<
  Dish,
  "id" | "name" | "image" | "restaurantName" | "savesCount" | "likesCount" | "isLikedByCurrentUser" | "isSavedByCurrentUser"
> & { restaurantId: Dish["restaurantId"] };
