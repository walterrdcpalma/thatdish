import type { Dish } from "../types";
import type { Restaurant } from "@/src/features/restaurant/types/restaurant.types";

export interface UserLike {
  id: string;
}

/**
 * A dish can be edited if the user is the creator OR the verified owner of the restaurant.
 */
export function canEditDish(
  dish: Dish,
  restaurant: Restaurant | undefined,
  currentUser: UserLike
): boolean {
  if (dish.createdByUserId === currentUser.id) return true;
  if (
    restaurant?.claimStatus === "Verified" &&
    (restaurant?.ownerUserId === currentUser.id ||
      restaurant?.claimedByUserId === currentUser.id)
  )
    return true;
  return false;
}
