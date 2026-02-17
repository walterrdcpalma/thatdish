import { View, Text, ScrollView, Image } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { getSignatureDish } from "@/src/features/restaurant/services";
import { AnimatedPressable } from "@/src/shared/components";

export function UserContributionsScreen() {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.currentUser);
  const dishes = useDishStore((s) => s.dishes);
  const restoreDish = useDishStore((s) => s.restoreDish);
  const restaurants = useRestaurantStore((s) => s.restaurants);

  const myDishes = dishes.filter(
    (dish) =>
      dish.createdByUserId === currentUser.id && !dish.isArchived
  );
  const myArchivedDishes = dishes.filter(
    (dish) =>
      dish.createdByUserId === currentUser.id && dish.isArchived
  );

  const isEmpty = myDishes.length === 0 && myArchivedDishes.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.9}
          className="mr-3 p-1"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </AnimatedPressable>
        <Text className="text-xl font-bold text-black">My Contributions</Text>
      </View>
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-gray-500">
            You haven&apos;t added any dishes yet.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-2 text-sm font-semibold text-gray-500">
            Active
          </Text>
          {myDishes.length === 0 ? (
            <Text className="mb-4 text-sm text-gray-400">
              No active contributions.
            </Text>
          ) : (
            myDishes.map((dish, index) => {
              const signature = getSignatureDish(
                dish.restaurantId,
                restaurants,
                dishes
              );
              const isSignature = signature?.id === dish.id;
              return (
                <Animated.View
                  key={dish.id}
                  entering={FadeInDown.delay(index * 60).springify().damping(15)}
                >
                  <DishCard
                    dish={dish}
                    onPress={() =>
                      router.push({
                        pathname: "/dish/[id]",
                        params: { id: dish.id },
                      })
                    }
                    isSignature={isSignature}
                  />
                </Animated.View>
              );
            })
          )}

          <Text className="mt-6 mb-2 text-sm font-semibold text-gray-500">
            Archived Dishes
          </Text>
          {myArchivedDishes.length === 0 ? (
            <Text className="text-sm text-gray-400">No archived dishes.</Text>
          ) : (
            myArchivedDishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInDown.delay(index * 60).springify().damping(15)}
                className="mb-4"
              >
                <AnimatedPressable
                  onPress={() =>
                    router.push({
                      pathname: "/dish/[id]",
                      params: { id: dish.id },
                    })
                  }
                  scale={0.99}
                  className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-3"
                >
                  <Image
                    source={{
                      uri:
                        dish.imagePlaceholder ??
                        "https://placehold.co/96/96/gray/white?text=Dish",
                    }}
                    className="h-16 w-16 rounded-lg bg-gray-200"
                    resizeMode="cover"
                  />
                  <Text
                    className="ml-3 flex-1 text-base font-medium text-gray-800"
                    numberOfLines={1}
                  >
                    {dish.name}
                  </Text>
                </AnimatedPressable>
                <AnimatedPressable
                  onPress={() => restoreDish(dish.id)}
                  scale={0.98}
                  className="mt-2 rounded-lg border border-gray-300 bg-white py-2"
                >
                  <Text className="text-center text-sm font-medium text-gray-700">
                    Restore
                  </Text>
                </AnimatedPressable>
              </Animated.View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
