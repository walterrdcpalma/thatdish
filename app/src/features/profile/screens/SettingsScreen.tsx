import { useState } from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedPressable } from "@/src/shared/components";

const APP_VERSION = "1.0.0";

export function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="border-b border-gray-100 px-4 pb-3 pt-1">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.98}
          className="mb-2 flex-row items-center gap-2 py-2"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-base text-gray-700">Back</Text>
        </AnimatedPressable>
        <Text className="text-2xl font-bold text-black">Settings</Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Account
        </Text>
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <AnimatedPressable onPress={() => {}} scale={0.99} className="w-full px-4 py-3">
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="lock-closed-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  Change password
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
        </View>

        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Preferences
        </Text>
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="notifications-outline" size={22} color="#374151" />
              <Text className="text-base text-gray-800">Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#d1d5db", true: "#f97316" }}
              thumbColor="#fff"
            />
          </View>
          <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="moon-outline" size={22} color="#374151" />
              <Text className="text-base text-gray-800">Dark mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#d1d5db", true: "#f97316" }}
              thumbColor="#fff"
            />
          </View>
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="globe-outline" size={22} color="#374151" />
              <Text className="text-base text-gray-800">Language</Text>
            </View>
            <Text className="text-base text-gray-500">English</Text>
          </View>
        </View>

        <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          About
        </Text>
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <AnimatedPressable
            onPress={() => {}}
            scale={0.99}
            className="w-full border-b border-gray-100 px-4 py-3"
          >
            <View className="flex-row items-center justify-between" style={{ width: "100%" }}>
              <View className="flex-row flex-1 items-center gap-3" style={{ minWidth: 0 }}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800" numberOfLines={1}>
                  Privacy policy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </AnimatedPressable>
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-base text-gray-800">Version</Text>
            <Text className="text-base text-gray-500">{APP_VERSION}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
