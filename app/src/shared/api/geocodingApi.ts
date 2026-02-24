/**
 * Reverse geocoding (MVP: OpenStreetMap Nominatim).
 * Frontend-only; no backend persistence.
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const REQUEST_TIMEOUT_MS = 8000;
const USER_AGENT = "ThatDish/1.0 (Add Dish location)";

export interface ReverseGeocodeResult {
  address?: string;
  city?: string;
  country?: string;
  displayText: string;
}

/** Build displayText with priority: address > city+country > country > fallback */
function buildDisplayText(
  address: string | undefined,
  city: string | undefined,
  country: string | undefined,
  fallback: string
): string {
  if (address != null && address.trim() !== "") return address.trim();
  const parts: string[] = [];
  if (city != null && city.trim() !== "") parts.push(city.trim());
  if (country != null && country.trim() !== "") parts.push(country.trim());
  if (parts.length > 0) return parts.join(", ");
  if (country != null && country.trim() !== "") return country.trim();
  return fallback;
}

/** Raw Nominatim address shape */
interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  [key: string]: string | undefined;
}

function formatAddressLine(addr: NominatimAddress): string {
  const parts: string[] = [];
  if (addr.house_number != null && addr.road != null) {
    parts.push(`${addr.road} ${addr.house_number}`);
  } else if (addr.road != null) {
    parts.push(addr.road);
  }
  const locality = addr.city ?? addr.town ?? addr.village ?? addr.suburb;
  if (locality != null) parts.push(locality);
  if (addr.country != null) parts.push(addr.country);
  return parts.filter(Boolean).join(", ");
}

/**
 * Reverse geocode lat/lng to address text. Uses Nominatim (OSM).
 * On timeout or error returns safe fallback with displayText only.
 * Pass signal to cancel when a newer request is made (e.g. user confirms again).
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<ReverseGeocodeResult> {
  const fallback: ReverseGeocodeResult = {
    displayText: "Location selected",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener("abort", () => {
      controller.abort();
      clearTimeout(timeoutId);
    });
  }

  try {
    const url = `${NOMINATIM_URL}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&format=json`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return fallback;

    const data = (await res.json()) as {
      address?: NominatimAddress;
      display_name?: string;
    };
    const addr = data.address;
    if (!addr || typeof addr !== "object") return fallback;

    const city = addr.city ?? addr.town ?? addr.village ?? addr.state;
    const country = addr.country;
    const addressLine = formatAddressLine(addr);

    return {
      address: addressLine.trim() || undefined,
      city: typeof city === "string" ? city : undefined,
      country: typeof country === "string" ? country : undefined,
      displayText: buildDisplayText(addressLine || undefined, city, country, "Location selected"),
    };
  } catch {
    clearTimeout(timeoutId);
    return fallback;
  }
}
