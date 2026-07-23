import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Doesn't throw at import time (which would break the build) — but every
  // real call will fail until these are set in `.env.local`. See README.
  console.warn(
    "[drift] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. " +
      "Copy .env.local.example to .env.local and fill in your Supabase project's values."
  );
}

// NOTE: not using the generic <Database> type here — supabase-js's strict
// generic shape needs the full `supabase gen types` output to infer table
// rows correctly; a hand-written partial version produces `never` types.
// Once your project is live, run:
//   npx supabase gen types typescript --project-id <id> > types/database.ts
// and change this to `createClient<Database>(...)`.
export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
