import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { getRestaurantSignature } from "../services";

export function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dishes = useDishStore((s) => s.dishes);
  const toggleSave = useDishStore((s) => s.toggleSave);
  const currentUser = useUserStore((s) => s.currentUser);
  const dish = id ? dishes.find((d) => d.id === id) : undefined;
  const restaurantName = dish
    ? useRestaurantStore((s) =>
        s.restaurants.find((r) => r.id === dish.restaurantId)?.name
      )
    : undefined;
  const signature = dish
    ? getRestaurantSignature(dishes, dish.restaurantId)
    : undefined;
  const isSignature = dish && signature?.id === dish.id;
  const isSaved = dish ? currentUser.savedDishIds.includes(dish.id) : false;

  if (!dish) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">Dish not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="relative h-72 w-full overflow-hidden bg-gray-200">
        <Image
          source={{ uri: "https://placehold.co/400x288/gray/white?text=Dish" }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {isSignature && (
          <View className="absolute right-3 top-3 rounded-full bg-black/60 px-4 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-white">
              Especialidade da Casa
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 p-5">
        <Text className="text-2xl font-bold text-black">{dish.name}</Text>
        <Text className="mt-1 text-base text-gray-600">{restaurantName ?? "Unknown"}</Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">{dish.savedCount} saved</Text>
          <Pressable
            onPress={() => toggleSave(dish.id)}
            className="flex-row items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 active:opacity-80"
          >
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#f97316"
            />
            <Text className="text-sm font-medium text-gray-700">
              {isSaved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/restaurant/[id]",
              params: { id: dish.restaurantId },
            })
          }
          className="mt-6 rounded-xl bg-orange-500 py-3.5 active:opacity-90"
        >
          <Text className="text-center font-semibold text-white">
            View Restaurant
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
