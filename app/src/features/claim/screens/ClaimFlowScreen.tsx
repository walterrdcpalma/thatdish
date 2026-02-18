import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { AnimatedPressable } from "@/src/shared/components";
import { fetchRestaurantById } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";
import type { Restaurant } from "@/src/features/restaurant/types";

export function ClaimFlowScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const claimRestaurant = useRestaurantStore((s) => s.claimRestaurant);
  const currentUser = useUserStore((s) => s.currentUser);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchRestaurantById(config.apiBaseUrl, restaurantId)
      .then((r) => {
        if (!cancelled) setRestaurant(r);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load restaurant.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const handleSubmit = () => {
    if (!restaurant || !restaurantId) return;
    claimRestaurant(restaurantId, currentUser.id);
    router.replace("/(tabs)/profile");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center p-4">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      </SafeAreaView>
    );
  }
  if (error || !restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-center text-gray-600">{error ?? "Restaurant not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text className="text-xl font-bold text-black">Claim Restaurant</Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      >
        <Text className="text-base font-semibold text-gray-700">
          {restaurant.name}
        </Text>

        <View className="mt-8">
          <Text className="text-sm font-semibold text-gray-700">
            Step 1: Confirm ownership
          </Text>
          <Text className="mt-2 text-sm text-gray-600">
            I confirm that I represent this restaurant and have the right to
            claim it.
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-700">
            Step 2: Simulate verification
          </Text>
          <Text className="mt-2 text-sm text-gray-600">
            Verification is simulated. No backend or real verification is
            performed.
          </Text>
        </View>

        <AnimatedPressable
          onPress={handleSubmit}
          scale={0.98}
          className="mt-10 flex-row items-center justify-center rounded-xl bg-orange-500 py-3"
        >
          <Text className="text-base font-semibold text-white">
            Submit Claim
          </Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}
