import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMockDishById, getMockDishes, getRestaurantSignature } from "../services";

export function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dish = id ? getMockDishById(id) : undefined;
  const signature = dish
    ? getRestaurantSignature(getMockDishes(), dish.restaurantId)
    : undefined;
  const isSignature = dish && signature?.id === dish.id;

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
        <Text className="mt-1 text-base text-gray-600">{dish.restaurantName}</Text>
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
