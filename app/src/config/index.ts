// App config: env, constants
// Replace with real env/constants (e.g. expo-constants) when needed

export const config = {
  env: "development",
  /** Base URL for API (no trailing slash). Configure per environment. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5050",
} as const;
