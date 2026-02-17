import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Dish } from "../types";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
  isSignature?: boolean;
}

export function DishCard({ dish, onPress, isSignature }: DishCardProps) {
  const toggleSave = useDishStore((s) => s.toggleSave);
  const currentUser = useUserStore((s) => s.currentUser);
  const isSaved = currentUser.savedDishIds.includes(dish.id);
  const restaurantName =
    useRestaurantStore((s) => s.restaurants.find((r) => r.id === dish.restaurantId)?.name) ??
    "Unknown";

  const handleSavePress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    toggleSave(dish.id);
  };

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm active:opacity-90"
    >
      <View className="relative h-56 w-full overflow-hidden rounded-2xl bg-gray-200">
        <Image
          source={{ uri: "https://placehold.co/400x224/gray/white?text=Dish" }}
          className="h-full w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/40" />
        {isSignature && (
          <View className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5">
            <Text className="text-xs font-semibold uppercase tracking-wide text-white">
              Especialidade da Casa
            </Text>
          </View>
        )}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-xl font-bold text-white">{dish.name}</Text>
          <Text className="mt-1 text-sm text-white/90">{restaurantName}</Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-xs text-white/80">{dish.savedCount} saved</Text>
            <Pressable
              onPress={handleSavePress}
              className="rounded-full bg-white/20 p-2 active:opacity-80"
              hitSlop={8}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={22}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
