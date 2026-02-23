import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { signInWithGoogle as signInWithGoogleService } from "../services/signInWithGoogle";

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  const refreshState = useCallback((s: Session | null) => {
    setSession(s);
    setUser(s?.user ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (mounted) refreshState(s);
      setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, s: Session | null) => {
      if (mounted) refreshState(s);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshState]);

  const signInWithGoogle = useCallback(async () => {
    return signInWithGoogleService();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return { error: "Email and password are required." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return { error: "Email and password are required." };
    }

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value: AuthState = {
    session,
    user,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
