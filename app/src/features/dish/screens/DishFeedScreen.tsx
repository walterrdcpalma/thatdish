import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { FeedCard } from "../components";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { getRankedDishes } from "../utils/getRankedDishes";
import { getNearbyRankedDishes } from "../utils/getNearbyRankedDishes";
import { getPrimaryBadge } from "../utils/getDishBadges";
import type { PrimaryBadge } from "../utils/getDishBadges";
import { AnimatedPressable } from "@/src/shared/components";
import type { Dish } from "../types";

type DiscoverTab = "All" | "Nearby";

/** Recompute feed order and badges only when data load or tab/location changes — NOT on like/save toggle. */
function useStableFeedOrder(
  loading: boolean,
  error: string | null,
  tab: DiscoverTab,
  userLocation: { lat: number; lng: number } | null,
  restaurantsLoading: boolean
): { orderedIds: string[]; badgeByDishId: Record<string, PrimaryBadge> } {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [badgeByDishId, setBadgeByDishId] = useState<Record<string, PrimaryBadge>>({});

  useEffect(() => {
    if (loading || error) return;
    if (tab === "Nearby" && !userLocation) {
      setOrderedIds([]);
      setBadgeByDishId({});
      return;
    }
    if (tab === "Nearby" && restaurantsLoading) return;

    const dishes = useDishStore.getState().dishes;
    const restaurants = useRestaurantStore.getState().restaurants;

    const list =
      tab === "All"
        ? getRankedDishes(dishes)
        : getNearbyRankedDishes(
            dishes,
            restaurants,
            userLocation!.lat,
            userLocation!.lng
          );
    setOrderedIds(list.map((d) => d.id));
    const badges: Record<string, PrimaryBadge> = {};
    list.forEach((d) => {
      const badge = getPrimaryBadge(d, dishes);
      if (badge) badges[d.id] = badge;
    });
    setBadgeByDishId(badges);
  }, [loading, error, tab, userLocation, restaurantsLoading]);

  return { orderedIds, badgeByDishId };
}

export function DishFeedScreen() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const dishes = useDishStore((s) => s.dishes);
  const loading = useDishStore((s) => s.loading);
  const error = useDishStore((s) => s.error);
  const loadDishes = useDishStore((s) => s.loadDishes);
  const restaurantsLoading = useRestaurantStore((s) => s.loading);
  const restaurantsError = useRestaurantStore((s) => s.error);
  const [tab, setTab] = useState<DiscoverTab>("All");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const { orderedIds, badgeByDishId } = useStableFeedOrder(
    loading,
    error,
    tab,
    userLocation,
    restaurantsLoading
  );

  const feedItems = useMemo(
    () =>
      orderedIds
        .map((id) => dishes.find((d) => d.id === id))
        .filter((d): d is Dish => d != null),
    [orderedIds, dishes]
  );

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const loadRestaurants = useRestaurantStore((s) => s.loadRestaurants);
  useEffect(() => {
    if (tab === "Nearby") loadRestaurants();
  }, [tab, loadRestaurants]);

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

  const showNearbyDeniedMessage =
    tab === "Nearby" && locationDenied && !userLocation;

  const currentUser = useUserStore((s) => s.currentUser);

  const handlePressDish = useCallback(
    (id: string) => {
      router.push({ pathname: "/dish/[id]", params: { id } });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Dish }) => (
      <FeedCard
        item={item}
        width={windowWidth}
        primaryBadge={badgeByDishId[item.id] ?? null}
        onPress={handlePressDish}
        isSaved={currentUser.savedDishIds.includes(item.id)}
        isLiked={(item.likedByUserIds ?? []).includes(currentUser.id)}
      />
    ),
    [windowWidth, badgeByDishId, handlePressDish, currentUser]
  );

  const keyExtractor = useCallback((item: Dish) => item.id, []);

  const ListHeaderComponent =
    showNearbyDeniedMessage ? (
      <View style={headerBannerStyle}>
        <Text className="text-sm text-amber-800">
          Location permission required to view nearby dishes.
        </Text>
      </View>
    ) : null;

  const ListEmptyComponent =
    !loading && !error && feedItems.length === 0 ? (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-center text-gray-500">No dishes yet.</Text>
      </View>
    ) : null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="border-b border-gray-100 bg-white px-5 pt-2 pb-3">
        <Text className="text-2xl font-bold text-black">Discover</Text>
        <Text className="mt-1 text-base text-gray-500">
          What are you eating today?
        </Text>
      </View>
      <View className="flex-row border-b border-gray-100 bg-white">
        <AnimatedPressable
          onPress={() => setTab("All")}
          scale={0.99}
          className="flex-1 items-center justify-center py-3"
        >
          <Text
            className={`text-sm ${tab === "All" ? "font-semibold text-black" : "text-gray-500"}`}
          >
            All
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => setTab("Nearby")}
          scale={0.99}
          className="flex-1 items-center justify-center py-3"
        >
          <Text
            className={`text-sm ${tab === "Nearby" ? "font-semibold text-black" : "text-gray-500"}`}
          >
            Nearby
          </Text>
        </AnimatedPressable>
      </View>
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}
      {tab === "Nearby" && restaurantsLoading && !loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}
      {tab === "Nearby" && restaurantsError && !restaurantsLoading && (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-gray-600">
            Failed to load restaurants.
          </Text>
          <Pressable
            onPress={() => loadRestaurants()}
            className="flex-row items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5"
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text className="font-medium text-white">Retry</Text>
          </Pressable>
        </View>
      )}
      {error && !loading && (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-gray-600">
            Failed to load dishes.
          </Text>
          <Pressable
            onPress={() => loadDishes()}
            className="flex-row items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5"
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text className="font-medium text-white">Retry</Text>
          </Pressable>
        </View>
      )}
      {!loading &&
        !error &&
        (tab === "All" || (!restaurantsLoading && !restaurantsError)) && (
          <FlatList
            data={feedItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={11}
            removeClippedSubviews={true}
          />
        )}
    </SafeAreaView>
  );
}

const headerBannerStyle = {
  marginHorizontal: 12,
  marginTop: 12,
  marginBottom: 4,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#fcd34d",
  backgroundColor: "#fffbeb",
};

const contentContainerStyle = { paddingBottom: 80 };
