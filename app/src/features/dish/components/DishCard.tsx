import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Dish } from "../types";
import type { DishBadges } from "../utils/getDishBadges";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { AnimatedPressable } from "@/src/shared/components";

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
  isSignature?: boolean;
  badges?: DishBadges;
  isNearby?: boolean;
}

export function DishCard({ dish, onPress, isSignature, badges, isNearby }: DishCardProps) {
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
    <AnimatedPressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <View className="relative h-56 w-full overflow-hidden rounded-2xl bg-gray-200">
        <Image
          source={{
            uri:
              dish.imagePlaceholder ??
              "https://placehold.co/400x224/gray/white?text=Dish",
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/40" />
        <View className="absolute right-3 top-3 flex-row flex-wrap justify-end gap-1.5">
          {isNearby && (
            <View className="rounded-full bg-sky-500/90 px-2.5 py-1">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                Nearby
              </Text>
            </View>
          )}
          {badges?.isTop && (
            <View className="rounded-full bg-amber-500/90 px-2.5 py-1">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                Top
              </Text>
            </View>
          )}
          {!badges?.isTop && badges?.isTrending && (
            <View className="rounded-full bg-orange-500/90 px-2.5 py-1">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                Trending
              </Text>
            </View>
          )}
          {!badges?.isTop && !badges?.isTrending && badges?.isNew && (
            <View className="rounded-full bg-emerald-500/90 px-2.5 py-1">
              <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                New
              </Text>
            </View>
          )}
          {isSignature && (
            <View className="rounded-full bg-black/60 px-3 py-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wide text-white">
                Especialidade da Casa
              </Text>
            </View>
          )}
        </View>
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-xl font-bold text-white">{dish.name}</Text>
          <Text className="mt-1 text-sm text-white/90">{restaurantName}</Text>
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-xs text-white/80">{dish.savedCount} saved</Text>
            <AnimatedPressable
              onPress={handleSavePress}
              scale={0.9}
              className="rounded-full bg-white/20 p-2"
              hitSlop={8}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={22}
                color="white"
              />
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
