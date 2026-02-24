import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurantStore } from "../state";
import { useDishStore } from "@/src/features/dish/state";
import { useUserStore } from "@/src/features/user/state";
import { getSignatureDish } from "../services";
import { formatRestaurantLocation } from "../utils/formatRestaurantLocation";
import { isLatLngValid } from "@/src/shared/utils/openDirections";
import { AnimatedPressable } from "@/src/shared/components";
import { fetchRestaurantById } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";
import type { Restaurant } from "../types";

const MAX_RESTAURANT_PHOTOS = 3;

export function RestaurantDetailScreen() {
  const params = useLocalSearchParams<{ id: string; from?: string }>();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const from = params.from;
  const router = useRouter();
  const fromMyRestaurants = from === "my-restaurants";
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setSignatureDish = useRestaurantStore((s) => s.setSignatureDish);
  const dishes = useDishStore((s) => s.dishes);
  const restoreDish = useDishStore((s) => s.restoreDish);
  const currentUser = useUserStore((s) => s.currentUser);

  // When this screen opens (e.g. after "View Restaurant" on dish detail), fetch restaurant by id via GET /api/restaurants/{id}
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRestaurantById(config.apiBaseUrl, id)
      .then((r) => {
        if (!cancelled) {
          setRestaurant(r);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load restaurant.");
          setRestaurant(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const signature = restaurant
    ? getSignatureDish(restaurant.id, [restaurant], dishes)
    : undefined;
  const restaurantDishes = restaurant
    ? dishes
        .filter(
          (d) => d.restaurantId === restaurant.id && !d.isArchived
        )
        .slice(0, MAX_RESTAURANT_PHOTOS)
    : [];
  const mainDish =
    signature && restaurantDishes.some((d) => d.id === signature.id)
      ? restaurantDishes.find((d) => d.id === signature.id)
      : restaurantDishes[0];
  const otherDishes = restaurantDishes
    .filter((d) => d.id !== mainDish?.id)
    .slice(0, 2);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-center text-gray-600">{error}</Text>
      </View>
    );
  }
  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-100 px-4 py-2">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.98}
          className="mr-2 flex-row items-center gap-2 py-2"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-base text-gray-700">Back</Text>
        </AnimatedPressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="p-5">
          <Text className="text-2xl font-bold text-black">{restaurant.name}</Text>
          <View className="mt-4">
            <Text className="text-sm font-semibold text-gray-500">
              Location
            </Text>
            <Text className="mt-1 text-base text-gray-600">
              {formatRestaurantLocation(restaurant) ?? "Location not available"}
            </Text>
            {restaurant.latitude != null &&
              restaurant.longitude != null &&
              isLatLngValid(restaurant.latitude, restaurant.longitude) && (
                <AnimatedPressable
                  onPress={() =>
                    router.push({
                      pathname: "/restaurant-map",
                      params: {
                        id: restaurant.id,
                        lat: String(restaurant.latitude),
                        lng: String(restaurant.longitude),
                        name: restaurant.name,
                        locationLabel:
                          formatRestaurantLocation(restaurant) ?? "",
                      },
                    })
                  }
                  scale={0.98}
                  className="mt-3 self-start rounded-lg border border-orange-200 bg-orange-50 px-3 py-2"
                >
                  <View className="flex-row items-center" style={{ gap: 10 }}>
                    <Ionicons name="map" size={18} color="#c2410c" />
                    <Text className="text-sm font-medium text-orange-700">
                      View on map
                    </Text>
                  </View>
                </AnimatedPressable>
              )}
          </View>
          <View className="mt-4 flex-row flex-wrap items-center gap-2">
            <View className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <Text className="text-sm text-gray-600">
                {restaurant.ownershipType === "OwnerManaged" ? "Owner" : "Community"}
              </Text>
            </View>
            {(restaurant.claimStatus === "None" || restaurant.claimStatus === "Rejected") && (
              <AnimatedPressable
                onPress={() =>
                  router.push({
                    pathname: "/claim/[restaurantId]",
                    params: { restaurantId: restaurant.id },
                  })
                }
                scale={0.98}
                className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2"
              >
                <Text className="text-sm font-medium text-orange-700">
                  Claim Restaurant
                </Text>
              </AnimatedPressable>
            )}
          </View>
        </View>
        <View className="px-4">
          {mainDish && (
            <View className="mb-3">
              <AnimatedPressable
                onPress={() =>
                  router.push({
                    pathname: "/dish/[id]",
                    params: {
                      id: mainDish.id,
                      ...(fromMyRestaurants && { from: "my-restaurants" }),
                      fromRestaurant: "1",
                    },
                  })
                }
                className="overflow-hidden rounded-2xl bg-gray-200"
              >
                <View className="relative aspect-[4/3] w-full">
                  <Image
                    source={{
                      uri:
                        mainDish.image
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/30" />
                  {signature?.id === mainDish.id && (
                    <View className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1">
                      <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                        House Special
                      </Text>
                    </View>
                  )}
                  <View className="absolute bottom-0 left-0 right-0 p-3">
                    <Text className="text-base font-bold text-white">
                      {mainDish.name}
                    </Text>
                  </View>
                </View>
              </AnimatedPressable>
              {restaurant.ownerUserId === currentUser.id && (
                <AnimatedPressable
                  onPress={() => setSignatureDish(restaurant.id, mainDish.id)}
                  scale={0.98}
                  className="mt-2 rounded-lg border border-gray-300 bg-white py-2"
                >
                  <Text className="text-center text-xs font-medium text-gray-700">
                    Set as Signature
                  </Text>
                </AnimatedPressable>
              )}
            </View>
          )}
          <View className="flex-row gap-2">
            {otherDishes.map((dish) => (
              <View key={dish.id} className="flex-1">
                <AnimatedPressable
                  onPress={() =>
                    router.push({
                      pathname: "/dish/[id]",
                      params: {
                        id: dish.id,
                        ...(fromMyRestaurants && { from: "my-restaurants" }),
                        fromRestaurant: "1",
                      },
                    })
                  }
                  className="overflow-hidden rounded-2xl bg-gray-200"
                >
                  <View className="relative aspect-square w-full">
                    <Image
                      source={{
                        uri:
                          dish.image
                      }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/30" />
                    <View className="absolute bottom-0 left-0 right-0 p-2">
                      <Text className="text-sm font-bold text-white" numberOfLines={1}>
                        {dish.name}
                      </Text>
                    </View>
                  </View>
                </AnimatedPressable>
                {restaurant.ownerUserId === currentUser.id && (
                  <AnimatedPressable
                    onPress={() => setSignatureDish(restaurant.id, dish.id)}
                    scale={0.98}
                    className="mt-2 rounded-lg border border-gray-300 bg-white py-2"
                  >
                    <Text className="text-center text-xs font-medium text-gray-700">
                      Set as Signature
                    </Text>
                  </AnimatedPressable>
                )}
              </View>
            ))}
          </View>
        </View>

        {restaurant.claimStatus === "Verified" &&
          (restaurant.ownerUserId === currentUser.id || restaurant.claimedByUserId === currentUser.id) && (
            <View className="mt-6 px-4">
              <Text className="mb-3 text-sm font-semibold text-gray-500">
                Archived Dishes
              </Text>
              {dishes
                .filter(
                  (d) =>
                    d.restaurantId === restaurant.id && d.isArchived
                )
                .map((dish) => (
                  <View
                    key={dish.id}
                    className="mb-3 flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <AnimatedPressable
                      onPress={() =>
                        router.push({
                          pathname: "/dish/[id]",
                          params: {
                            id: dish.id,
                            ...(fromMyRestaurants && { from: "my-restaurants" }),
                            fromRestaurant: "1",
                          },
                        })
                      }
                      scale={0.99}
                      className="mr-3 flex-1 flex-row items-center"
                    >
                      <Image
                        source={{
                          uri: getDisplayImageUrl(dish.image, config.apiBaseUrl),
                        }}
                        className="h-14 w-14 rounded-lg bg-gray-200"
                        resizeMode="cover"
                      />
                      <Text
                        className="ml-3 flex-1 text-base text-gray-800"
                        numberOfLines={1}
                      >
                        {dish.name}
                      </Text>
                    </AnimatedPressable>
                    {dish.createdByUserId === currentUser.id ? (
                      <AnimatedPressable
                        onPress={() => restoreDish(dish.id)}
                        scale={0.98}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5"
                      >
                        <Text className="text-sm font-medium text-gray-700">
                          Restore
                        </Text>
                      </AnimatedPressable>
                    ) : (
                      <Text className="text-xs text-gray-400">
                        Only creator can restore
                      </Text>
                    )}
                  </View>
                ))}
              {dishes.filter(
                (d) => d.restaurantId === restaurant.id && d.isArchived
              ).length === 0 && (
                <Text className="text-sm text-gray-400">
                  No archived dishes for this restaurant.
                </Text>
              )}
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
