import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { config } from "@/src/config";
import { fetchMyRestaurants, updateClaimState } from "@/src/shared/api/restaurantsApi";
import type { Restaurant } from "@/src/features/restaurant/types";
import type { ClaimStatus } from "@/src/features/restaurant/types";

function claimStatusLabel(status: ClaimStatus): string {
  switch (status) {
    case "Pending":
      return "Claim Pending";
    case "Verified":
      return "Claim Verified";
    case "Rejected":
      return "Claim Rejected";
    default:
      return "";
  }
}

export function MyRestaurantsScreen() {
  const router = useRouter();
  const [myRestaurants, setMyRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const loadMyRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchMyRestaurants(config.apiBaseUrl);
      setMyRestaurants(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load my restaurants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyRestaurants();
  }, [loadMyRestaurants]);

  const handleSimulate = useCallback(
    async (restaurantId: string, state: "Verified" | "Rejected") => {
      setSimulatingId(restaurantId);
      try {
        await updateClaimState(config.apiBaseUrl, restaurantId, state);
        await loadMyRestaurants();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Simulate failed.");
      } finally {
        setSimulatingId(null);
      }
    },
    [loadMyRestaurants]
  );

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
        <Text className="text-xl font-bold text-black">My Restaurants</Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {loading ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#000" />
            <Text className="mt-3 text-gray-500">Loading my restaurants…</Text>
          </View>
        ) : error ? (
          <View className="py-12 items-center">
            <Text className="text-red-600">{error}</Text>
            <AnimatedPressable
              onPress={loadMyRestaurants}
              className="mt-3 rounded-lg bg-gray-200 px-4 py-2"
            >
              <Text className="text-sm font-medium text-gray-800">Retry</Text>
            </AnimatedPressable>
          </View>
        ) : myRestaurants.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-gray-500">No restaurants claimed yet.</Text>
            <Text className="mt-2 text-sm text-gray-400">
              Claim a restaurant from its detail page.
            </Text>
          </View>
        ) : (
          myRestaurants.map((restaurant, index) => (
            <Animated.View
              key={restaurant.id}
              entering={FadeInDown.delay(index * 60).springify().damping(15)}
            >
              <AnimatedPressable
                onPress={() =>
                  router.push({
                    pathname: "/restaurant/[id]",
                    params: { id: restaurant.id, from: "my-restaurants" },
                  })
                }
                className="mb-3 overflow-hidden rounded-2xl bg-gray-100"
              >
                <View className="relative h-32 w-full overflow-hidden bg-gray-300">
                  <Image
                    source={{
                      uri: restaurant.imageUrl
                        ? restaurant.imageUrl
                        : "https://placehold.co/600x240/gray/white?text=Restaurant",
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-row items-center justify-between p-4">
                  <Text className="text-lg font-semibold text-black flex-1">
                    {restaurant.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
                <View className="px-4 pb-4 flex-row items-center gap-2 flex-wrap">
                  <View className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
                    <Text className="text-sm text-gray-600">
                      {restaurant.ownershipType === "OwnerManaged" ? "Owner" : "Community"}
                    </Text>
                  </View>
                  {restaurant.claimStatus !== "None" && (
                    <View
                      className={`rounded-lg border px-3 py-1.5 ${
                        restaurant.claimStatus === "Verified"
                          ? "border-orange-200 bg-orange-50"
                          : restaurant.claimStatus === "Pending"
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          restaurant.claimStatus === "Verified"
                            ? "text-orange-700"
                            : restaurant.claimStatus === "Pending"
                              ? "text-amber-700"
                              : "text-red-700"
                        }`}
                      >
                        {claimStatusLabel(restaurant.claimStatus)}
                      </Text>
                    </View>
                  )}
                </View>
                {restaurant.claimStatus === "Pending" && (
                  <View className="px-4 pb-4 flex-row items-center gap-2">
                    <Text className="text-sm text-gray-600 mr-2">Simulate Verification:</Text>
                    <AnimatedPressable
                      onPress={(ev) => {
                        ev?.stopPropagation?.();
                        handleSimulate(restaurant.id, "Verified");
                      }}
                      disabled={simulatingId === restaurant.id}
                      className="rounded-lg bg-green-100 border border-green-300 px-3 py-1.5"
                    >
                      {simulatingId === restaurant.id ? (
                        <ActivityIndicator size="small" color="#166534" />
                      ) : (
                        <Text className="text-sm font-medium text-green-800">Approve</Text>
                      )}
                    </AnimatedPressable>
                    <AnimatedPressable
                      onPress={(ev) => {
                        ev?.stopPropagation?.();
                        handleSimulate(restaurant.id, "Rejected");
                      }}
                      disabled={simulatingId === restaurant.id}
                      className="rounded-lg bg-red-100 border border-red-300 px-3 py-1.5"
                    >
                      <Text className="text-sm font-medium text-red-800">Reject</Text>
                    </AnimatedPressable>
                  </View>
                )}
              </AnimatedPressable>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
