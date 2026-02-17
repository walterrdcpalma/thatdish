import { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import type { Dish } from "../types";
import { AnimatedPressable } from "@/src/shared/components";

const SUGGESTION_LIMIT = 5;

export function CreateDishScreen() {
  const router = useRouter();
  const { restaurantId: paramRestaurantId } = useLocalSearchParams<{
    restaurantId?: string;
  }>();
  const addDish = useDishStore((s) => s.addDish);
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const addRestaurant = useRestaurantStore((s) => s.addRestaurant);
  const currentUser = useUserStore((s) => s.currentUser);
  const [name, setName] = useState("");
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(
    paramRestaurantId ?? null
  );

  const isFromRestaurant = Boolean(paramRestaurantId);
  const preselectedRestaurant = paramRestaurantId
    ? restaurants.find((r) => r.id === paramRestaurantId)
    : undefined;

  const restaurantSuggestions = restaurantSearch.trim()
    ? restaurants
        .filter((r) =>
          r.name.toLowerCase().includes(restaurantSearch.trim().toLowerCase())
        )
        .slice(0, SUGGESTION_LIMIT)
    : [];

  const handleSelectRestaurant = (id: string, restaurantName: string) => {
    setSelectedRestaurantId(id);
    setRestaurantSearch(restaurantName);
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    let restaurantId: string;

    if (isFromRestaurant && paramRestaurantId) {
      restaurantId = paramRestaurantId;
    } else if (selectedRestaurantId) {
      restaurantId = selectedRestaurantId;
    } else {
      const trimmedSearch = restaurantSearch.trim();
      const existing = restaurants.find(
        (r) => r.name.toLowerCase() === trimmedSearch.toLowerCase()
      );
      if (existing) {
        restaurantId = existing.id;
      } else {
        restaurantId = "new-" + Date.now().toString();
        addRestaurant({
          id: restaurantId,
          name: trimmedSearch,
          location: "",
          signatureDishId: null,
          ownerUserId: null,
          claimStatus: "unclaimed",
          imageUrl: `https://picsum.photos/seed/rest-${restaurantId}/600/320`,
        });
      }
    }

    const dishId = Date.now().toString();
    const dish: Dish = {
      id: dishId,
      name: trimmedName,
      restaurantId,
      savedCount: 0,
      createdAt: new Date().toISOString(),
      createdByUserId: currentUser.id,
      imagePlaceholder: `https://picsum.photos/seed/dish-${dishId}/800/500`,
      isArchived: false,
    };
    addDish(dish);
    router.back();
  };

  const canCreate = name.trim() && (isFromRestaurant || selectedRestaurantId || restaurantSearch.trim());

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-4 text-lg font-semibold text-black">
          {isFromRestaurant ? "Add dish to restaurant" : "New dish"}
        </Text>

        {isFromRestaurant && preselectedRestaurant && (
          <View className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Text className="text-xs text-gray-500">Restaurant</Text>
            <Text className="mt-0.5 text-base font-medium text-black">
              {preselectedRestaurant.name}
            </Text>
          </View>
        )}

        <Text className="mb-1 text-sm text-gray-600">Dish name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Piri-Piri Chicken"
          className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />

        {!isFromRestaurant && (
          <>
            <Text className="mb-1 text-sm text-gray-600">
              Restaurant (search or type new)
            </Text>
            <TextInput
              value={restaurantSearch}
              onChangeText={(text) => {
                setRestaurantSearch(text);
                setSelectedRestaurantId(null);
              }}
              placeholder="Search or type restaurant name"
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
              placeholderTextColor="#9ca3af"
            />
            {restaurantSuggestions.length > 0 && (
              <View className="mt-1 rounded-xl border border-gray-200 bg-white">
                {restaurantSuggestions.map((r) => (
                  <AnimatedPressable
                    key={r.id}
                    onPress={() => handleSelectRestaurant(r.id, r.name)}
                    scale={0.99}
                    className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                  >
                    <Text className="text-base text-black">{r.name}</Text>
                    {r.location ? (
                      <Text className="mt-0.5 text-xs text-gray-500">
                        {r.location}
                      </Text>
                    ) : null}
                  </AnimatedPressable>
                ))}
              </View>
            )}
            {selectedRestaurantId && (
              <Text className="mt-2 text-xs text-gray-500">
                Selected: {restaurants.find((r) => r.id === selectedRestaurantId)?.name}. Type to change.
              </Text>
            )}
          </>
        )}

        <AnimatedPressable
          onPress={handleCreate}
          disabled={!canCreate}
          scale={0.98}
          className="mt-6 rounded-xl bg-orange-500 py-3.5 disabled:opacity-50"
        >
          <Text className="text-center font-semibold text-white">Create</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}
