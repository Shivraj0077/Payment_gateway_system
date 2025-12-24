import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);
