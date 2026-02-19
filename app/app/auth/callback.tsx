import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/src/lib/supabase";

/**
 * OAuth callback route. Handles redirect after Google sign-in:
 * - Web: browser lands on /auth/callback#access_token=... (from Supabase redirect)
 * - Native: app can open via deep link app://auth/callback#...
 * Reads tokens from URL hash, sets session, then redirects to Profile.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      let url: string | undefined;
      if (typeof window !== "undefined" && window.location?.href) {
        url = window.location.href;
      } else if (Platform.OS !== "web") {
        url = await Linking.getInitialURL() ?? undefined;
      }
      if (!url || !url.includes("#")) {
        if (mounted) setError("No auth data in URL");
        return;
      }

      const hashPart = url.split("#")[1] ?? "";
      const params = new URLSearchParams(hashPart);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        if (mounted) setError("Missing tokens");
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (!mounted) return;
      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      router.replace("/(tabs)/profile");
    };

    run();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "#b91c1c", textAlign: "center" }}>{error}</Text>
        <Text
          style={{ marginTop: 12, color: "#2563eb" }}
          onPress={() => router.replace("/(tabs)/profile")}
        >
          Voltar ao Profile
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12, color: "#6b7280" }}>A concluir o login…</Text>
    </View>
  );
}
