import type { Dish } from "../types";

// Picsum: always returns a valid image. seed = consistent image per dish.
const DISH_IMG = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`;

// u1 = current user (Walter). u2 = other user. My Contributions shows only dishes with createdByUserId === currentUser.id (u1).
export const MOCK_DISHES: Dish[] = [
  {
    id: "1",
    name: "Piri-Piri Chicken",
    restaurantId: "1",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-1-piri-piri"),
    isArchived: false,
  },
  {
    id: "4",
    name: "Grilled Sardines",
    restaurantId: "1",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-4-sardines"),
    isArchived: false,
  },
  {
    id: "5",
    name: "Caldo Verde",
    restaurantId: "1",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-02-01T12:00:00Z",
    updatedAt: "2024-02-01T12:00:00Z",
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-5-caldo"),
    isArchived: false,
  },
  {
    id: "2",
    name: "House Burger",
    restaurantId: "2",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-2-burger"),
    isArchived: false,
  },
  {
    id: "6",
    name: "Fish Tacos",
    restaurantId: "2",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-10T10:00:00Z",
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-6-tacos"),
    isArchived: false,
  },
  {
    id: "7",
    name: "Caesar Salad",
    restaurantId: "2",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-7-salad"),
    isArchived: false,
  },
  {
    id: "3",
    name: "Bacalhau a Bras",
    restaurantId: "3",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-01-20T14:00:00Z",
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-3-bacalhau"),
    isArchived: false,
  },
  {
    id: "8",
    name: "Octopus Rice",
    restaurantId: "3",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-01-25T14:00:00Z",
    updatedAt: "2024-01-25T14:00:00Z",
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-8-octopus"),
    isArchived: false,
  },
  {
    id: "9",
    name: "Pastel de Nata",
    restaurantId: "3",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: "2024-02-05T14:00:00Z",
    updatedAt: "2024-02-05T14:00:00Z",
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-9-nata"),
    isArchived: false,
  },
];

export function getMockDishes(): Dish[] {
  return MOCK_DISHES;
}

export function getMockDishById(id: string): Dish | undefined {
  return MOCK_DISHES.find((d) => d.id === id);
}
