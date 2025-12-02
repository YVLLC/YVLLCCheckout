import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      cookies: {
        domain: ".yesviral.com", // ⭐ FIX: share login across subdomains
        sameSite: "lax",
        secure: true,
      },
    },
  }
);
