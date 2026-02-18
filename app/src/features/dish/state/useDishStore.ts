import { create } from "zustand";
import type { Dish } from "../types";
import { canEditDish } from "../services/canEditDish";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { fetchDishes } from "@/src/shared/api/dishesApi";
import { config } from "@/src/config";

interface DishStore {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  loadDishes: () => Promise<void>;
  toggleSave: (dishId: string) => void;
  addDish: (dish: Dish) => void;
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

  toggleSave: (dishId: string) => {
    const userStore = useUserStore.getState();
    const { currentUser } = userStore;
    const isSaved = currentUser.savedDishIds.includes(dishId);
    userStore.toggleSavedDish(dishId);
    set((state) => {
      const nextDishes = state.dishes.map((d) => {
        if (d.id !== dishId) return d;
        const savedByUserIds = isSaved
          ? (d.savedByUserIds ?? []).filter((uid) => uid !== currentUser.id)
          : [...(d.savedByUserIds ?? []), currentUser.id];
        return {
          ...d,
          savedByUserIds,
          savedCount: savedByUserIds.length,
        };
      });
      return { dishes: nextDishes };
    });
  },

  addDish: (dish: Dish) =>
    set((state) => ({
      dishes: [
        ...state.dishes,
        {
          ...dish,
          isArchived: dish.isArchived ?? false,
          savedByUserIds: dish.savedByUserIds ?? [],
          updatedAt: dish.updatedAt ?? dish.createdAt,
          lastEditedByUserId: dish.lastEditedByUserId ?? null,
        },
      ],
    })),

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
          next.savedByUserIds = [];
          next.savedCount = 0;
        }
        return next;
      }),
    }));
  },
}));
