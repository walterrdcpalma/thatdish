export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  imagePlaceholder?: string;
  savedCount: number;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
}
