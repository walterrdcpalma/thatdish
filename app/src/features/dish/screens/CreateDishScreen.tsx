import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
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
import { fetchDishFamilies } from "@/src/shared/api/dishFamiliesApi";
import type { DishFamilyItemDto } from "@/src/shared/api/dishFamiliesApi";
import { fetchDishCategories } from "@/src/shared/api/dishCategoriesApi";
import type { DishCategoryItemDto } from "@/src/shared/api/dishCategoriesApi";
import { fetchCuisines } from "@/src/shared/api/cuisinesApi";
import type { CuisineItemDto } from "@/src/shared/api/cuisinesApi";
import { config } from "@/src/config";

const SEARCH_DEBOUNCE_MS = 300;
const SUGGESTION_LIMIT = 10;
const CUISINE_SUGGESTION_LIMIT = 8;

interface CreateDishScreenProps {
  showBackButton?: boolean;
}

export function CreateDishScreen({ showBackButton = true }: CreateDishScreenProps) {
  const router = useRouter();
  const loadDishes = useDishStore((s) => s.loadDishes);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [dishFamilyName, setDishFamilyName] = useState("");
  const [dishCategoryName, setDishCategoryName] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [cuisineName, setCuisineName] = useState("");
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<RestaurantSearchResultDto[]>([]);
  const [familySuggestions, setFamilySuggestions] = useState<DishFamilyItemDto[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<DishCategoryItemDto[]>([]);
  const [cuisineSuggestions, setCuisineSuggestions] = useState<CuisineItemDto[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const familyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const categoryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cuisineDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeSuggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
      if (categoryDebounceRef.current) clearTimeout(categoryDebounceRef.current);
      if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current);
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

  useEffect(() => {
    if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    const term = dishFamilyName.trim();
    if (!term) {
      setFamilySuggestions([]);
      return;
    }
    familyDebounceRef.current = setTimeout(() => {
      familyDebounceRef.current = null;
      fetchDishFamilies(config.apiBaseUrl, term)
        .then((list) => {
          if (isMountedRef.current) setFamilySuggestions(list.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current) setFamilySuggestions([]);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    };
  }, [dishFamilyName]);

  useEffect(() => {
    if (categoryDebounceRef.current) clearTimeout(categoryDebounceRef.current);
    if (!selectedFamilyId) {
      setCategorySuggestions([]);
      return;
    }
    const term = dishCategoryName.trim();
    categoryDebounceRef.current = setTimeout(() => {
      categoryDebounceRef.current = null;
      fetchDishCategories(config.apiBaseUrl, selectedFamilyId, term)
        .then((list) => {
          if (isMountedRef.current) setCategorySuggestions(list.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current) setCategorySuggestions([]);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (categoryDebounceRef.current) clearTimeout(categoryDebounceRef.current);
    };
  }, [selectedFamilyId, dishCategoryName]);

  useEffect(() => {
    if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current);
    const term = cuisineName.trim();
    if (!term) {
      setCuisineSuggestions([]);
      return;
    }
    cuisineDebounceRef.current = setTimeout(() => {
      cuisineDebounceRef.current = null;
      fetchCuisines(config.apiBaseUrl, term)
        .then((list) => {
          if (isMountedRef.current) setCuisineSuggestions(list.slice(0, CUISINE_SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current) setCuisineSuggestions([]);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (cuisineDebounceRef.current) clearTimeout(cuisineDebounceRef.current);
    };
  }, [cuisineName]);

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

  const selectFamilySuggestion = useCallback((id: string, name: string) => {
    setSelectedFamilyId(id);
    setDishFamilyName(name);
    setFamilySuggestions([]);
    setDishCategoryName("");
    setCategorySuggestions([]);
    setError(null);
  }, []);

  const selectCategorySuggestion = useCallback((id: string, name: string) => {
    setDishCategoryName(name);
    setCategorySuggestions([]);
    setError(null);
  }, []);

  const selectCuisineSuggestion = useCallback((name: string) => {
    setCuisineName(name);
    setCuisineSuggestions([]);
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
    const familyName = dishFamilyName.trim();
    const categoryName = dishCategoryName.trim();
    if (!familyName) {
      setError("Dish family is required.");
      return;
    }
    if (!categoryName) {
      setError("Dish category is required.");
      return;
    }
    const isNewRestaurant = selectedRestaurantId === null;
    if (isNewRestaurant && !cuisineName.trim()) {
      setError("Cuisine is required for the new restaurant.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("restaurantName", restName);
      formData.append("dishFamilyName", familyName);
      formData.append("dishCategoryName", categoryName);
      formData.append("foodType", "Other");
      if (isNewRestaurant && cuisineName.trim()) {
        formData.append("cuisineType", cuisineName.trim());
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
      setDishFamilyName("");
      setDishCategoryName("");
      setSelectedRestaurantId(null);
      setSelectedFamilyId(null);
      setCuisineName("");
      setRestaurantSuggestions([]);
      setFamilySuggestions([]);
      setCategorySuggestions([]);
      setCuisineSuggestions([]);
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
    setDishFamilyName("");
    setDishCategoryName("");
    setSelectedRestaurantId(null);
    setSelectedFamilyId(null);
    setCuisineName("");
    setRestaurantSuggestions([]);
    setFamilySuggestions([]);
    setCategorySuggestions([]);
    setCuisineSuggestions([]);
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
            <Text className="mb-2 text-sm font-semibold text-gray-600">Dish family</Text>
            <View className="mb-1">
              <TextInput
                value={dishFamilyName}
                onChangeText={(t) => {
                  setDishFamilyName(t);
                  setSelectedFamilyId(null);
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(() => setFamilySuggestions([]), 200);
                }}
                placeholder="Ex: Bacalhau (grupo geral para organizar rankings e pesquisa)"
                placeholderTextColor="#9ca3af"
                className="mb-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
              />
              {familySuggestions.length > 0 && (
                <View className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {familySuggestions.map((f) => (
                      <AnimatedPressable
                        key={f.id}
                        onPress={() => selectFamilySuggestion(f.id, f.name)}
                        scale={0.99}
                        className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                      >
                        <Text className="text-base text-gray-800" numberOfLines={1}>{f.name}</Text>
                      </AnimatedPressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <Text className="mb-2 text-sm font-semibold text-gray-600">Dish category</Text>
            <View className="mb-1">
              <TextInput
                value={dishCategoryName}
                onChangeText={(t) => {
                  setDishCategoryName(t);
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(() => setCategorySuggestions([]), 200);
                }}
                placeholder={'Ex: Bacalhau à Brás (prato específico para encontrar "o melhor ...")'}
                placeholderTextColor="#9ca3af"
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
              />
              {categorySuggestions.length > 0 && (
                <View className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {categorySuggestions.map((c) => (
                      <AnimatedPressable
                        key={c.id}
                        onPress={() => selectCategorySuggestion(c.id, c.name)}
                        scale={0.99}
                        className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                      >
                        <Text className="text-base text-gray-800" numberOfLines={1}>{c.name}</Text>
                      </AnimatedPressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            {selectedRestaurantId === null && (
              <>
                <Text className="mb-2 mt-3 text-sm font-semibold text-gray-600">Cuisine (restaurant)</Text>
                <View className="mb-1">
                  <TextInput
                    value={cuisineName}
                    onChangeText={(t) => {
                      setCuisineName(t);
                      setError(null);
                    }}
                    onBlur={() => {
                      if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                      closeSuggestionsTimeoutRef.current = setTimeout(() => setCuisineSuggestions([]), 200);
                    }}
                    placeholder="Ex: Portuguesa (tipo de cozinha do restaurante para melhorar filtros e descoberta)"
                    placeholderTextColor="#9ca3af"
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
                  />
                  {cuisineSuggestions.length > 0 && (
                    <View className="mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={{ maxHeight: 200 }}>
                        {cuisineSuggestions.map((c) => (
                          <AnimatedPressable
                            key={c.id}
                            onPress={() => selectCuisineSuggestion(c.name)}
                            scale={0.99}
                            className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                          >
                            <Text className="text-base text-gray-800" numberOfLines={1}>{c.name}</Text>
                          </AnimatedPressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
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
