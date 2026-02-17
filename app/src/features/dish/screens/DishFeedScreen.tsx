import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { getRestaurantSignature } from "../services";
import { getRankedDishes } from "../utils/getRankedDishes";
import { getDishBadges } from "../utils/getDishBadges";
import { AnimatedPressable } from "@/src/shared/components";

export function DishFeedScreen() {
  const router = useRouter();
  const allDishes = useDishStore((s) => s.dishes);
  const dishes = getRankedDishes(allDishes);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 pt-2 pb-3">
        <View>
          <Text className="text-2xl font-bold text-black">Discover</Text>
          <Text className="mt-1 text-base text-gray-500">
            What are you eating today?
          </Text>
        </View>
        <AnimatedPressable
          onPress={() => router.push("/(tabs)/saved")}
          scale={0.9}
          className="rounded-full p-2"
          hitSlop={8}
        >
          <Ionicons name="bookmark" size={24} color="#f97316" />
        </AnimatedPressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {dishes.map((dish, index) => {
          const signature = getRestaurantSignature(allDishes, dish.restaurantId);
          const isSignature = signature?.id === dish.id;
          const badges = getDishBadges(dish, allDishes);
          return (
            <Animated.View
              key={dish.id}
              entering={FadeInDown.delay(index * 60).springify().damping(15)}
            >
              <DishCard
                dish={dish}
                onPress={() => router.push({ pathname: "/dish/[id]", params: { id: dish.id } })}
                isSignature={isSignature}
                badges={badges}
              />
            </Animated.View>
          );
        })}
      </ScrollView>
      <AnimatedPressable
        onPress={() => router.push("/dish/create")}
        scale={0.92}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </AnimatedPressable>
    </SafeAreaView>
  );
}
