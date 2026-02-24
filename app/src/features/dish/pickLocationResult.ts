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

/**
 * Returns user-friendly location text for the form. No lat/lng in output.
 * In a later phase, pass address (e.g. from reverse geocode) to show address/city instead of "Location selected".
 */
export function getLocationDisplayText(
  _location: PickedLocation | null,
  address: string | null
): string {
  if (_location == null) return "Location not set";
  if (address != null && address.trim() !== "") return address.trim();
  return "Location selected";
}
