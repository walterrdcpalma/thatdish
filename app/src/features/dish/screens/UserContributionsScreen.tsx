import { View, Text, FlatList } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { getSignatureDish } from "@/src/features/restaurant/services";
import { AnimatedPressable } from "@/src/shared/components";

export function UserContributionsScreen() {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.currentUser);
  const dishes = useDishStore((s) => s.dishes);
  const restaurants = useRestaurantStore((s) => s.restaurants);

  const myDishes = dishes.filter(
    (dish) => dish.createdByUserId === currentUser.id
  );

  const renderItem = ({
    item: dish,
    index,
  }: {
    item: (typeof myDishes)[0];
    index: number;
  }) => {
    const signature = getSignatureDish(dish.restaurantId, restaurants, dishes);
    const isSignature = signature?.id === dish.id;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 60).springify().damping(15)}
      >
        <DishCard
          dish={dish}
          onPress={() =>
            router.push({ pathname: "/dish/[id]", params: { id: dish.id } })
          }
          isSignature={isSignature}
        />
      </Animated.View>
    );
  };

  if (myDishes.length === 0) {
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
        <Text className="text-xl font-bold text-black">My Contributions</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-gray-500">
            You haven't added any dishes yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text className="text-xl font-bold text-black">My Contributions</Text>
      </View>
      <FlatList
        data={myDishes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
