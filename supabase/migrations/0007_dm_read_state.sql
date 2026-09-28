-- ============================================================================
-- DM READ STATE — per-user, per-friend "I've read up to here" marker.
--
-- Kept private (only the owning user can read/write their own rows) and
-- separate from the live "seen ✓✓" indicator, which stays broadcast-only
-- (see useDirectThread) for instant feedback while both people are
-- actively looking at the thread. This table exists purely so an unread
-- count can survive reloads and be shown as a badge on the Chat nav tab.
-- ============================================================================

create table public.direct_message_reads (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

alter table public.direct_message_reads enable row level security;

create policy "manage own read state" on public.direct_message_reads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
