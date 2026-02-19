import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { useDishStore } from "../state";
import { createDishMultipart } from "@/src/shared/api/dishesApi";
import { fetchRestaurantSearch } from "@/src/shared/api/restaurantsApi";
import type { RestaurantSearchResultDto } from "@/src/shared/api/restaurantsApi";
import { config } from "@/src/config";

const SEARCH_DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 10;

/** Dish food type: label shown in UI, value sent to backend (FoodType enum). */
const FOOD_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "Traditional", value: "Traditional" },
  { label: "Seafood", value: "Seafood" },
  { label: "Street food", value: "StreetFood" },
  { label: "Pasta", value: "Pasta" },
  { label: "Pizza", value: "Pizza" },
  { label: "Soup", value: "Soup" },
  { label: "Dessert", value: "Dessert" },
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Rice", value: "Rice" },
  { label: "Sandwich", value: "Sandwich" },
  { label: "Grill", value: "Grill" },
  { label: "Breakfast", value: "Breakfast" },
  { label: "Fine dining", value: "FineDining" },
  { label: "Other", value: "Other" },
];

/** Restaurant cuisine: options for new restaurant only; value sent as cuisineType. */
const CUISINE_TYPE_OPTIONS = ["Portuguese", "International", "Italian", "Fast food", "Other"] as const;
type CuisineTypeOption = (typeof CUISINE_TYPE_OPTIONS)[number];

interface CreateDishScreenProps {
  showBackButton?: boolean;
}

