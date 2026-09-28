-- ============================================================================
-- EPHEMERAL MESSAGES — stop persisting chat content entirely.
--
-- Chat messages (and reactions) now travel only over a Supabase Realtime
-- broadcast channel between the two participants in a session — they are
-- never written to a database row. The moment a room closes (tab closed,
-- "next match", leave), the transcript only ever existed in each browser's
-- memory and is gone for good. This migration drops the tables that used
-- to store message content so no copy of a conversation is ever persisted
-- server-side.
--
-- Session metadata (who matched whom, when, why it ended), reports and
-- ratings are unaffected — none of them store message text, so nothing
-- about moderation or matchmaking history is lost.
-- ============================================================================

drop policy if exists "read session messages" on public.messages;
drop policy if exists "send own messages" on public.messages;

alter publication supabase_realtime drop table if exists public.messages;

drop table if exists public.message_reactions;
drop table if exists public.messages;
