import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getDishes } from '@/src/api/dishes';
import { FOOD_TYPE_FILTERS } from '@/src/types/dish';
import type { Dish } from '@/src/types/dish';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const loadDishes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getDishes({
        foodType: selectedFilter ?? undefined,
        page: 1,
        pageSize: 50,
      });
      setDishes(data);
    } catch (e) {
      console.warn('Failed to load dishes:', e);
      setDishes([]);
      setError('Não foi possível carregar. Certifica-te que a API está a correr (cd src && dotnet run --project ThatDish.Api).');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const onRefresh = useCallback(() => {
    loadDishes(true);
  }, [loadDishes]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header: logo + thatdish */}
      <View
        className="pt-14 pb-4 px-5 border-b border-black/5"
        style={{ backgroundColor: colors.background }}>
        <View className="flex-row items-center gap-2.5">
          <FontAwesome name="cutlery" size={28} color={colors.tint} />
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            thatdish
          </Text>
        </View>
      </View>

      {/* Category filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {FOOD_TYPE_FILTERS.map(({ value, label }) => {
          const isSelected =
            (value === null && selectedFilter === null) ||
            (value !== null && selectedFilter === value);
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setSelectedFilter(value)}
              className="px-4 py-2 rounded-full mr-2"
              style={{
                backgroundColor: isSelected ? colors.tint : 'rgba(0,0,0,0.06)',
              }}>
              <Text
                className="text-sm font-semibold"
                style={{ color: isSelected ? '#fff' : colors.text }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dish list */}
      {loading ? (
        <View className="flex-1 justify-center items-center py-12">
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center py-12">
          <Text className="text-base text-center px-6" style={{ color: colors.text }}>
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
          }
          renderItem={({ item }) => (
            <View
              className="rounded-xl overflow-hidden mb-4 shadow-sm"
              style={{ backgroundColor: colors.background, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full h-48 bg-neutral-200"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                  numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  className="text-sm mt-1"
                  style={{ color: colors.tabIconDefault }}
                  numberOfLines={1}>
                  {item.restaurantName}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-base" style={{ color: colors.tabIconDefault }}>
                Nenhum prato encontrado.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
