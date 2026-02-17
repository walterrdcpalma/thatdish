import { create } from "zustand";
import type { ClaimStatus, Restaurant } from "../types/restaurant.types";

// Picsum: always returns a valid image. seed = consistent image per restaurant.
const RESTAURANT_IMG = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/320`;

const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: "1", name: "Joe's Tavern", location: "Lisbon, Portugal", signatureDishId: null, ownerUserId: null, claimStatus: "unclaimed", imageUrl: RESTAURANT_IMG("rest-1-joes") },
  { id: "2", name: "Flavor Corner", location: "Porto, Portugal", signatureDishId: null, ownerUserId: null, claimStatus: "unclaimed", imageUrl: RESTAURANT_IMG("rest-2-flavor") },
  { id: "3", name: "Front Table", location: "Lisbon, Portugal", signatureDishId: null, ownerUserId: null, claimStatus: "unclaimed", imageUrl: RESTAURANT_IMG("rest-3-front") },
];

interface RestaurantStore {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Restaurant) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  claimRestaurant: (restaurantId: string, userId: string) => void;
  setSignatureDish: (restaurantId: string, dishId: string) => void;
  setClaimStatus: (restaurantId: string, claimStatus: ClaimStatus) => void;
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
          claimStatus: restaurant.claimStatus ?? "unclaimed",
          imageUrl: restaurant.imageUrl,
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
