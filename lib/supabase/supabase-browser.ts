import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (supabase) return supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Return a proxy with no-ops to avoid crashes when not configured
    return {
      auth: {
        signInWithOAuth: async () => ({
          error: { message: "Supabase not configured" },
        }),
        signUp: async () => ({ error: { message: "Supabase not configured" } }),
        signInWithPassword: async () => ({
          error: { message: "Supabase not configured" },
        }),
        resetPasswordForEmail: async () => ({
          error: { message: "Supabase not configured" },
        }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    } as any;
  }
  supabase = createClient(url, anon);
  return supabase;
}
