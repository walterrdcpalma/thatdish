export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  imagePlaceholder?: string;
  savedCount: number;
  savedByUserIds: string[];
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  lastEditedByUserId: string | null;
  isArchived: boolean;
}
