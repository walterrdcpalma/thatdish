import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useDishStore } from "@/src/features/dish/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import type { Dish } from "@/src/features/dish/types";
import type { Restaurant } from "@/src/features/restaurant/types/restaurant.types";
import { getRankedDishes } from "@/src/features/dish/utils/getRankedDishes";
import { getDishBadges, type DishBadges } from "@/src/features/dish/utils/getDishBadges";
import { getDistanceInKm } from "@/src/features/dish/utils/getDistanceInKm";

const NEARBY_KM = 5;
const GRID_GAP = 6;
const GRID_PADDING_H = 12;

const CUISINE_OPTIONS = ["All", "Portuguese", "International", "Italian", "Fast food", "Other"] as const;
type CuisineOption = (typeof CUISINE_OPTIONS)[number];

function filterDishesBySearch(
  dishes: Dish[],
  restaurants: Restaurant[],
  query: string
): Dish[] {
  const q = query.trim().toLowerCase();
  if (!q) return dishes.filter((d) => !d.isArchived);
  return dishes.filter((d) => {
    if (d.isArchived) return false;
    const restaurant = restaurants.find((r) => r.id === d.restaurantId);
    const matchDish = d.name.toLowerCase().includes(q);
    const matchRestaurant = restaurant?.name.toLowerCase().includes(q);
    const matchAddress =
      (restaurant?.address?.toLowerCase().includes(q)) ||
      (restaurant?.location?.toLowerCase().includes(q)) ||
      false;
    return matchDish || matchRestaurant || matchAddress;
  });
}

function applyFilters(
  dishes: Dish[],
  restaurants: Restaurant[],
  allDishes: Dish[],
  filters: {
    nearby: boolean;
    trending: boolean;
    top: boolean;
    cuisine: CuisineOption;
  },
  userLocation: { lat: number; lng: number } | null
): Dish[] {
  return dishes.filter((d) => {
    const restaurant = restaurants.find((r) => r.id === d.restaurantId);
    const badges = getDishBadges(d, allDishes);

    if (filters.nearby) {
      if (!userLocation || restaurant?.latitude == null || restaurant?.longitude == null)
        return false;
      const dist = getDistanceInKm(
        userLocation.lat,
        userLocation.lng,
        restaurant.latitude!,
        restaurant.longitude!
      );
      if (dist > NEARBY_KM) return false;
    }
    if (filters.trending && !badges.isTrending) return false;
    if (filters.top && !badges.isTop) return false;
    if (filters.cuisine !== "All") {
      const restCuisine = restaurant?.cuisine ?? "Other";
      if (restCuisine !== filters.cuisine) return false;
    }
    return true;
  });
}

interface SearchGridItemProps {
  dish: Dish;
  badges: DishBadges;
  isNearby: boolean;
  itemSize: number;
}

function SearchGridItem({ dish, badges, isNearby, itemSize }: SearchGridItemProps) {
  const router = useRouter();

  const badge =
    badges.isTop ? "Top" : badges.isTrending ? "Trending" : badges.isNew ? "New" : isNearby ? "Nearby" : null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/dish/[id]", params: { id: dish.id } })}
      style={{
        width: itemSize,
        aspectRatio: 1,
      }}
      className="overflow-hidden rounded-lg bg-gray-200"
    >
      <Image
        source={{
          uri:
            dish.imagePlaceholder ??
            "https://placehold.co/400x400/gray/white?text=Dish",
        }}
        className="h-full w-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/20" />
      <View className="absolute bottom-1 left-1">
        <Text className="text-[10px] font-medium text-white" numberOfLines={1}>
          {dish.savedCount} saved
        </Text>
      </View>
      {badge && (
        <View className="absolute right-1 top-1">
          <View className="rounded bg-black/50 px-1.5 py-0.5">
            <Text className="text-[9px] font-semibold uppercase text-white">
              {badge}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export function SearchScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dishes = useDishStore((s) => s.dishes);
  const restaurants = useRestaurantStore((s) => s.restaurants);

  const [query, setQuery] = useState("");
  const [filterNearby, setFilterNearby] = useState(false);
  const [filterTrending, setFilterTrending] = useState(false);
  const [filterTop, setFilterTop] = useState(false);
  const [filterCuisine, setFilterCuisine] = useState<CuisineOption>("All");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled || status !== "granted") return;
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const searchFiltered = filterDishesBySearch(dishes, restaurants, query);
  const filterApplied = applyFilters(
    searchFiltered,
    restaurants,
    dishes,
    {
      nearby: filterNearby,
      trending: filterTrending,
      top: filterTop,
      cuisine: filterCuisine,
    },
    userLocation
  );
  const ranked = getRankedDishes(filterApplied);

  const contentWidth = width - GRID_PADDING_H * 2;
  const itemSize = (contentWidth - GRID_GAP * 2) / 3; // 2 gaps between 3 items

  const renderItem = ({ item }: { item: Dish }) => {
    const restaurant = restaurants.find((r) => r.id === item.restaurantId);
    const badges = getDishBadges(item, dishes);
    const isNearby =
      userLocation != null &&
      restaurant?.latitude != null &&
      restaurant?.longitude != null &&
      getDistanceInKm(
        userLocation.lat,
        userLocation.lng,
        restaurant.latitude,
        restaurant.longitude
      ) <= NEARBY_KM;

    return (
      <SearchGridItem
        dish={item}
        badges={badges}
        isNearby={isNearby}
        itemSize={itemSize}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="border-b border-gray-100 px-4 pb-3 pt-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search dishes or restaurants..."
          placeholderTextColor="#9ca3af"
          className="mb-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-black"
        />
        <View className="gap-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <Pressable
              onPress={() => setFilterNearby((v) => !v)}
              className={`rounded-full px-3 py-2 ${filterNearby ? "bg-orange-500" : "bg-gray-100"}`}
            >
              <Text
                className={`text-xs font-medium ${filterNearby ? "text-white" : "text-gray-600"}`}
              >
                Nearby
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterTrending((v) => !v)}
              className={`rounded-full px-3 py-2 ${filterTrending ? "bg-orange-500" : "bg-gray-100"}`}
            >
              <Text
                className={`text-xs font-medium ${filterTrending ? "text-white" : "text-gray-600"}`}
              >
                Trending
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setFilterTop((v) => !v)}
              className={`rounded-full px-3 py-2 ${filterTop ? "bg-orange-500" : "bg-gray-100"}`}
            >
              <Text
                className={`text-xs font-medium ${filterTop ? "text-white" : "text-gray-600"}`}
              >
                Top
              </Text>
            </Pressable>
          </ScrollView>
          <View className="h-px bg-gray-200" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {CUISINE_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => setFilterCuisine(opt)}
                className={`rounded-full px-3 py-2 ${filterCuisine === opt ? "bg-orange-500" : "bg-gray-100"}`}
              >
                <Text
                  className={`text-xs font-medium ${filterCuisine === opt ? "text-white" : "text-gray-600"}`}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
      {ranked.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No results found.</Text>
        </View>
      ) : (
        <FlatList
          data={ranked}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            paddingHorizontal: GRID_PADDING_H,
            paddingTop: GRID_GAP,
            paddingBottom: 80,
          }}
          columnWrapperStyle={{
            flexDirection: "row",
            marginBottom: GRID_GAP,
            gap: GRID_GAP,
          }}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
