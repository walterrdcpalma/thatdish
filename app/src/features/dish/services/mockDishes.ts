import type { Dish } from "../types";
import type { Restaurant } from "../types";

export const MOCK_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Joe's Tavern", location: "Lisbon, Portugal" },
  { id: "2", name: "Flavor Corner", location: "Porto, Portugal" },
  { id: "3", name: "Front Table", location: "Lisbon, Portugal" },
];

export const MOCK_DISHES: Dish[] = [
  {
    id: "1",
    name: "Piri-Piri Chicken",
    restaurantId: "1",
    restaurantName: "Joe's Tavern",
    savedCount: 128,
  },
  {
    id: "2",
    name: "House Burger",
    restaurantId: "2",
    restaurantName: "Flavor Corner",
    savedCount: 89,
  },
  {
    id: "3",
    name: "Bacalhau a Bras",
    restaurantId: "3",
    restaurantName: "Front Table",
    savedCount: 256,
  },
];

export function getMockDishes(): Dish[] {
  return MOCK_DISHES;
}

export function getMockDishById(id: string): Dish | undefined {
  return MOCK_DISHES.find((d) => d.id === id);
}

export function getMockRestaurantById(id: string): Restaurant | undefined {
  return MOCK_RESTAURANTS.find((r) => r.id === id);
}
