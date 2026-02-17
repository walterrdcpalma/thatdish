import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDishStore } from "../state";
import type { Dish } from "../types";

export function CreateDishScreen() {
  const router = useRouter();
  const addDish = useDishStore((s) => s.addDish);
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  const handleCreate = () => {
    const id = Date.now().toString();
    const restaurantId = "new-" + id;
    const dish: Dish = {
      id,
      name: name.trim(),
      restaurantId,
      restaurantName: restaurantName.trim(),
      savedCount: 0,
      createdAt: new Date().toISOString(),
    };
    addDish(dish);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 p-5">
        <Text className="mb-4 text-lg font-semibold text-black">
          New dish
        </Text>
        <Text className="mb-1 text-sm text-gray-600">Dish name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Piri-Piri Chicken"
          className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <Text className="mb-1 text-sm text-gray-600">Restaurant name</Text>
        <TextInput
          value={restaurantName}
          onChangeText={setRestaurantName}
          placeholder="e.g. Joe's Tavern"
          className="mb-6 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <Pressable
          onPress={handleCreate}
          disabled={!name.trim() || !restaurantName.trim()}
          className="rounded-xl bg-orange-500 py-3.5 active:opacity-90 disabled:opacity-50"
        >
          <Text className="text-center font-semibold text-white">Create</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
