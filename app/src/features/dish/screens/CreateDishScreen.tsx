import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";
import { useDishStore } from "../state";
import { createDishMultipart } from "@/src/shared/api/dishesApi";
import { config } from "@/src/config";

interface CreateDishScreenProps {
  showBackButton?: boolean;
}

export function CreateDishScreen({ showBackButton = true }: CreateDishScreenProps) {
  const router = useRouter();
  const loadDishes = useDishStore((s) => s.loadDishes);
  const [dishName, setDishName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
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
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("restaurantName", restName);
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
          <>
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
              className="mb-5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-black"
              placeholderTextColor="#9ca3af"
            />
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
