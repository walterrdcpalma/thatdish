import { create } from "zustand";
import type { ClaimStatus, Restaurant } from "../types/restaurant.types";
import { fetchRestaurants } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";

interface RestaurantStore {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  loadRestaurants: () => Promise<void>;
  addRestaurant: (restaurant: Restaurant) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  claimRestaurant: (restaurantId: string, userId: string) => void;
  setSignatureDish: (restaurantId: string, dishId: string) => void;
  setClaimStatus: (restaurantId: string, claimStatus: ClaimStatus) => void;
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
          claimStatus: restaurant.claimStatus ?? "unclaimed",
          imageUrl: restaurant.imageUrl,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          cuisine: restaurant.cuisine,
        },
      ],
    })),

  getRestaurantById: (id: string) =>
    get().restaurants.find((r) => r.id === id),

  claimRestaurant: (restaurantId: string, userId: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId
          ? { ...r, ownerUserId: userId, claimStatus: "pending" as const }
          : r
      ),
    })),

  setSignatureDish: (restaurantId: string, dishId: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, signatureDishId: dishId } : r
      ),
    })),

  setClaimStatus: (restaurantId: string, claimStatus: ClaimStatus) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === restaurantId ? { ...r, claimStatus } : r
      ),
    })),
}));
