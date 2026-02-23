import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import type { Dish } from "@/src/features/dish/types";
import { getRankedDishes } from "@/src/features/dish/utils/getRankedDishes";
import { getDishBadges, type DishBadges } from "@/src/features/dish/utils/getDishBadges";
import { searchDishes } from "@/src/shared/api/dishesApi";
import { config } from "@/src/config";

const SEARCH_DEBOUNCE_MS = 300;
const GRID_GAP = 6;
const GRID_PADDING_H = 12;

const CUISINE_OPTIONS = ["All", "Portuguese", "International", "Italian", "Fast food", "Other"] as const;
type CuisineOption = (typeof CUISINE_OPTIONS)[number];

const SORT_OPTIONS = ["Recentes", "Likes", "Rating"] as const;
type SearchSort = (typeof SORT_OPTIONS)[number];

/** Dish with optional fields used for sorting (fallback 0 if missing). */
function getSortValues(dish: Dish): { createdAtMs: number; likes: number; rating: number } {
  const createdAtMs = new Date(dish.createdAt ?? 0).getTime();
  const likes = dish.likeCount ?? dish.likedByUserIds?.length ?? 0;
  const rating = (dish as Dish & { averageRating?: number }).averageRating ?? 0;
  return { createdAtMs, likes, rating };
}

/** Sorts a copy of the array by sortBy; tie-breaker is always Recentes (createdAt desc). */
function sortSearchResults(items: Dish[], sortBy: SearchSort): Dish[] {
  const copy = [...items];
  return copy.sort((a, b) => {
    const va = getSortValues(a);
    const vb = getSortValues(b);
    let cmp = 0;
    switch (sortBy) {
      case "Recentes":
        cmp = vb.createdAtMs - va.createdAtMs;
        break;
      case "Likes":
        cmp = vb.likes - va.likes;
        if (cmp !== 0) return cmp;
        cmp = vb.createdAtMs - va.createdAtMs;
        break;
      case "Rating":
        cmp = vb.rating - va.rating;
        if (cmp !== 0) return cmp;
        cmp = vb.createdAtMs - va.createdAtMs;
        break;
    }
    return cmp;
  });
}

function matchesCuisine(dish: Dish, cuisine: CuisineOption): boolean {
  if (cuisine === "All") return true;
  const ft = (dish.foodType ?? "").trim().toLowerCase();
  switch (cuisine) {
    case "Other":
      return ft === "other";
    case "Portuguese":
      return ft === "traditional";
    case "International":
      return ft === "finedining";
    case "Italian":
      return ft === "pasta" || ft === "pizza";
    case "Fast food":
      return ft === "streetfood" || ft === "sandwich";
    default:
      return true;
  }
}

interface SearchGridItemProps {
  dish: Dish;
  badges: DishBadges;
  itemSize: number;
}

function SearchGridItem({ dish, badges, itemSize }: SearchGridItemProps) {
  const router = useRouter();

  const badge =
    badges.isTop ? "Top" : badges.isTrending ? "Trending" : badges.isNew ? "New" : null;

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
            dish.image
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
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [filterCuisine, setFilterCuisine] = useState<CuisineOption>("All");
  const [sortBy, setSortBy] = useState<SearchSort>("Recentes");
  const [searchResults, setSearchResults] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = query.trim();
    if (!term) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      searchDishes(config.apiBaseUrl, term)
        .then((list) => {
          if (isMountedRef.current) setSearchResults(list);
        })
        .catch(() => {
          if (isMountedRef.current) setSearchResults([]);
        })
        .finally(() => {
          if (isMountedRef.current) setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const ranked = getRankedDishes(searchResults);
  const filteredByCuisine = ranked.filter((d) => matchesCuisine(d, filterCuisine));
  const sortedResults = sortSearchResults(filteredByCuisine, sortBy);
  const contentWidth = width - GRID_PADDING_H * 2;
  const itemSize = (contentWidth - GRID_GAP * 2) / 3;

  const renderItem = ({ item }: { item: Dish }) => {
    const badges = getDishBadges(item, searchResults);
    return <SearchGridItem dish={item} badges={badges} itemSize={itemSize} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <View className="border-b border-gray-100 px-4 pb-3 pt-2">
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search dishes or restaurants..."
              placeholderTextColor="#9ca3af"
              className="mb-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-black"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6 }}
            >
              {CUISINE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setFilterCuisine(opt)}
                  className={`rounded-full px-2.5 py-1.5 ${filterCuisine === opt ? "bg-orange-500" : "bg-gray-100"}`}
                >
                  <Text
                    className={`text-[11px] font-medium ${filterCuisine === opt ? "text-white" : "text-gray-600"}`}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, marginTop: 10 }}
            >
              {SORT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setSortBy(opt)}
                  className={`rounded-full px-2.5 py-1.5 ${sortBy === opt ? "bg-orange-500" : "bg-gray-100"}`}
                >
                  <Text
                    className={`text-[11px] font-medium ${sortBy === opt ? "text-white" : "text-gray-600"}`}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#f97316" />
            </View>
          ) : sortedResults.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">
                {query.trim() ? "No results found." : "Type to search dishes or restaurants."}
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedResults}
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
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
