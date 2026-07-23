"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useMatchesToday() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchCount() {
      const { data, error } = await supabase.rpc("matches_last_24h");
      if (!cancelled && !error && typeof data === "number") {
        setCount(data);
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
}
