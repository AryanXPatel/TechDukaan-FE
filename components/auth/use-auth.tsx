"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSupabaseBrowser } from "@/lib/supabase/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider?: "google" | "facebook" | "email";
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (
    provider: "google" | "facebook" | "email",
    payload?: Partial<User>
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
  const userMetadata = supabaseUser.user_metadata || {};
  const appMetadata = supabaseUser.app_metadata || {};

  return {
    id: supabaseUser.id,
    name:
      userMetadata.full_name ||
      userMetadata.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || "",
    image: userMetadata.avatar_url || userMetadata.picture,
    provider:
      (appMetadata.provider as "google" | "facebook" | "email") || "email",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUserToUser(session.user));
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (
      provider: "google" | "facebook" | "email",
      payload?: Partial<User>
    ) => {
      // For OAuth providers, this would typically be handled by the SupabaseAuthPanel
      // This is kept for compatibility but OAuth should use the panel directly
      if (provider === "email" && payload?.email) {
        // This is a fallback - normally email auth goes through the auth panel
        console.log("Email auth should be handled by SupabaseAuthPanel");
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase]);

  const value = useMemo(
    () => ({ user, loading, isLoading: loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
