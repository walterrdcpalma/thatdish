import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "@/src/lib/supabase";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Opens Apple OAuth via Supabase and handles redirect back to the app.
 * Same redirect pattern as Google: web uses origin/callback, native uses makeRedirectUri.
 */
export async function signInWithApple(): Promise<{ error?: string }> {
  try {
    let redirectUri: string;
    if (Platform.OS === "web") {
      redirectUri =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "";
    } else {
      redirectUri = AuthSession.makeRedirectUri({
        path: "auth/callback",
        preferLocalhost: false,
      });
    }

    if (!redirectUri) {
      return { error: "Could not determine redirect URL" };
    }

    if (isNative && redirectUri.includes("localhost")) {
      return {
        error:
          "Invalid redirect for device. Add the redirect URL in Supabase (Auth > URL Configuration).",
      };
    }

    if (__DEV__ && isNative) {
      console.log(
        "[Auth] Apple redirect URL for Supabase:",
        redirectUri
      );
    }

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: redirectUri,
      },
    });

    if (oauthError) {
      return { error: oauthError.message };
    }
    if (!data?.url) {
      return { error: "No auth URL returned" };
    }

    if (Platform.OS === "web") {
      window.location.href = data.url;
      return {};
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === "dismiss") {
      return { error: "Sign in was cancelled" };
    }
    if (result.type !== "success" || !result.url) {
      return { error: "Sign in failed" };
    }

    const url = result.url;
    const hashPart = url.includes("#") ? url.split("#")[1] : "";
    if (!hashPart) {
      return { error: "No tokens in redirect" };
    }

    const params = new URLSearchParams(hashPart);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      return { error: "Missing tokens from provider" };
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      return { error: sessionError.message };
    }

    return {};
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sign in failed";
    return { error: message };
  }
}
