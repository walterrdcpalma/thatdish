import type { Dish } from "../types";
import type { Restaurant } from "@/src/features/restaurant/types/restaurant.types";
import { getDistanceInKm } from "./getDistanceInKm";

/**
 * Returns non-archived dishes whose restaurant has latitude/longitude,
 * sorted ascending by distance from (userLat, userLng).
 * Pure calculation; does not store distance in state.
 */
export function getNearbyRankedDishes(
  dishes: Dish[],
  restaurants: Restaurant[],
  userLat: number,
  userLng: number
): Dish[] {
  const active = dishes.filter((d) => !d.isArchived);
  const withDistance = active
    .map((dish) => {
      const restaurant = restaurants.find((r) => r.id === dish.restaurantId);
      if (
        restaurant?.latitude == null ||
        restaurant?.longitude == null
      ) {
        return null;
      }
      const distance = getDistanceInKm(
        userLat,
        userLng,
        restaurant.latitude,
        restaurant.longitude
      );
      return { dish, distance };
    })
    .filter((x): x is { dish: Dish; distance: number } => x != null);
  return withDistance
    .sort((a, b) => a.distance - b.distance)
    .map(({ dish }) => dish);
}
