import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { DishCard } from "../components";
import { getMockDishes, getRestaurantSignature } from "../services";

export function DishFeedScreen() {
  const router = useRouter();
  const dishes = getMockDishes();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="border-b border-gray-100 bg-white px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-black">Discover</Text>
        <Text className="mt-1 text-base text-gray-500">
          What are you eating today?
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {dishes.map((dish) => {
          const signature = getRestaurantSignature(dishes, dish.restaurantId);
          const isSignature = signature?.id === dish.id;
          return (
            <DishCard
              key={dish.id}
              dish={dish}
              onPress={() => router.push({ pathname: "/dish/[id]", params: { id: dish.id } })}
              isSignature={isSignature}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
