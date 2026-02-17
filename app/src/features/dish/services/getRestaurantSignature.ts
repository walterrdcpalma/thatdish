import type { Dish } from "../types";

/**
 * Returns the signature dish for a restaurant: the dish with the highest savedCount
 * among all dishes for that restaurantId. Returns undefined if no dishes exist for the restaurant.
 */
export function getRestaurantSignature(
  dishes: Dish[],
  restaurantId: string
): Dish | undefined {
  const forRestaurant = dishes.filter((d) => d.restaurantId === restaurantId);
  if (forRestaurant.length === 0) return undefined;
  return forRestaurant.reduce((best, d) =>
    d.savedCount > best.savedCount ? d : best
  );
}
