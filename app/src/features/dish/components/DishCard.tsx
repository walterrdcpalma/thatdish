import { View, Text, Pressable, Image } from "react-native";
import type { Dish } from "../types";

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
}

export function DishCard({ dish, onPress }: DishCardProps) {
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
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-xl font-bold text-white">{dish.name}</Text>
          <Text className="mt-1 text-sm text-white/90">{dish.restaurantName}</Text>
          <View className="mt-2 flex-row items-center justify-between">
            <View className="rounded-full bg-amber-400/95 px-3 py-1.5 flex-row items-center">
              <Text className="text-sm font-bold text-black">★ 4.5</Text>
              <Text className="ml-1 text-xs text-gray-700">({dish.savedCount})</Text>
            </View>
            <View className="h-8 w-8 items-center justify-center">
              <Text className="text-white">🔖</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
