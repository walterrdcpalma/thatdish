import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { getSignatureDish } from "@/src/features/restaurant/services";
import { AnimatedPressable } from "@/src/shared/components";
import { fetchMyContributions } from "@/src/shared/api/dishesApi";
import { config } from "@/src/config";
import type { Dish } from "../types";

export function UserContributionsScreen() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const loadRestaurants = useRestaurantStore((s) => s.loadRestaurants);
  const restoreDish = useDishStore((s) => s.restoreDish);

  const loadMyContributions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchMyContributions(config.apiBaseUrl);
      setDishes(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load my contributions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyContributions();
  }, [loadMyContributions]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const myDishes = dishes.filter((d) => !d.isArchived);
  const myArchivedDishes = dishes.filter((d) => d.isArchived);
  const isEmpty = dishes.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.9}
          className="mr-3 flex-row items-center gap-2 py-1"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-base text-gray-700">Back</Text>
        </AnimatedPressable>
        <Text className="text-xl font-bold text-black">My Contributions</Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-3 text-gray-500">Loading…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-red-600">{error}</Text>
          <AnimatedPressable
            onPress={loadMyContributions}
            className="mt-3 rounded-lg bg-gray-200 px-4 py-2"
          >
            <Text className="text-sm font-medium text-gray-800">Retry</Text>
          </AnimatedPressable>
        </View>
      ) : isEmpty ? (
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
                        params: { id: dish.id, from: "contributions" },
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
                      params: { id: dish.id, from: "contributions" },
                    })
                  }
                  scale={0.99}
                  className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-3"
                >
                  <Image
                    source={{
                      uri:
                        dish.image
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
