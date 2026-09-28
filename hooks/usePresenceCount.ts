"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function usePresenceCount(userId?: string | null) {
  const [count, setCount] = useState<number | null>(null);
  const [sampleIds, setSampleIds] = useState<string[]>([]);
  const keyRef = useRef<string>();
  if (!keyRef.current) keyRef.current = crypto.randomUUID();

  useEffect(() => {
    const key = userId ?? keyRef.current!;
    const channel = supabase.channel("lobby", {
      config: { presence: { key } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const ids = Object.keys(state).filter((id) => id !== key);
        setCount(Object.keys(state).length);
        setSampleIds(ids.slice(0, 5));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { count, sampleIds };
}
