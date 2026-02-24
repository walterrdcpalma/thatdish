import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { AuthScreen } from "@/src/features/auth/screens/AuthScreen";
import { AnimatedPressable } from "@/src/shared/components";

function ProfileLoggedInContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "User";
  const email = user?.email ?? "";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="p-5">
        <Text className="text-2xl font-bold text-black">Profile</Text>
        <View className="mt-6 items-center">
          <View className="h-20 w-20 rounded-full bg-gray-200 items-center justify-center">
            <Ionicons name="person" size={40} color="#9ca3af" />
          </View>
          <Text className="mt-3 text-lg font-semibold text-black">
            {displayName}
          </Text>
          <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
            {email}
          </Text>
        </View>

        <View className="mt-8 w-full gap-1">
          <AnimatedPressable
            onPress={() => router.push("/saved")}
            className="w-full rounded-xl bg-gray-50 px-4 py-3"
          >
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="bookmark-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  Saved
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/my-restaurants")}
            className="w-full rounded-xl bg-gray-50 px-4 py-3"
          >
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="restaurant-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  My Restaurants
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/my-contributions")}
            className="w-full rounded-xl bg-gray-50 px-4 py-3"
          >
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="bookmark-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  My Contributions
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/settings")}
            className="w-full rounded-xl bg-gray-50 px-4 py-3"
          >
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="settings-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
        </View>

        <AnimatedPressable
          onPress={handleSignOut}
          disabled={signingOut}
          className="mt-8 w-full flex-row items-center justify-center gap-2 rounded-xl bg-red-50 py-3.5"
        >
          {signingOut ? (
            <ActivityIndicator size="small" color="#b91c1c" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={22} color="#b91c1c" />
              <Text className="text-base font-medium text-red-700">Sign out</Text>
            </View>
          )}
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
}

export function ProfileScreen() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-3 text-gray-500">Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ProfileLoggedInContent />
    </SafeAreaView>
  );
}
