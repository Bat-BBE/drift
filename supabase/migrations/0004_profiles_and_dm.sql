-- ============================================================================
-- PROFILES + DIRECT MESSAGES
--
-- Adds a self-chosen, publicly-readable nickname/avatar so a person can be
-- recognized across visits and by their friends — separate from the
-- anonymous_users table, which stays private (trust_score, is_blocked,
-- etc. are never exposed to other users).
--
-- Adds direct_messages for 1:1 conversations between confirmed friends.
-- Unlike random-match chat (kept fully ephemeral — see 0003), DM history
-- between friends is intentionally persisted so returning to a
-- conversation later shows what was said, like a normal messenger.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. public_profiles — self-chosen nickname + avatar, readable by anyone
-- ---------------------------------------------------------------------------
create table public.public_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  avatar_id int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.public_profiles enable row level security;

create policy "read any public profile" on public.public_profiles
  for select using (true);

create policy "set own public profile" on public.public_profiles
  for insert with check (auth.uid() = id);

create policy "update own public profile" on public.public_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

alter publication supabase_realtime add table public.public_profiles;

-- ---------------------------------------------------------------------------
-- 2. direct_messages — persisted 1:1 messages between friends
-- ---------------------------------------------------------------------------
create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  sent_at timestamptz not null default now()
);

create index direct_messages_pair_idx
  on public.direct_messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), sent_at);

alter table public.direct_messages enable row level security;

create policy "read own dm threads" on public.direct_messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "send dm to a friend" on public.direct_messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.friend_links f
      where (f.user_a_id = auth.uid() and f.user_b_id = recipient_id)
         or (f.user_a_id = recipient_id and f.user_b_id = auth.uid())
    )
  );

alter publication supabase_realtime add table public.direct_messages;
