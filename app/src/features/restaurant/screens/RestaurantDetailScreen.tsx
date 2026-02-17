import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRestaurantStore } from "../state";
import { useDishStore } from "@/src/features/dish/state";
import { useUserStore } from "@/src/features/user/state";
import { getSignatureDish } from "../services";
import { AnimatedPressable } from "@/src/shared/components";

const MAX_RESTAURANT_PHOTOS = 3;

export function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const setSignatureDish = useRestaurantStore((s) => s.setSignatureDish);
  const restaurant = id ? restaurants.find((r) => r.id === id) : undefined;
  const dishes = useDishStore((s) => s.dishes);
  const currentUser = useUserStore((s) => s.currentUser);
  const signature = restaurant
    ? getSignatureDish(restaurant.id, restaurants, dishes)
    : undefined;
  const restaurantDishes = restaurant
    ? dishes.filter((d) => d.restaurantId === restaurant.id).slice(0, MAX_RESTAURANT_PHOTOS)
    : [];

  if (!restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="p-5">
          <Text className="text-2xl font-bold text-black">{restaurant.name}</Text>
          <Text className="mt-2 text-base text-gray-600">
            {restaurant.location}
          </Text>
          <View className="mt-4 flex-row flex-wrap items-center gap-2">
            {restaurant.claimStatus === "verified" && (
              <View className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Text className="text-sm text-gray-600">✓ Verified</Text>
              </View>
            )}
            {restaurant.claimStatus === "pending" && (
              <View className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                <Text className="text-sm text-amber-700">Pending</Text>
              </View>
            )}
            {restaurant.claimStatus === "unclaimed" && (
              <AnimatedPressable
                onPress={() =>
                  router.push({
                    pathname: "/claim/[restaurantId]",
                    params: { restaurantId: restaurant.id },
                  })
                }
                scale={0.98}
                className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2"
              >
                <Text className="text-sm font-medium text-orange-700">
                  Claim Restaurant
                </Text>
              </AnimatedPressable>
            )}
          </View>
        </View>
        <View className="px-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {restaurantDishes.map((dish, index) => {
              const isSignature = signature?.id === dish.id;
              const isOwner = restaurant.ownerUserId === currentUser.id;
              return (
                <View
                  key={dish.id}
                  style={index > 0 ? { marginLeft: 12 } : undefined}
                  className="w-64"
                >
                  <AnimatedPressable
                    onPress={() =>
                      router.push({
                        pathname: "/dish/[id]",
                        params: { id: dish.id },
                      })
                    }
                    className="overflow-hidden rounded-2xl bg-gray-200"
                  >
                    <View className="relative h-40 w-full">
                    <Image
                      source={{
                        uri:
                          dish.imagePlaceholder ??
                          "https://placehold.co/256x160/gray/white?text=Dish",
                      }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                      <View className="absolute inset-0 bg-black/30" />
                      {isSignature && (
                        <View className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1">
                          <Text className="text-[10px] font-semibold uppercase tracking-wide text-white">
                            Especialidade da Casa
                          </Text>
                        </View>
                      )}
                      <View className="absolute bottom-0 left-0 right-0 p-3">
                        <Text className="text-sm font-bold text-white">
                          {dish.name}
                        </Text>
                      </View>
                    </View>
                  </AnimatedPressable>
                  {isOwner && (
                    <AnimatedPressable
                      onPress={() => setSignatureDish(restaurant.id, dish.id)}
                      scale={0.98}
                      className="mt-2 rounded-lg border border-gray-300 bg-white py-2"
                    >
                      <Text className="text-center text-xs font-medium text-gray-700">
                        Definir como Assinatura
                      </Text>
                    </AnimatedPressable>
                  )}
                </View>
              );
            })}
            {restaurantDishes.length < MAX_RESTAURANT_PHOTOS && (
              <AnimatedPressable
                style={
                  restaurantDishes.length > 0 ? { marginLeft: 12 } : undefined
                }
                onPress={() =>
                  router.push({
                    pathname: "/dish/create",
                    params: { restaurantId: restaurant.id },
                  })
                }
                scale={0.98}
                className="h-40 w-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50"
              >
                <Ionicons name="add" size={40} color="#9ca3af" />
                <Text className="mt-2 text-sm font-medium text-gray-500">
                  Add dish
                </Text>
              </AnimatedPressable>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
