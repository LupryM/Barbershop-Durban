import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server-side helper: creates a Supabase client that authenticates via Bearer token
 * Pass the user's access_token from the Authorization header so RLS policies apply.
 */
export function createServerSupabaseClient(accessToken?: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {},
    auth: { persistSession: false },
  });
}
