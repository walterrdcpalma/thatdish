import { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { getRestaurantSignature } from "../services";
import { getRankedDishes } from "../utils/getRankedDishes";
import { getNearbyRankedDishes } from "../utils/getNearbyRankedDishes";
import { getDishBadges } from "../utils/getDishBadges";
import { getDistanceInKm } from "../utils/getDistanceInKm";
import { AnimatedPressable } from "@/src/shared/components";

type DiscoverTab = "All" | "Nearby";

export function DishFeedScreen() {
  const router = useRouter();
  const allDishes = useDishStore((s) => s.dishes);
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const [tab, setTab] = useState<DiscoverTab>("All");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  // Request location on mount so we can show "Nearby" badge in both All and Nearby tabs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== "granted") {
        setUserLocation(null);
        setLocationDenied(true);
        return;
      }
      setLocationDenied(false);
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch {
        if (!cancelled) setUserLocation(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rankedByAll = getRankedDishes(allDishes);
  const nearbyDishes =
    tab === "Nearby" && userLocation
      ? getNearbyRankedDishes(
          allDishes,
          restaurants,
          userLocation.lat,
          userLocation.lng
        )
      : null;
  const dishes = tab === "All" ? rankedByAll : nearbyDishes ?? [];
  const showNearbyDeniedMessage =
    tab === "Nearby" && locationDenied && !userLocation;

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
      <View className="flex-row border-b border-gray-100 bg-white px-4 pb-2">
        <AnimatedPressable
          onPress={() => setTab("All")}
          scale={0.98}
          className={`mr-2 rounded-lg px-4 py-2.5 ${tab === "All" ? "bg-gray-900" : "bg-gray-100"}`}
        >
          <Text
            className={`text-sm font-medium ${tab === "All" ? "text-white" : "text-gray-600"}`}
          >
            All
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => setTab("Nearby")}
          scale={0.98}
          className={`rounded-lg px-4 py-2.5 ${tab === "Nearby" ? "bg-gray-900" : "bg-gray-100"}`}
        >
          <Text
            className={`text-sm font-medium ${tab === "Nearby" ? "text-white" : "text-gray-600"}`}
          >
            Nearby
          </Text>
        </AnimatedPressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {showNearbyDeniedMessage && (
          <View className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Text className="text-sm text-amber-800">
              Location permission required to view nearby dishes.
            </Text>
          </View>
        )}
        {dishes.map((dish, index) => {
          const signature = getRestaurantSignature(allDishes, dish.restaurantId);
          const isSignature = signature?.id === dish.id;
          const badges = getDishBadges(dish, allDishes);
          const restaurant = restaurants.find((r) => r.id === dish.restaurantId);
          const isNearby =
            userLocation != null &&
            restaurant?.latitude != null &&
            restaurant?.longitude != null &&
            getDistanceInKm(
              userLocation.lat,
              userLocation.lng,
              restaurant.latitude,
              restaurant.longitude
            ) <= 5;
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
                isNearby={isNearby}
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
