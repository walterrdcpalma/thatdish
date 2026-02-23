import { create } from "zustand";
import type { User } from "../types/user.types";

const MOCK_USER: User = {
  id: "u1",
  name: "Walter",
  savedDishIds: [],
  likedDishIds: [],
};

interface UserStore {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  toggleSavedDish: (dishId: string) => void;
  toggleLikedDish: (dishId: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: MOCK_USER,

  setCurrentUser: (user: User) => set({ currentUser: user }),

  toggleSavedDish: (dishId: string) =>
    set((state) => {
      const ids = state.currentUser.savedDishIds.includes(dishId)
        ? state.currentUser.savedDishIds.filter((id) => id !== dishId)
        : [...state.currentUser.savedDishIds, dishId];
      return {
        currentUser: { ...state.currentUser, savedDishIds: ids },
      };
    }),

  toggleLikedDish: (dishId: string) =>
    set((state) => {
      const ids = state.currentUser.likedDishIds.includes(dishId)
        ? state.currentUser.likedDishIds.filter((id) => id !== dishId)
        : [...state.currentUser.likedDishIds, dishId];
      return {
        currentUser: { ...state.currentUser, likedDishIds: ids },
      };
    }),
}));
