import type { Dish } from "@/src/features/dish/types";
import type { Restaurant } from "../types/restaurant.types";

/**
 * Returns the signature dish for a restaurant.
 * - If the restaurant has an explicit signatureDishId, returns that dish (when found in dishes and belonging to the restaurant).
 * - Otherwise returns the most-saved dish for that restaurant.
 * Returns undefined if no restaurant, no matching dish, or no dishes for the restaurant.
 */
export function getSignatureDish(
  restaurantId: string,
  restaurants: Restaurant[],
  dishes: Dish[]
): Dish | undefined {
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return undefined;

  const forRestaurant = dishes.filter((d) => d.restaurantId === restaurantId);
  if (forRestaurant.length === 0) return undefined;

  if (restaurant.signatureDishId) {
    const explicit = forRestaurant.find((d) => d.id === restaurant.signatureDishId);
    if (explicit) return explicit;
  }

  return forRestaurant.reduce((best, d) =>
    d.savedCount > best.savedCount ? d : best
  );
}
