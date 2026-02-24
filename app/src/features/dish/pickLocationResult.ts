/**
 * Phase 1–3: Passes picked location (and optional reverse-geocode result) from
 * PickRestaurantLocationScreen back to CreateDishScreen (no backend persistence).
 */

export type PickedLocation = { lat: number; lng: number };

/** Result after confirm on map; includes coords and optional reverse-geocode display text. */
export interface PickedLocationResult extends PickedLocation {
  address?: string | null;
  city?: string | null;
  country?: string | null;
  displayText: string;
}

let lastPickedLocation: PickedLocationResult | null = null;

export function setLastPickedLocation(location: PickedLocationResult | null): void {
  lastPickedLocation = location;
}

export function consumeLastPickedLocation(): PickedLocationResult | null {
  const value = lastPickedLocation;
  lastPickedLocation = null;
  return value;
}

/**
 * Returns user-friendly location text for the form. No lat/lng in output.
 * Use the label from a PickedLocationResult when available; otherwise fallback.
 */
export function getLocationDisplayText(result: PickedLocationResult | null): string {
  if (result == null) return "Location not set";
  return result.displayText;
}
