import { create } from "zustand";
import type { Dish } from "../types";
import { MOCK_DISHES } from "../services/mockDishes";
import { useUserStore } from "@/src/features/user/state";

interface DishStore {
  dishes: Dish[];
  toggleSave: (dishId: string) => void;
  addDish: (dish: Dish) => void;
  archiveDish: (dishId: string) => void;
  restoreDish: (dishId: string) => void;
  updateDish: (dishId: string, updates: Partial<Pick<Dish, "name">>) => void;
}

const initialDishes: Dish[] = MOCK_DISHES.map((d) => ({ ...d }));

export const useDishStore = create<DishStore>((set, get) => ({
  dishes: initialDishes,

  toggleSave: (dishId: string) => {
    const userStore = useUserStore.getState();
    const isSaved = userStore.currentUser.savedDishIds.includes(dishId);
    userStore.toggleSavedDish(dishId);
    set((state) => {
      const delta = isSaved ? -1 : 1;
      const nextDishes = state.dishes.map((d) =>
        d.id === dishId
          ? { ...d, savedCount: Math.max(0, d.savedCount + delta) }
          : d
      );
      return { dishes: nextDishes };
    });
  },

  addDish: (dish: Dish) =>
    set((state) => ({
      dishes: [...state.dishes, { ...dish, isArchived: dish.isArchived ?? false }],
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

  updateDish: (dishId: string, updates: Partial<Pick<Dish, "name">>) => {
    const { currentUser } = useUserStore.getState();
    const dish = get().dishes.find((d) => d.id === dishId);
    if (!dish || dish.createdByUserId !== currentUser.id) return;
    set((state) => ({
      dishes: state.dishes.map((d) =>
        d.id === dishId ? { ...d, ...updates } : d
      ),
    }));
  },
}));
