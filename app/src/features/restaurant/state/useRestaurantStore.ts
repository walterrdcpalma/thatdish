import { create } from "zustand";
import type { Restaurant } from "../types/restaurant.types";

const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Joe's Tavern", location: "Lisbon, Portugal", signatureDishId: null, ownerUserId: null },
  { id: "2", name: "Flavor Corner", location: "Porto, Portugal", signatureDishId: null, ownerUserId: null },
  { id: "3", name: "Front Table", location: "Lisbon, Portugal", signatureDishId: null, ownerUserId: null },
];

interface RestaurantStore {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Restaurant) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  claimRestaurant: (restaurantId: string, userId: string) => void;
  setSignatureDish: (restaurantId: string, dishId: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [...INITIAL_RESTAURANTS],

  addRestaurant: (restaurant: Restaurant) =>
    set((state) => ({
      restaurants: [
        ...state.restaurants,
        {
          ...restaurant,
          signatureDishId: restaurant.signatureDishId ?? null,
          ownerUserId: restaurant.ownerUserId ?? null,
        },
      ],
    })),

  getRestaurantById: (id: string) =>
    get().restaurants.find((r) => r.id === id),

  claimRestaurant: (restaurantId: string, userId: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, ownerUserId: userId } : r
      ),
    })),

  setSignatureDish: (restaurantId: string, dishId: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, signatureDishId: dishId } : r
      ),
    })),
}));
