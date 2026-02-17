import { create } from "zustand";
import type { Dish } from "../types";
import { MOCK_DISHES } from "../services/mockDishes";

interface DishStore {
  dishes: Dish[];
  savedByUser: Record<string, boolean>;
  toggleSave: (dishId: string) => void;
}

const initialDishes: Dish[] = MOCK_DISHES.map((d) => ({ ...d }));

export const useDishStore = create<DishStore>((set) => ({
  dishes: initialDishes,
  savedByUser: {},

  toggleSave: (dishId: string) =>
    set((state) => {
      const isSaved = state.savedByUser[dishId];
      const nextSavedByUser = { ...state.savedByUser, [dishId]: !isSaved };
      const nextDishes = state.dishes.map((d) => {
        if (d.id !== dishId) return d;
        const delta = isSaved ? -1 : 1;
        return { ...d, savedCount: Math.max(0, d.savedCount + delta) };
      });
      return { dishes: nextDishes, savedByUser: nextSavedByUser };
    }),
}));
