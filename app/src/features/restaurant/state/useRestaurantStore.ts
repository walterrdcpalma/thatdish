import { create } from "zustand";
import type { Restaurant } from "../types/restaurant.types";
import { fetchRestaurants } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";

interface RestaurantStore {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  loadRestaurants: () => Promise<void>;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  setSignatureDish: (restaurantId: string, dishId: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  loading: false,
  error: null,

  loadRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const restaurants = await fetchRestaurants(config.apiBaseUrl);
      set({ restaurants, loading: false, error: null });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to load restaurants.";
      set({ error: message, loading: false });
    }
  },

  addRestaurant: (restaurant: Restaurant) =>
    set((state) => ({
      restaurants: [
        ...state.restaurants,
        {
          ...restaurant,
          signatureDishId: restaurant.signatureDishId ?? null,
          ownerUserId: restaurant.ownerUserId ?? null,
          claimedByUserId: restaurant.claimedByUserId ?? null,
          ownershipType: restaurant.ownershipType ?? "Community",
          claimStatus: restaurant.claimStatus ?? "None",
        },
      ],
    })),

  updateRestaurant: (restaurant: Restaurant) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurant.id ? { ...r, ...restaurant } : r
      ),
    })),

  getRestaurantById: (id: string) =>
    get().restaurants.find((r) => r.id === id),

  setSignatureDish: (restaurantId: string, dishId: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, signatureDishId: dishId } : r
      ),
    })),
}));
