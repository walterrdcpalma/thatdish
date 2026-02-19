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
  //apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.22:6000",
  //apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.20:6000",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://172.20.10.2:6000",
  devHostForImages: process.env.EXPO_PUBLIC_DEV_HOST ?? undefined,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
