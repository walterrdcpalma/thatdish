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
  savedCount: number;
  savedByUserIds: string[];
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
}
