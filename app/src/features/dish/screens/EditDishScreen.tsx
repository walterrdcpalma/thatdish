import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDishStore } from "../state";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { canEditDish } from "../services/canEditDish";
import { AnimatedPressable } from "@/src/shared/components";

export function EditDishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dishes = useDishStore((s) => s.dishes);
  const updateDish = useDishStore((s) => s.updateDish);
  const currentUser = useUserStore((s) => s.currentUser);
  const dish = id ? dishes.find((d) => d.id === id) : undefined;
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const loadRestaurants = useRestaurantStore((s) => s.loadRestaurants);
  const restaurant = dish
    ? restaurants.find((r) => r.id === dish.restaurantId)
    : undefined;
  useEffect(() => {
    if (dish) loadRestaurants();
  }, [dish?.restaurantId, loadRestaurants]);

  const [name, setName] = useState("");

  useEffect(() => {
    if (dish) setName(dish.name);
  }, [dish?.id]);

  const canEdit =
    dish && canEditDish(dish, restaurant ?? undefined, currentUser);

  useEffect(() => {
    if (dish && !canEdit) {
      router.replace({ pathname: "/dish/[id]", params: { id: dish.id } });
    }
  }, [dish, canEdit, router, id]);

  const handleSave = () => {
    if (!dish || !id || !name.trim()) return;
    updateDish(id, { name: name.trim() });
    router.back();
  };

  if (!dish) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500">Dish not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!canEdit) {
    return null;
  }

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
        <Text className="text-xl font-bold text-black">Edit dish</Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-4 text-sm font-semibold text-gray-600">
          Dish name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Piri-Piri Chicken"
          className="mb-6 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <AnimatedPressable
          onPress={handleSave}
          disabled={!name.trim()}
          scale={0.98}
          className="rounded-xl bg-orange-500 py-3.5 disabled:opacity-50"
        >
          <Text className="text-center font-semibold text-white">Save</Text>
        </AnimatedPressable>
      </ScrollView>
    </SafeAreaView>
  );
}
