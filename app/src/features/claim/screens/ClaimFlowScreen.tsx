import { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { AnimatedPressable } from "@/src/shared/components";
import { fetchRestaurantById, submitClaim } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";
import type { Restaurant } from "@/src/features/restaurant/types";

export function ClaimFlowScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadRestaurants = useRestaurantStore((s) => s.loadRestaurants);
  const updateRestaurant = useRestaurantStore((s) => s.updateRestaurant);
  const currentUser = useUserStore((s) => s.currentUser);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load restaurant.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const handleSubmit = async () => {
    if (!restaurant || !restaurantId) return;
    setError(null);
    setSubmitting(true);
    try {
      const updated = await submitClaim(config.apiBaseUrl, restaurantId);
      if (!isMounted.current) return;
      updateRestaurant(updated);
      await loadRestaurants();
      if (!isMounted.current) return;
      router.replace("/(tabs)/profile");
    } catch (e) {
      if (isMounted.current)
        setError(e instanceof Error ? e.message : "Claim failed. Please try again.");
    } finally {
      if (isMounted.current) setSubmitting(false);
    }
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
          <Text className="text-center text-gray-600">
            {error ?? "Restaurant not found."}
          </Text>
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
            Confirm ownership
          </Text>
          <Text className="mt-2 text-sm text-gray-600">
            I confirm that I represent this restaurant and have the right to
            claim it.
          </Text>
        </View>

        <AnimatedPressable
          onPress={handleSubmit}
          disabled={submitting}
          scale={0.98}
          className="mt-10 flex-row items-center justify-center rounded-xl bg-orange-500 py-3 disabled:opacity-60"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Submit Claim
            </Text>
          )}
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}
