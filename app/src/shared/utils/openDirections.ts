import { Alert, Linking, Platform } from "react-native";

const LAT_MIN = -90;
const LAT_MAX = 90;
const LNG_MIN = -180;
const LNG_MAX = 180;

/** Validates latitude and longitude for opening maps/directions. */
export function isLatLngValid(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= LAT_MIN &&
    lat <= LAT_MAX &&
    lng >= LNG_MIN &&
    lng <= LNG_MAX
  );
}

const APPLE_MAPS_IOS = "http://maps.apple.com/?daddr=";
const GOOGLE_MAPS_APP = "comgooglemaps://";
const GOOGLE_MAPS_WEB = "https://www.google.com/maps/dir/?api=1&destination=";
const WAZE_APP = "waze://";

function appleMapsUrl(lat: number, lng: number): string {
  return `${APPLE_MAPS_IOS}${lat},${lng}`;
}

function googleMapsAppUrl(lat: number, lng: number): string {
  return `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
}

function googleMapsWebUrl(lat: number, lng: number): string {
  return `${GOOGLE_MAPS_WEB}${lat},${lng}`;
}

function wazeUrl(lat: number, lng: number): string {
  return `waze://?ll=${lat},${lng}&navigate=yes`;
}

/** Android geo intent: opens default map app or chooser. */
function geoUrl(lat: number, lng: number, label: string): string {
  const q = label ? `${lat},${lng}(${encodeURIComponent(label)})` : `${lat},${lng}`;
  return `geo:${lat},${lng}?q=${q}`;
}

export type DirectionsApp = "apple" | "google" | "waze" | "geo" | "web";

export interface DirectionsOption {
  id: DirectionsApp;
  label: string;
  open: () => Promise<void>;
}

/** Builds list of available directions options (checks canOpenURL where needed). */
export async function getDirectionsOptions(
  lat: number,
  lng: number,
  label: string
): Promise<DirectionsOption[]> {
  const options: DirectionsOption[] = [];

  const openUrl = async (url: string): Promise<void> => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      throw new Error("Cannot open URL");
    }
  };

  // Apple Maps: iOS always; on Android not typically available
  if (Platform.OS === "ios") {
    options.push({
      id: "apple",
      label: "Apple Maps",
      open: () => openUrl(appleMapsUrl(lat, lng)),
    });
  }

  // Google Maps app (requires LSApplicationQueriesSchemes on iOS)
  try {
    const canGoogle = await Linking.canOpenURL(GOOGLE_MAPS_APP);
    if (canGoogle) {
      options.push({
        id: "google",
        label: "Google Maps",
        open: () => openUrl(googleMapsAppUrl(lat, lng)),
      });
    }
  } catch {
    // ignore
  }

  // Waze (optional; requires LSApplicationQueriesSchemes on iOS)
  try {
    const canWaze = await Linking.canOpenURL(WAZE_APP);
    if (canWaze) {
      options.push({
        id: "waze",
        label: "Waze",
        open: () => openUrl(wazeUrl(lat, lng)),
      });
    }
  } catch {
    // ignore
  }

  // Android: geo intent (opens system chooser)
  if (Platform.OS === "android") {
    options.push({
      id: "geo",
      label: "Open in Maps",
      open: () => openUrl(geoUrl(lat, lng, label)),
    });
  }

  // Web fallback (Google Maps in browser) – works everywhere
  options.push({
    id: "web",
    label: Platform.OS === "ios" ? "Google Maps (browser)" : "Google Maps (browser)",
    open: () => openUrl(googleMapsWebUrl(lat, lng)),
  });

  return options;
}

const COULD_NOT_OPEN = "Could not open maps app.";

/**
 * Opens directions to the given coordinates.
 * Shows an action chooser (Alert with buttons) when multiple apps are available;
 * otherwise opens the single fallback (e.g. Apple Maps on iOS, geo on Android, or web).
 * On failure shows an alert with "Could not open maps app."
 */
export async function openDirections(
  lat: number,
  lng: number,
  label?: string
): Promise<void> {
  if (!isLatLngValid(lat, lng)) {
    Alert.alert("Invalid location", COULD_NOT_OPEN);
    return;
  }

  const trimmedLabel = label?.trim() ?? "";
  const options = await getDirectionsOptions(lat, lng, trimmedLabel);

  if (options.length === 0) {
    Alert.alert("Error", COULD_NOT_OPEN);
    return;
  }

  if (options.length === 1) {
    try {
      await options[0].open();
    } catch {
      Alert.alert("Error", COULD_NOT_OPEN);
    }
    return;
  }

  const buttons = [
    ...options.map((opt) => ({
      text: opt.label,
      onPress: async () => {
        try {
          await opt.open();
        } catch {
          Alert.alert("Error", COULD_NOT_OPEN);
        }
      },
    })),
    { text: "Cancel", style: "cancel" as const },
  ];

  Alert.alert("Go there", "Choose an app to open directions.", buttons);
}
