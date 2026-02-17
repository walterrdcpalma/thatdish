import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { getRestaurantSignature } from "../services";

export function DishFeedScreen() {
  const router = useRouter();
  const dishes = useDishStore((s) => s.dishes);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 pt-2 pb-3">
        <View>
          <Text className="text-2xl font-bold text-black">Discover</Text>
          <Text className="mt-1 text-base text-gray-500">
            What are you eating today?
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/saved")}
          className="rounded-full p-2 active:opacity-70"
          hitSlop={8}
        >
          <Ionicons name="bookmark" size={24} color="#f97316" />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
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
      <Pressable
        onPress={() => router.push("/dish/create")}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg active:opacity-90"
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
