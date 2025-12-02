import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",  // recommended for browser auth
    },
    global: {
      headers: {
        "x-client-info": "yesviral-app",
      },
    },
    cookies: {
      name: "supabase-auth",
      domain: ".yesviral.com", // ⭐ FIX: share login across ALL subdomains
      sameSite: "lax",
      secure: true,
      path: "/",
    },
  }
);
