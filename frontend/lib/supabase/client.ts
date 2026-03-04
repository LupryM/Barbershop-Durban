import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseCredentials() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }
  return { supabaseUrl, supabaseAnonKey };
}

// Browser (client-side) singleton — created lazily on first use
let _supabase: SupabaseClient | null = null;
export function getSupabase() {
  if (!_supabase) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Keep the named export for backwards compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Server-side helper: creates a client that authenticates as the requesting user
// Pass the user's access_token from the Authorization header so RLS applies.
export function createServerSupabaseClient(accessToken?: string) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {},
    auth: { persistSession: false },
  });
}