export function CreateDishScreen({ showBackButton = true }: CreateDishScreenProps) {
  const router = useRouter();
  const loadDishes = useDishStore((s) => s.loadDishes);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [selectedRestaurantCuisine, setSelectedRestaurantCuisine] = useState<CuisineTypeOption | null>(null);
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<RestaurantSearchResultDto[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeSuggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const term = restaurantName.trim();
    if (!term) {
      setRestaurantSuggestions([]);
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      searchDebounceRef.current = null;
      const searchTerm = term.toLowerCase();
      fetchRestaurantSearch(config.apiBaseUrl, term)
        .then((list) => {
          if (!isMountedRef.current) return;
          // Ensure only names that contain the search term are shown (safety filter)
          const filtered = list.filter((r) =>
            r.name.toLowerCase().includes(searchTerm)
          );
          setRestaurantSuggestions(filtered.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current) setRestaurantSuggestions([]);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [restaurantName]);

  const closeSuggestions = useCallback(() => {
    if (closeSuggestionsTimeoutRef.current) {
      clearTimeout(closeSuggestionsTimeoutRef.current);
      closeSuggestionsTimeoutRef.current = null;
    }
    setRestaurantSuggestions([]);
  }, []);

  const selectRestaurantSuggestion = useCallback((id: string, name: string) => {
    if (closeSuggestionsTimeoutRef.current) {
      clearTimeout(closeSuggestionsTimeoutRef.current);
      closeSuggestionsTimeoutRef.current = null;
    }
    setSelectedRestaurantId(id);
    setRestaurantName(name);
    setRestaurantSuggestions([]);
    setError(null);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow access to your photos to add a dish image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && isMountedRef.current) {
      setImageUri(result.assets[0].uri);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    const name = dishName.trim();
    const restName = restaurantName.trim();
    if (!name || !restName) {
      setError("Dish name and restaurant name are required.");
      return;
    }
    if (!imageUri) {
      setError("Please select an image.");
      return;
    }
    if (!selectedFoodType) {
      setError("Please select a food type for the dish.");
      return;
    }
    const isNewRestaurant = selectedRestaurantId === null;
    if (isNewRestaurant && !selectedRestaurantCuisine) {
      setError("Please select a cuisine for the new restaurant.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("restaurantName", restName);
      formData.append("foodType", selectedFoodType);
      if (isNewRestaurant && selectedRestaurantCuisine) {
        formData.append("cuisineType", selectedRestaurantCuisine);
      }
      const filename = imageUri.split("/").pop() ?? "image.jpg";
      const mime = "image/jpeg";
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: mime,
      } as unknown as Blob);
      await createDishMultipart(config.apiBaseUrl, formData);
      if (!isMountedRef.current) return;
      await loadDishes();
      setDishName("");
      setRestaurantName("");
      setSelectedRestaurantId(null);
      setSelectedFoodType(null);
      setSelectedRestaurantCuisine(null);
      setRestaurantSuggestions([]);
      setImageUri(null);
      setError(null);
      setSubmissionSuccess(true);
    } catch (e) {
      if (isMountedRef.current) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleBackToDiscover = () => {
    setSubmissionSuccess(false);
    setDishName("");
    setRestaurantName("");
    setSelectedRestaurantId(null);
    setSelectedFoodType(null);
    setSelectedRestaurantCuisine(null);
    setRestaurantSuggestions([]);
    setImageUri(null);
    setError(null);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        {showBackButton && !submissionSuccess && (
          <AnimatedPressable
            onPress={() => router.back()}
            scale={0.9}
            className="mr-3 flex-row items-center gap-2 py-1"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text className="text-base text-gray-700">Back</Text>
          </AnimatedPressable>
        )}
        <Text className="text-xl font-bold text-black">
          {submissionSuccess ? "Submission Received" : "Create dish"}
        </Text>
      </View>
      <View className="flex-1 p-5">
        {submissionSuccess ? (
          <>
            <Text className="mb-4 text-base text-gray-700">
              Your submission has been received. We will review and approve it shortly.
            </Text>
            <AnimatedPressable
              onPress={handleBackToDiscover}
              scale={0.98}
              className="rounded-xl bg-orange-500 py-3.5"
            >
              <Text className="text-center font-semibold text-white">Back to Discover</Text>
            </AnimatedPressable>
          </>
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1">
            <Text className="mb-2 text-sm font-semibold text-gray-600">Dish name</Text>
            <TextInput
              value={dishName}
              onChangeText={(t) => { setDishName(t); setError(null); }}
              placeholder="e.g. Piri-Piri Chicken"
              className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
              placeholderTextColor="#9ca3af"
            />
            <Text className="mb-2 text-sm font-semibold text-gray-600">Restaurant name</Text>
            <View className="mb-1">
              <TextInput
                value={restaurantName}
                onChangeText={(t) => {
                  setRestaurantName(t);
                  setSelectedRestaurantId(null);
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(closeSuggestions, 200);
                }}
                placeholder="e.g. Nando's"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
                placeholderTextColor="#9ca3af"
              />
              {restaurantSuggestions.length > 0 && (
                <View className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    style={{ maxHeight: 200 }}
                  >
                    {restaurantSuggestions.map((r) => (
                      <AnimatedPressable
                        key={r.id}
                        onPress={() => selectRestaurantSuggestion(r.id, r.name)}
                        scale={0.99}
                        className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                      >
                        <Text className="text-base text-gray-800" numberOfLines={1}>
                          {r.name}
                        </Text>
                      </AnimatedPressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <Text className="mb-1.5 text-sm font-semibold text-gray-600">Food Type (dish)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6 }}
            >
              {FOOD_TYPE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    setSelectedFoodType(opt.value);
                    setError(null);
                  }}
                  className={`rounded-full px-2.5 py-1.5 ${selectedFoodType === opt.value ? "bg-orange-500" : "bg-gray-100"}`}
                >
                  <Text
                    className={`text-[11px] font-medium ${selectedFoodType === opt.value ? "text-white" : "text-gray-600"}`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {selectedRestaurantId === null && (
              <>
                <Text className="mb-1.5 mt-3 text-sm font-semibold text-gray-600">Restaurant cuisine</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 6 }}
                >
                  {CUISINE_TYPE_OPTIONS.map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setSelectedRestaurantCuisine(opt);
                        setError(null);
                      }}
                      className={`rounded-full px-2.5 py-1.5 ${selectedRestaurantCuisine === opt ? "bg-orange-500" : "bg-gray-100"}`}
                    >
                      <Text
                        className={`text-[11px] font-medium ${selectedRestaurantCuisine === opt ? "text-white" : "text-gray-600"}`}
                      >
                        {opt}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
            <Text className="mb-2 text-sm font-semibold text-gray-600">Image</Text>
            {imageUri ? (
              <View className="mb-5">
                <Image
                  source={{ uri: imageUri }}
                  className="mb-2 h-40 w-full rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <AnimatedPressable
                  onPress={pickImage}
                  scale={0.98}
                  className="rounded-xl border border-gray-300 bg-white py-2.5"
                >
                  <Text className="text-center text-gray-700">Change image</Text>
                </AnimatedPressable>
              </View>
            ) : (
              <AnimatedPressable
                onPress={pickImage}
                scale={0.98}
                className="mb-5 flex-row items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8"
              >
                <Ionicons name="image-outline" size={28} color="#9ca3af" />
                <Text className="text-base text-gray-500">Pick image</Text>
              </AnimatedPressable>
            )}
            {error ? (
              <Text className="mb-4 text-sm text-red-600">{error}</Text>
            ) : null}
            <AnimatedPressable
              onPress={handleSubmit}
              disabled={loading}
              scale={0.98}
              className="rounded-xl bg-orange-500 py-3.5 disabled:opacity-60"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-white">Create Dish</Text>
              )}
            </AnimatedPressable>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </SafeAreaView>
  );
}
