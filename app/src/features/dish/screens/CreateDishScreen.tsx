import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { useDishStore } from "../state";

interface CreateDishScreenProps {
  showBackButton?: boolean;
}

export function CreateDishScreen({ showBackButton = true }: CreateDishScreenProps) {
  const router = useRouter();
  const createDish = useDishStore((s) => s.createDish);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    const name = dishName.trim();
    const restName = restaurantName.trim();
    if (!name || !restName) {
      setError("Dish name and restaurant name are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createDish(name, restName, "Other", "");
      if (!isMountedRef.current) return;
      setDishName("");
      setRestaurantName("");
      if (showBackButton) router.back();
    } catch (e) {
      if (isMountedRef.current) setError(e instanceof Error ? e.message : "Failed to create dish.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
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
          onChangeText={(t) => { setDishName(t); setError(null); }}
          placeholder="e.g. Piri-Piri Chicken"
          className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
        <Text className="mb-2 text-sm font-semibold text-gray-600">Restaurant name</Text>
        <TextInput
          value={restaurantName}
          onChangeText={(t) => { setRestaurantName(t); setError(null); }}
          placeholder="e.g. Nando's"
          className="mb-4 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
          placeholderTextColor="#9ca3af"
        />
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
    </SafeAreaView>
  );
}
