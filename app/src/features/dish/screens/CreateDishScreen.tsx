import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";

interface CreateDishScreenProps {
  showBackButton?: boolean;
}

export function CreateDishScreen({ showBackButton = true }: CreateDishScreenProps) {
  const router = useRouter();
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");

  const handleSubmit = () => {
    console.log("Create Dish:", { dishName: dishName.trim(), restaurantName: restaurantName.trim() });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        {showBackButton && (
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
        <Text className="text-xl font-bold text-black">Create dish</Text>
      </View>
      <View className="flex-1 p-5">
        <Text className="mb-2 text-sm font-semibold text-gray-600">Dish name</Text>
        <TextInput
          value={dishName}
          onChangeText={setDishName}
          placeholder="e.g. Piri-Piri Chicken"
          className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <Text className="mb-2 text-sm font-semibold text-gray-600">Restaurant name</Text>
        <TextInput
          value={restaurantName}
          onChangeText={setRestaurantName}
          placeholder="e.g. Nando's"
          className="mb-8 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <AnimatedPressable
          onPress={handleSubmit}
          scale={0.98}
          className="rounded-xl bg-orange-500 py-3.5"
        >
          <Text className="text-center font-semibold text-white">Create Dish</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}
