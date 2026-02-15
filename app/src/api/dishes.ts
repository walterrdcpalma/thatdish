import { API_URL } from '@/src/config';
import type { Dish } from '@/src/types/dish';

export async function getDishes(options?: {
  foodType?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<Dish[]> {
  const params = new URLSearchParams();
  if (options?.foodType != null && options.foodType !== '') {
    params.set('foodType', options.foodType);
  }
  if (options?.page != null) params.set('page', String(options.page));
  if (options?.pageSize != null) params.set('pageSize', String(options.pageSize));

  const url = `${API_URL}/api/dishes${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = (await res.json()) as Array<{
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
    foodType: string;
    isMainDish: boolean;
    restaurantName: string;
    restaurantId: string;
  }>;

  return data.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    imageUrl: d.imageUrl,
    foodType: d.foodType as Dish['foodType'],
    isMainDish: d.isMainDish,
    restaurantName: d.restaurantName,
    restaurantId: d.restaurantId,
  }));
}
