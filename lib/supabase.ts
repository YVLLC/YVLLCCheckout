// path: lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

// ✅ Your checkout site needs a browser-side Supabase client.
// This allows:
// - supabase.auth.getUser()
// - supabase.auth.getSession()
// - shared auth across yesviral.com & checkout.yesviral.com

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      // SHARE the auth cookie across subdomains
      domain: process.env.NEXT_PUBLIC_SUPABASE_COOKIES_DOMAIN || "yesviral.com",

      // Best, secure settings
      sameSite: "lax",
      secure: true,
    },
  }
);
