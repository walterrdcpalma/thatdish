import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDishStore } from "../state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { useUserStore } from "@/src/features/user/state";
import { getRestaurantSignature, canEditDish } from "../services";
import { AnimatedPressable } from "@/src/shared/components";

export function DishDetailScreen() {
  const { id, from, fromRestaurant } = useLocalSearchParams<{
    id: string;
    from?: string;
    fromRestaurant?: string;
  }>();
  const router = useRouter();
  const showEditActions =
    from === "contributions" || from === "my-restaurants";
  const showViewRestaurant = !fromRestaurant;
  const dishes = useDishStore((s) => s.dishes);
  const toggleSave = useDishStore((s) => s.toggleSave);
  const archiveDish = useDishStore((s) => s.archiveDish);
  const restoreDish = useDishStore((s) => s.restoreDish);
  const currentUser = useUserStore((s) => s.currentUser);
  const dish = id ? dishes.find((d) => d.id === id) : undefined;
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const restaurant = dish
    ? restaurants.find((r) => r.id === dish.restaurantId)
    : undefined;
  const restaurantName = dish?.restaurantName ?? restaurant?.name ?? "Unknown";
  const signature = dish
    ? getRestaurantSignature(dishes, dish.restaurantId)
    : undefined;
  const isSignature = dish && !dish.isArchived && signature?.id === dish.id;
  const isSaved = dish ? currentUser.savedDishIds.includes(dish.id) : false;
  const canEdit =
    dish && canEditDish(dish, restaurant ?? undefined, currentUser);

  if (!dish) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">Dish not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-100 px-4 py-2">
        <AnimatedPressable
          onPress={() => router.back()}
          scale={0.98}
          className="mr-2 flex-row items-center gap-2 py-2"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-base text-gray-700">Back</Text>
        </AnimatedPressable>
      </View>
      <View className="relative h-72 w-full overflow-hidden bg-gray-200">
        <Image
          source={{
            uri:
              dish.image
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
        {isSignature && (
          <View className="absolute right-3 top-3 rounded-full bg-black/60 px-4 py-2">
            <Text className="text-xs font-semibold uppercase tracking-wide text-white">
              House Special
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 p-5">
        {dish.isArchived && (
          <View className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <Text className="text-sm font-medium text-amber-800">Archived</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-black">{dish.name}</Text>
        <Text className="mt-1 text-base text-gray-600">{restaurantName}</Text>
        {dish.foodType ? (
          <Text className="mt-1 text-sm text-gray-500">{dish.foodType}</Text>
        ) : null}
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">{dish.savesCount} saved</Text>
          {!dish.isArchived && (
            <AnimatedPressable
              onPress={() => toggleSave(dish.id)}
              scale={0.97}
              className="rounded-full border border-gray-300 bg-gray-50 p-2.5"
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={22}
                color="#f97316"
              />
            </AnimatedPressable>
          )}
        </View>
        {canEdit && showEditActions && (
          <View className="mt-4 gap-2">
            <AnimatedPressable
              onPress={() =>
                router.push({
                  pathname: "/dish/edit",
                  params: { id: dish.id },
                })
              }
              scale={0.98}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3"
            >
              <Text className="font-medium text-gray-700">Edit dish</Text>
            </AnimatedPressable>
            {dish.createdByUserId === currentUser.id && (
              dish.isArchived ? (
                <AnimatedPressable
                  onPress={() => restoreDish(dish.id)}
                  scale={0.98}
                  className="rounded-xl border border-gray-300 bg-white py-3"
                >
                  <Text className="text-center font-medium text-gray-700">
                    Restore dish
                  </Text>
                </AnimatedPressable>
              ) : (
                <AnimatedPressable
                  onPress={() => archiveDish(dish.id)}
                  scale={0.98}
                  className="rounded-xl border border-amber-300 bg-amber-50 py-3"
                >
                  <Text className="text-center font-medium text-amber-800">
                    Archive dish
                  </Text>
                </AnimatedPressable>
              )
            )}
          </View>
        )}
        {showViewRestaurant && (
          <AnimatedPressable
            onPress={() =>
              router.push({
                pathname: "/restaurant/[id]",
                params: { id: dish.restaurantId },
              })
            }
            scale={0.98}
            className="mt-6 rounded-xl bg-orange-500 py-3.5"
          >
            <Text className="text-center font-semibold text-white">
              View Restaurant
            </Text>
          </AnimatedPressable>
        )}
      </View>
    </SafeAreaView>
  );
}
