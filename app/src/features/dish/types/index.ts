export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  imagePlaceholder?: string;
  savedCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
}
