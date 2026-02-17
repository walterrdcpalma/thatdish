import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getMockRestaurantById } from "@/src/features/dish/services";

export function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = id ? getMockRestaurantById(id) : undefined;

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold text-black">{restaurant.name}</Text>
      <Text className="mt-2 text-base text-gray-600">{restaurant.location}</Text>
      <View className="mt-4 flex-row items-center">
        <View className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <Text className="text-sm text-gray-600">✓ Verified</Text>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
}
