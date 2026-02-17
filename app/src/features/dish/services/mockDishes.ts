import type { Dish } from "../types";

// Picsum: always returns a valid image. seed = consistent image per dish.
const DISH_IMG = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`;

const MS_PER_DAY = 24 * 60 * 60 * 1000;
/** ISO string for a moment N days ago (so "last 7 days" works regardless of when the app runs). */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * MS_PER_DAY).toISOString();
}

// u1 = current user (Walter). u2 = other user. My Contributions shows only dishes with createdByUserId === currentUser.id (u1).
// Badges: Top = top 3 by savedCount. Trending = top 5 by trending score among dishes created in last 7 days. New = created in last 7 days.
// We mix old (30d) + high saves → Top; recent (1–5d) + 0 saves → Trending + New; one recent (6d) + 0 saves → only New.
export const MOCK_DISHES: Dish[] = [
  {
    id: "1",
    name: "Piri-Piri Chicken",
    restaurantId: "1",
    savedCount: 5,
    savedByUserIds: ["u2", "u3", "u4", "u5", "u6"],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-1-piri-piri"),
    isArchived: false,
  },
  {
    id: "2",
    name: "House Burger",
    restaurantId: "2",
    savedCount: 3,
    savedByUserIds: ["u2", "u3", "u4"],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-2-burger"),
    isArchived: false,
  },
  {
    id: "3",
    name: "Bacalhau a Bras",
    restaurantId: "3",
    savedCount: 2,
    savedByUserIds: ["u2", "u3"],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-3-bacalhau"),
    isArchived: false,
  },
  {
    id: "4",
    name: "Grilled Sardines",
    restaurantId: "1",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
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
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    createdByUserId: "u1",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-5-caldo"),
    isArchived: false,
  },
  {
    id: "6",
    name: "Fish Tacos",
    restaurantId: "2",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
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
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-7-salad"),
    isArchived: false,
  },
  {
    id: "8",
    name: "Octopus Rice",
    restaurantId: "3",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
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
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-9-nata"),
    isArchived: false,
  },
  {
    id: "10",
    name: "Arroz de Marisco",
    restaurantId: "1",
    savedCount: 0,
    savedByUserIds: [],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(14),
    createdByUserId: "u2",
    lastEditedByUserId: null,
    imagePlaceholder: DISH_IMG("dish-10-arroz"),
    isArchived: false,
  },
];

export function getMockDishes(): Dish[] {
  return MOCK_DISHES;
}

export function getMockDishById(id: string): Dish | undefined {
  return MOCK_DISHES.find((d) => d.id === id);
}
