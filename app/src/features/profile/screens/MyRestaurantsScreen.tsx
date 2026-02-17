import { View, Text, ScrollView, Image } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { AnimatedPressable } from "@/src/shared/components";

export function MyRestaurantsScreen() {
  const router = useRouter();
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const setClaimStatus = useRestaurantStore((s) => s.setClaimStatus);
  const currentUser = useUserStore((s) => s.currentUser);

  const myRestaurants = restaurants.filter(
    (r) => r.ownerUserId === currentUser.id
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.9}
          className="mr-3 p-1"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </AnimatedPressable>
        <Text className="text-xl font-bold text-black">My Restaurants</Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {myRestaurants.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-gray-500">No restaurants claimed yet.</Text>
            <Text className="mt-2 text-sm text-gray-400">
              Claim a restaurant from its detail page.
            </Text>
          </View>
        ) : (
          myRestaurants.map((restaurant, index) => (
            <Animated.View
              key={restaurant.id}
              entering={FadeInDown.delay(index * 60).springify().damping(15)}
            >
              <AnimatedPressable
                onPress={() =>
                  router.push({
                    pathname: "/restaurant/[id]",
                    params: { id: restaurant.id },
                  })
                }
                className="mb-3 overflow-hidden rounded-2xl bg-gray-100"
              >
              <View className="relative h-32 w-full overflow-hidden bg-gray-300">
                <Image
                  source={{
                    uri:
                      restaurant.imageUrl ??
                      "https://placehold.co/600x240/gray/white?text=Restaurant",
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-row items-center justify-between p-4">
                <Text className="text-lg font-semibold text-black flex-1">
                  {restaurant.name}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
              <View className="px-4 pb-4 flex-row items-center gap-2 flex-wrap">
                {restaurant.claimStatus === "pending" && (
                  <>
                    <View className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5">
                      <Text className="text-sm font-medium text-amber-700">
                        Pending
                      </Text>
                    </View>
                    <AnimatedPressable
                      onPress={() => setClaimStatus(restaurant.id, "verified")}
                      scale={0.96}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5"
                    >
                      <Text className="text-xs font-medium text-gray-600">
                        Simulate verify
                      </Text>
                    </AnimatedPressable>
                  </>
                )}
                {restaurant.claimStatus === "verified" && (
                  <View className="self-start flex-row items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5">
                    <Ionicons name="checkmark-circle" size={16} color="#c2410c" />
                    <Text className="text-sm font-medium text-orange-700">
                      Verified
                    </Text>
                  </View>
                )}
              </View>
              </AnimatedPressable>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
