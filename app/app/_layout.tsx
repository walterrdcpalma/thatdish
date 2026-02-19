import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/src/features/auth/context/AuthContext";

// Hermes validation (remove after confirming): run app and check console for "Hermes enabled: true"
if (typeof global !== "undefined") {
  const isHermes = (global as unknown as { HermesInternal?: unknown }).HermesInternal != null;
  console.log("Hermes enabled:", isHermes);
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
