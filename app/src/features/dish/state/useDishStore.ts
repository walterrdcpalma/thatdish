import { create } from "zustand";
import type { Dish } from "../types";
import { canEditDish } from "../services/canEditDish";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import {
  createDish as createDishApi,
  fetchDishes,
  likeDish as likeDishApi,
  unlikeDish as unlikeDishApi,
} from "@/src/shared/api/dishesApi";
import { config } from "@/src/config";

interface DishStore {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  loadDishes: () => Promise<void>;
  createDish: (name: string, restaurantName: string, foodType?: string, image?: string) => Promise<Dish>;
  toggleSave: (dishId: string) => void;
  /** Client-side only; no API. */
  toggleLike: (dishId: string) => void;
  archiveDish: (dishId: string) => void;
  restoreDish: (dishId: string) => void;
  updateDish: (
    dishId: string,
    updates: Partial<Pick<Dish, "name" | "image">>
  ) => void;
}

export const useDishStore = create<DishStore>((set, get) => ({
  dishes: [],
  loading: false,
  error: null,

  loadDishes: async () => {
    set({ loading: true, error: null });
    try {
      const dishes = await fetchDishes(config.apiBaseUrl);
      set({ dishes, loading: false, error: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load dishes.";
      set({ error: message, loading: false });
    }
  },

  createDish: async (name: string, restaurantName: string, foodType?: string, image?: string) => {
    const dish = await createDishApi(config.apiBaseUrl, { name, restaurantName, foodType, image });
    set((state) => ({ dishes: [dish, ...state.dishes] }));
    return dish;
  },

  toggleSave: (dishId: string) => {
    const userStore = useUserStore.getState();
    const { currentUser } = userStore;
    const isSaved = currentUser.savedDishIds.includes(dishId);
    userStore.toggleSavedDish(dishId);
    set((state) => ({
      dishes: state.dishes.map((d) => {
        if (d.id !== dishId) return d;
        const delta = isSaved ? -1 : 1;
        return {
          ...d,
          savesCount: Math.max(0, (d.savesCount ?? 0) + delta),
          isSavedByCurrentUser: !isSaved,
        };
      }),
    }));
  },

  toggleLike: (dishId: string) => {
    const userStore = useUserStore.getState();
    const currentUser = userStore.currentUser;
    if (!currentUser) return;

    const dish = get().dishes.find((d) => d.id === dishId);
    if (!dish) return;

    const isLiked = currentUser.likedDishIds.includes(dishId);

    // UNLIKE: already liked → remove from user and decrement (never below 0)
    if (isLiked) {
      const prevLikedIds = currentUser.likedDishIds;
      const prevLikeCount = dish.likesCount ?? 0;
      userStore.toggleLikedDish(dishId);
      set((state) => ({
        dishes: state.dishes.map((d) => {
          if (d.id !== dishId) return d;
          return { ...d, likesCount: Math.max(0, prevLikeCount - 1) };
        }),
      }));
      unlikeDishApi(config.apiBaseUrl, dishId).catch(() => {
        useUserStore.setState((s) => ({
          currentUser: { ...s.currentUser, likedDishIds: prevLikedIds },
        }));
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === dishId ? { ...d, likesCount: prevLikeCount } : d
          ),
        }));
      });
      return;
    }

    // LIKE: not liked → add to user and increment (avoid double-add)
    const prevLikedIds = currentUser.likedDishIds;
    const prevLikeCount = dish.likesCount ?? 0;
    userStore.toggleLikedDish(dishId);
    set((state) => ({
      dishes: state.dishes.map((d) => {
        if (d.id !== dishId) return d;
        return { ...d, likesCount: prevLikeCount + 1 };
      }),
    }));
    likeDishApi(config.apiBaseUrl, dishId).catch(() => {
      useUserStore.setState((s) => ({
        currentUser: { ...s.currentUser, likedDishIds: prevLikedIds },
      }));
      set((state) => ({
        dishes: state.dishes.map((d) =>
          d.id === dishId ? { ...d, likesCount: prevLikeCount } : d
        ),
      }));
    });
  },

  archiveDish: (dishId: string) => {
    const { currentUser } = useUserStore.getState();
    const dish = get().dishes.find((d) => d.id === dishId);
    if (!dish || dish.createdByUserId !== currentUser.id) return;
    set((state) => ({
      dishes: state.dishes.map((d) =>
        d.id === dishId ? { ...d, isArchived: true } : d
      ),
    }));
  },

  restoreDish: (dishId: string) => {
    const { currentUser } = useUserStore.getState();
    const dish = get().dishes.find((d) => d.id === dishId);
    if (!dish || dish.createdByUserId !== currentUser.id) return;
    set((state) => ({
      dishes: state.dishes.map((d) =>
        d.id === dishId ? { ...d, isArchived: false } : d
      ),
    }));
  },

  updateDish: (
    dishId: string,
    updates: Partial<Pick<Dish, "name" | "image">>
  ) => {
    const { currentUser } = useUserStore.getState();
    const restaurants = useRestaurantStore.getState().restaurants;
    const dish = get().dishes.find((d) => d.id === dishId);
    if (!dish) return;
    const restaurant = restaurants.find((r) => r.id === dish.restaurantId);
    if (!canEditDish(dish, restaurant, currentUser)) return;

    const now = new Date().toISOString();
    const nameChanged =
      updates.name !== undefined &&
      updates.name.trim() !== dish.name.trim();

    if (nameChanged) {
      const userStore = useUserStore.getState();
      if (userStore.currentUser.savedDishIds.includes(dishId)) {
        userStore.toggleSavedDish(dishId);
      }
    }

    set((state) => ({
      dishes: state.dishes.map((d) => {
        if (d.id !== dishId) return d;
        const next: Dish = {
          ...d,
          ...updates,
          updatedAt: now,
          lastEditedByUserId: currentUser.id,
        };
        if (nameChanged) {
          next.savesCount = Math.max(0, (next.savesCount ?? 0) - 1);
          next.isSavedByCurrentUser = false;
        }
        return next;
      }),
    }));
  },
}));
