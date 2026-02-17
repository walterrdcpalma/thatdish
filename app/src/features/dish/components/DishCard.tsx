import { View, Text, Pressable, Image } from "react-native";
import type { Dish } from "../types";

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
  isSignature?: boolean;
}

export function DishCard({ dish, onPress, isSignature }: DishCardProps) {
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
          <Text className="mt-1 text-sm text-white/90">{dish.restaurantName}</Text>
        </View>
      </View>
    </Pressable>
  );
}
