"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function usePresenceCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const channel = supabase.channel("lobby", {
      config: { presence: { key: crypto.randomUUID() } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
