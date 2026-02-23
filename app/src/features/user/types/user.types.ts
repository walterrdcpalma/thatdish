export interface User {
  id: string;
  name: string;
  savedDishIds: string[];
  /** Client-side only; for like state when API does not send isLikedByCurrentUser. */
  likedDishIds: string[];
}
