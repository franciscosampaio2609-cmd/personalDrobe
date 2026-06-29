import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env-validation";

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false, // Security: prevent URL-based session hijacking
        },
        global: {
          headers: {
            // Add security headers for Supabase requests
          },
        },
      })
    : null;
