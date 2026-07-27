import { supabase } from "@/lib/supabase/client";

export const FRIEND_REQUEST_MARKER = "__FRIEND_REQUEST__";

export interface Friend {
  partnerId: string;
  since: string;
}

export async function addFriend(userId: string, partnerId: string) {
  const { error } = await supabase.from("friend_links").insert({
    user_a_id: userId,
    user_b_id: partnerId,
  });
  if (error && error.code !== "23505") {
    console.error("[drift] failed to add friend:", error.message);
  }
}

export async function getFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from("friend_links")
    .select("*")
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[drift] failed to load friends:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    partnerId: row.user_a_id === userId ? row.user_b_id : row.user_a_id,
    since: row.created_at,
  }));
}
