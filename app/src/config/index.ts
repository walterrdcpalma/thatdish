// App config: env, constants
// Replace with real env/constants (e.g. expo-constants) when needed

export const config = {
  env: "development",
  /** Base URL for API (no trailing slash). Configure per environment. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5050",
  /**
   * When set (e.g. machine IP on device), image URLs containing "localhost" are rewritten to this host.
   * Use EXPO_PUBLIC_DEV_HOST for emulator/device so API-served images load.
   */
  devHostForImages: process.env.EXPO_PUBLIC_DEV_HOST ?? undefined,
} as const;
