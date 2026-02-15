// Matches backend DishListDto and FoodType enum
export type FoodType =
  | 'Other'
  | 'Pasta'
  | 'Grill'
  | 'Seafood'
  | 'Vegan'
  | 'Vegetarian'
  | 'StreetFood'
  | 'Traditional'
  | 'FineDining'
  | 'Breakfast'
  | 'Dessert'
  | 'Soup'
  | 'Rice'
  | 'Sandwich'
  | 'Pizza';

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  foodType: FoodType;
  isMainDish: boolean;
  restaurantName: string;
  restaurantId: string;
}

// All filter options for the UI (All + each FoodType except Other)
export const FOOD_TYPE_FILTERS: { value: FoodType | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'Pasta', label: 'Pasta' },
  { value: 'Grill', label: 'Grill' },
  { value: 'Seafood', label: 'Seafood' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'StreetFood', label: 'Street food' },
  { value: 'Traditional', label: 'Traditional' },
  { value: 'FineDining', label: 'Fine dining' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Soup', label: 'Soup' },
  { value: 'Rice', label: 'Rice' },
  { value: 'Sandwich', label: 'Sandwich' },
  { value: 'Pizza', label: 'Pizza' },
];
