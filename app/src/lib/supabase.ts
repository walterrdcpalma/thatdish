import { createClient } from "@supabase/supabase-js";
import { config } from "@/src/config";

/** SSR-safe storage: stub in Node, localStorage on web, AsyncStorage on native. */
function getStorageAdapter() {
  const isNode =
    typeof process !== "undefined" && process.versions?.node != null;
  if (isNode) {
    return {
      getItem: async (_key: string) => null as string | null,
      setItem: async (_key: string, _value: string) => {},
      removeItem: async (_key: string) => {},
    };
  }
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        localStorage.removeItem(key);
      },
    };
  }
  const AsyncStorage = require("@react-native-async-storage/async-storage")
    .default as { getItem: (k: string) => Promise<string | null>; setItem: (k: string, v: string) => Promise<void>; removeItem: (k: string) => Promise<void> };
  return {
    getItem: (key: string) => AsyncStorage.getItem(key),
    setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: (key: string) => AsyncStorage.removeItem(key),
  };
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: getStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
