// App config: env, constants
// Replace with real env/constants (e.g. expo-constants) when needed

export const config: {
  env: string;
  apiBaseUrl: string;
  devHostForImages?: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
} = {
  env: "development",
  /** API base URL: set EXPO_PUBLIC_API_URL no .env. Default = Railway produção. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://thatdish-production.up.railway.app",
  devHostForImages: process.env.EXPO_PUBLIC_DEV_HOST ?? undefined,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
