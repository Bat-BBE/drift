import { supabase } from "@/lib/supabase/client";

export interface BlockedUser {
  blockedId: string;
  since: string;
}
export async function blockUser(userId: string, blockedId: string) {
  const { error } = await supabase.from("block_relations").insert({
    blocker_id: userId,
    blocked_id: blockedId,
  });
  if (error && error.code !== "23505") {
    console.error("[drift] failed to block user:", error.message);
  }
}

export async function unblockUser(userId: string, blockedId: string) {
  const { error } = await supabase
    .from("block_relations")
    .delete()
    .eq("blocker_id", userId)
    .eq("blocked_id", blockedId);
  if (error) {
    console.error("[drift] failed to unblock user:", error.message);
  }
}

export async function getBlockedUsers(userId: string): Promise<BlockedUser[]> {
  const { data, error } = await supabase
    .from("block_relations")
    .select("*")
    .eq("blocker_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[drift] failed to load blocked users:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    blockedId: row.blocked_id,
    since: row.created_at,
  }));
}
