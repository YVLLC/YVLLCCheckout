import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      cookieOptions: {
        domain: ".yesviral.com",   // ⭐ THIS IS THE FIX
        sameSite: "lax",
        secure: true,
      },
    },
  }
);
