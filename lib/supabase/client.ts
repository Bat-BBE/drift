import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "[drift] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
      "Copy .env.local.example to .env.local and fill in your Supabase project's values.",
  );
}
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
