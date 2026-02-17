import { create } from "zustand";
import type { Restaurant } from "../types/restaurant.types";

const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Joe's Tavern", location: "Lisbon, Portugal" },
  { id: "2", name: "Flavor Corner", location: "Porto, Portugal" },
  { id: "3", name: "Front Table", location: "Lisbon, Portugal" },
];

interface RestaurantStore {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Restaurant) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [...INITIAL_RESTAURANTS],

  addRestaurant: (restaurant: Restaurant) =>
    set((state) => ({
      restaurants: [...state.restaurants, restaurant],
    })),

  getRestaurantById: (id: string) =>
    get().restaurants.find((r) => r.id === id),
}));
