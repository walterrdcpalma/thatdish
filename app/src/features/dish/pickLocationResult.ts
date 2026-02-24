/**
 * Phase 1: Frontend-only. Passes picked location from PickRestaurantLocationScreen
 * back to CreateDishScreen (no backend persistence).
 */

export type PickedLocation = { lat: number; lng: number };

let lastPickedLocation: PickedLocation | null = null;

export function setLastPickedLocation(location: PickedLocation | null): void {
  lastPickedLocation = location;
}

export function consumeLastPickedLocation(): PickedLocation | null {
  const value = lastPickedLocation;
  lastPickedLocation = null;
  return value;
}
