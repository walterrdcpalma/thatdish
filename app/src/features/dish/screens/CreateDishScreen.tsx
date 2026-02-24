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
  StyleSheet,
  Platform,
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

const INPUT_HEIGHT = 48;
const INPUT_FONT_SIZE = 16;
const INPUT_LINE_HEIGHT = 22;
const INPUT_PADDING_VERTICAL = 12;
const INPUT_PADDING_HORIZONTAL = 16;
const INPUT_BORDER_WIDTH = 1;

const inputStyle = StyleSheet.create({
  common: {
    height: INPUT_HEIGHT,
    minHeight: INPUT_HEIGHT,
    paddingVertical: INPUT_PADDING_VERTICAL,
    paddingHorizontal: INPUT_PADDING_HORIZONTAL,
    fontSize: INPUT_FONT_SIZE,
    lineHeight: INPUT_LINE_HEIGHT,
    borderWidth: INPUT_BORDER_WIDTH,
    borderRadius: 12,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    ...(Platform.OS === "android" ? { textAlignVertical: "center" as const } : {}),
  },
  dropdownAnchor: {
    position: "relative" as const,
    minHeight: INPUT_HEIGHT,
  },
  dropdownAbsolute: {
    position: "absolute",
    top: INPUT_HEIGHT + 4,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

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
  /** When true, dropdown must stay closed; cleared when user edits restaurant name again. */
  const restaurantSelectionCommittedRef = useRef(false);
  /** Name last selected from dropdown; used to avoid re-opening while showing that value. */
  const lastSelectedRestaurantNameRef = useRef<string | null>(null);
  const restaurantInputRef = useRef<TextInput>(null);
  const familySelectionCommittedRef = useRef(false);
  const lastSelectedFamilyNameRef = useRef<string | null>(null);
  const familyInputRef = useRef<TextInput>(null);
  const categorySelectionCommittedRef = useRef(false);
  const lastSelectedCategoryNameRef = useRef<string | null>(null);
  const categoryInputRef = useRef<TextInput>(null);

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
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    const term = restaurantName.trim();
    if (!term) {
      setRestaurantSuggestions([]);
      return;
    }
    if (restaurantSelectionCommittedRef.current && term === lastSelectedRestaurantNameRef.current) {
      setRestaurantSuggestions([]);
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      searchDebounceRef.current = null;
      const searchTerm = term.toLowerCase();
      fetchRestaurantSearch(config.apiBaseUrl, term)
        .then((list) => {
          if (!isMountedRef.current) return;
          if (restaurantSelectionCommittedRef.current) return;
          const filtered = list.filter((r) =>
            r.name.toLowerCase().includes(searchTerm)
          );
          setRestaurantSuggestions(filtered.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current && !restaurantSelectionCommittedRef.current) {
            setRestaurantSuggestions([]);
          }
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [restaurantName]);

  useEffect(() => {
    if (familyDebounceRef.current) {
      clearTimeout(familyDebounceRef.current);
      familyDebounceRef.current = null;
    }
    const term = dishFamilyName.trim();
    if (!term) {
      setFamilySuggestions([]);
      return;
    }
    if (familySelectionCommittedRef.current && term === lastSelectedFamilyNameRef.current) {
      setFamilySuggestions([]);
      return;
    }
    familyDebounceRef.current = setTimeout(() => {
      familyDebounceRef.current = null;
      fetchDishFamilies(config.apiBaseUrl, term)
        .then((list) => {
          if (!isMountedRef.current) return;
          if (familySelectionCommittedRef.current) return;
          setFamilySuggestions(list.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current && !familySelectionCommittedRef.current) {
            setFamilySuggestions([]);
          }
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (familyDebounceRef.current) clearTimeout(familyDebounceRef.current);
    };
  }, [dishFamilyName]);

  useEffect(() => {
    if (categoryDebounceRef.current) {
      clearTimeout(categoryDebounceRef.current);
      categoryDebounceRef.current = null;
    }
    if (!selectedFamilyId) {
      setCategorySuggestions([]);
      return;
    }
    const term = dishCategoryName.trim();
    if (!term) {
      setCategorySuggestions([]);
      return;
    }
    if (categorySelectionCommittedRef.current && term === lastSelectedCategoryNameRef.current) {
      setCategorySuggestions([]);
      return;
    }
    categoryDebounceRef.current = setTimeout(() => {
      categoryDebounceRef.current = null;
      fetchDishCategories(config.apiBaseUrl, selectedFamilyId, term)
        .then((list) => {
          if (!isMountedRef.current) return;
          if (categorySelectionCommittedRef.current) return;
          setCategorySuggestions(list.slice(0, SUGGESTION_LIMIT));
        })
        .catch(() => {
          if (isMountedRef.current && !categorySelectionCommittedRef.current) {
            setCategorySuggestions([]);
          }
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
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    if (closeSuggestionsTimeoutRef.current) {
      clearTimeout(closeSuggestionsTimeoutRef.current);
      closeSuggestionsTimeoutRef.current = null;
    }
    restaurantSelectionCommittedRef.current = true;
    lastSelectedRestaurantNameRef.current = name;
    setSelectedRestaurantId(id);
    setRestaurantName(name);
    setRestaurantSuggestions([]);
    setError(null);
    restaurantInputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const selectFamilySuggestion = useCallback((id: string, name: string) => {
    if (familyDebounceRef.current) {
      clearTimeout(familyDebounceRef.current);
      familyDebounceRef.current = null;
    }
    if (closeSuggestionsTimeoutRef.current) {
      clearTimeout(closeSuggestionsTimeoutRef.current);
      closeSuggestionsTimeoutRef.current = null;
    }
    familySelectionCommittedRef.current = true;
    lastSelectedFamilyNameRef.current = name;
    setSelectedFamilyId(id);
    setDishFamilyName(name);
    setFamilySuggestions([]);
    setDishCategoryName("");
    setCategorySuggestions([]);
    setError(null);
    familyInputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const selectCategorySuggestion = useCallback((id: string, name: string) => {
    if (categoryDebounceRef.current) {
      clearTimeout(categoryDebounceRef.current);
      categoryDebounceRef.current = null;
    }
    if (closeSuggestionsTimeoutRef.current) {
      clearTimeout(closeSuggestionsTimeoutRef.current);
      closeSuggestionsTimeoutRef.current = null;
    }
    categorySelectionCommittedRef.current = true;
    lastSelectedCategoryNameRef.current = name;
    setDishCategoryName(name);
    setCategorySuggestions([]);
    setError(null);
    categoryInputRef.current?.blur();
    Keyboard.dismiss();
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
      restaurantSelectionCommittedRef.current = false;
      lastSelectedRestaurantNameRef.current = null;
      familySelectionCommittedRef.current = false;
      lastSelectedFamilyNameRef.current = null;
      categorySelectionCommittedRef.current = false;
      lastSelectedCategoryNameRef.current = null;
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
    restaurantSelectionCommittedRef.current = false;
    lastSelectedRestaurantNameRef.current = null;
    familySelectionCommittedRef.current = false;
    lastSelectedFamilyNameRef.current = null;
    categorySelectionCommittedRef.current = false;
    lastSelectedCategoryNameRef.current = null;
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
              style={[inputStyle.common, { marginBottom: 20 }]}
              placeholderTextColor="#9ca3af"
            />
            <Text className="mb-2 text-sm font-semibold text-gray-600">Restaurant name</Text>
            <View style={[inputStyle.dropdownAnchor, { marginBottom: 4 }]}>
              <TextInput
                ref={restaurantInputRef}
                value={restaurantName}
                onChangeText={(t) => {
                  setRestaurantName(t);
                  setSelectedRestaurantId(null);
                  restaurantSelectionCommittedRef.current = false;
                  lastSelectedRestaurantNameRef.current = null;
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(closeSuggestions, 200);
                }}
                placeholder="e.g. Nando's"
                style={inputStyle.common}
                placeholderTextColor="#9ca3af"
              />
              {restaurantSuggestions.length > 0 && (
                <View style={inputStyle.dropdownAbsolute}>
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
            <View style={[inputStyle.dropdownAnchor, { marginBottom: 4 }]}>
              <TextInput
                ref={familyInputRef}
                value={dishFamilyName}
                onChangeText={(t) => {
                  setDishFamilyName(t);
                  setSelectedFamilyId(null);
                  familySelectionCommittedRef.current = false;
                  lastSelectedFamilyNameRef.current = null;
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(() => setFamilySuggestions([]), 200);
                }}
                placeholder="Ex: Bacalhau (grupo geral para organizar rankings e pesquisa)"
                style={inputStyle.common}
                placeholderTextColor="#9ca3af"
              />
              {familySuggestions.length > 0 && (
                <View style={inputStyle.dropdownAbsolute}>
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
            <View style={[inputStyle.dropdownAnchor, { marginBottom: 4 }]}>
              <TextInput
                ref={categoryInputRef}
                value={dishCategoryName}
                onChangeText={(t) => {
                  setDishCategoryName(t);
                  categorySelectionCommittedRef.current = false;
                  lastSelectedCategoryNameRef.current = null;
                  setError(null);
                }}
                onBlur={() => {
                  if (closeSuggestionsTimeoutRef.current) clearTimeout(closeSuggestionsTimeoutRef.current);
                  closeSuggestionsTimeoutRef.current = setTimeout(() => setCategorySuggestions([]), 200);
                }}
                placeholder={'Ex: Bacalhau à Brás (prato específico para encontrar "o melhor ...")'}
                style={inputStyle.common}
                placeholderTextColor="#9ca3af"
              />
              {categorySuggestions.length > 0 && (
                <View style={inputStyle.dropdownAbsolute}>
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
                <View style={[inputStyle.dropdownAnchor, { marginBottom: 4 }]}>
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
                    style={inputStyle.common}
                    placeholderTextColor="#9ca3af"
                  />
                  {cuisineSuggestions.length > 0 && (
                    <View style={inputStyle.dropdownAbsolute}>
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
