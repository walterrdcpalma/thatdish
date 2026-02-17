import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DishCard } from "../components";
import { useDishStore } from "../state";
import { useUserStore } from "@/src/features/user/state";
import { useRestaurantStore } from "@/src/features/restaurant/state";
import { getSignatureDish } from "@/src/features/restaurant/services";

export function UserContributionsScreen() {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.currentUser);
  const dishes = useDishStore((s) => s.dishes);
  const restaurants = useRestaurantStore((s) => s.restaurants);

  const myDishes = dishes.filter(
    (dish) => dish.createdByUserId === currentUser.id
  );

  const renderItem = ({ item: dish }: { item: (typeof myDishes)[0] }) => {
    const signature = getSignatureDish(dish.restaurantId, restaurants, dishes);
    const isSignature = signature?.id === dish.id;
    return (
      <DishCard
        dish={dish}
        onPress={() =>
          router.push({ pathname: "/dish/[id]", params: { id: dish.id } })
        }
        isSignature={isSignature}
      />
    );
  };

  if (myDishes.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 p-1" hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
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
        <Pressable onPress={() => router.back()} className="mr-3 p-1" hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
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
