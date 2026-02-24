import { useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useUserStore } from "@/src/features/user/state";
import { getRestaurantSignature } from "../services";

export function SavedDishesScreen() {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.currentUser);
  const dishes = useDishStore((s) => s.dishes);

  const savedDishes = useMemo(
    () =>
      dishes.filter(
        (dish) =>
          currentUser.savedDishIds.includes(dish.id) && !dish.isArchived
      ),
    [dishes, currentUser.savedDishIds]
  );

  const renderItem = ({
    item: dish,
    index,
  }: {
    item: (typeof savedDishes)[0];
    index: number;
  }) => {
    const signature = getRestaurantSignature(dishes, dish.restaurantId);
    const isSignature = signature?.id === dish.id;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 60).springify().damping(15)}
      >
        <DishCard
          dish={dish}
          onPress={() =>
            router.push({ pathname: "/dish/[id]", params: { id: dish.id } })
          }
          isSignature={isSignature}
        />
      </Animated.View>
    );
  };

  const header = (
    <View className="flex-row items-center border-b border-gray-100 bg-white px-2 pb-3 pt-2">
      <Pressable
        onPress={() => router.back()}
        className="mr-2 h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={28} color="#111827" />
      </Pressable>
      <View>
        <Text className="text-2xl font-bold text-black">Saved</Text>
        {savedDishes.length > 0 && (
          <Text className="mt-1 text-base text-gray-500">
            {savedDishes.length} {savedDishes.length === 1 ? "dish" : "dishes"} saved
          </Text>
        )}
      </View>
    </View>
  );

  if (savedDishes.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        {header}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-gray-500">
            You haven&apos;t saved any dishes yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {header}
      <FlatList
        data={savedDishes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
