import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/src/features/user/state";
import { AnimatedPressable } from "@/src/shared/components";

export function ProfileScreen() {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.currentUser);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
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
              {currentUser.name}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              user@email.com
            </Text>
          </View>

          <View className="mt-8 gap-1">
            <AnimatedPressable
              onPress={() => router.push("/my-restaurants")}
              className="flex-row items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="restaurant-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800">My Restaurants</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => router.push("/my-contributions")}
              className="flex-row items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="bookmark-outline" size={22} color="#374151" />
                <Text className="text-base text-gray-800">My Contributions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </AnimatedPressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
