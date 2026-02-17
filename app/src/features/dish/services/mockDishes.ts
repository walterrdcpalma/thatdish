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
    createdAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "4",
    name: "Grilled Sardines",
    restaurantId: "1",
    restaurantName: "Joe's Tavern",
    savedCount: 64,
    createdAt: "2024-01-20T12:00:00Z",
  },
  {
    id: "5",
    name: "Caldo Verde",
    restaurantId: "1",
    restaurantName: "Joe's Tavern",
    savedCount: 42,
    createdAt: "2024-02-01T12:00:00Z",
  },
  {
    id: "2",
    name: "House Burger",
    restaurantId: "2",
    restaurantName: "Flavor Corner",
    savedCount: 89,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "6",
    name: "Fish Tacos",
    restaurantId: "2",
    restaurantName: "Flavor Corner",
    savedCount: 55,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "7",
    name: "Caesar Salad",
    restaurantId: "2",
    restaurantName: "Flavor Corner",
    savedCount: 31,
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Bacalhau a Bras",
    restaurantId: "3",
    restaurantName: "Front Table",
    savedCount: 256,
    createdAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "8",
    name: "Octopus Rice",
    restaurantId: "3",
    restaurantName: "Front Table",
    savedCount: 112,
    createdAt: "2024-01-25T14:00:00Z",
  },
  {
    id: "9",
    name: "Pastel de Nata",
    restaurantId: "3",
    restaurantName: "Front Table",
    savedCount: 88,
    createdAt: "2024-02-05T14:00:00Z",
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
