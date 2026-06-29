// Environment variable validation

interface EnvConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export function validateEnv(): EnvConfig {
  const env: EnvConfig = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  // Validate Supabase configuration if provided
  if (env.VITE_SUPABASE_URL || env.VITE_SUPABASE_ANON_KEY) {
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
      console.warn(
        "⚠️ Security Warning: Partial Supabase configuration detected. " +
          "Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided.",
      );
    }

    if (env.VITE_SUPABASE_URL && !isValidSupabaseUrl(env.VITE_SUPABASE_URL)) {
      console.error("❌ Security Error: Invalid Supabase URL detected.");
    }
  }

  return env;
}

function isValidSupabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Supabase URLs should be from supabase.co or supabase.com
    const validHosts = ["supabase.co", "supabase.com"];
    return validHosts.some((host) => parsed.hostname.endsWith(host));
  } catch {
    return false;
  }
}

export const env = validateEnv();
