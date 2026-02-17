export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  imagePlaceholder?: string;
  savedCount: number;
  createdAt: string;
  createdByUserId: string;
  isArchived: boolean;
}
