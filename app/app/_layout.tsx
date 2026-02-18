import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRestaurantStore } from "@/src/features/restaurant/state";

// Hermes validation (remove after confirming): run app and check console for "Hermes enabled: true"
if (typeof global !== "undefined") {
  const isHermes = (global as unknown as { HermesInternal?: unknown }).HermesInternal != null;
  console.log("Hermes enabled:", isHermes);
}

export default function RootLayout() {
  const loadRestaurants = useRestaurantStore((s) => s.loadRestaurants);
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
