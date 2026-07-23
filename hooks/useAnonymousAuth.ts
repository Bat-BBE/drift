"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/**
 * Ensures every visitor has an anonymous Supabase auth session before they
 * can join the match queue or send messages (required for RLS policies,
 * which key everything off `auth.uid()`).
 */
export function useAnonymousAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function ensureSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user?.id) {
        if (!cancelled) {
          setUserId(data.session.user.id);
          setReady(true);
        }
        return;
      }

      const { data: signInData, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("[drift] anonymous sign-in failed:", error.message);
        return;
      }
      if (!cancelled && signInData.user) {
        setUserId(signInData.user.id);
        setReady(true);
      }
    }

    ensureSession();
    return () => {
      cancelled = true;
    };
  }, []);

  return { userId, ready };
}
