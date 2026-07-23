-- ============================================================================
-- DRIFT — Database schema, RLS, and matchmaking logic
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a
-- fresh project. Requires Auth → Providers → Anonymous sign-ins enabled.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. anonymous_users — extends auth.users with app-specific fields
-- ---------------------------------------------------------------------------
create table public.anonymous_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  trust_score int not null default 0,
  is_blocked boolean not null default false,
  preferred_language text not null default 'en'
);

-- Auto-create a row here whenever a new (anonymous) auth user signs up.
create function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.anonymous_users (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- 2. match_queue — one row per user currently searching for a match
-- ---------------------------------------------------------------------------
create table public.match_queue (
  user_id uuid primary key references auth.users(id) on delete cascade,
  interest_tags text[] not null default '{}',
  preferred_language text not null default 'en',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. match_sessions
-- ---------------------------------------------------------------------------
create table public.match_sessions (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references auth.users(id) on delete cascade,
  user_b_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  end_reason text check (end_reason in ('left', 'reported', 'disconnected')),
  shared_interest_tags text[] not null default '{}'
);

-- ---------------------------------------------------------------------------
-- 4. messages — purged by a scheduled job after session end (see bottom note)
-- ---------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.match_sessions(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  sent_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. reports
-- ---------------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.match_sessions(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'actioned')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. block_relations
-- ---------------------------------------------------------------------------
create table public.block_relations (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

-- ---------------------------------------------------------------------------
-- 7. ratings
-- ---------------------------------------------------------------------------
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.match_sessions(id) on delete cascade,
  rater_id uuid not null references auth.users(id) on delete cascade,
  rated_id uuid not null references auth.users(id) on delete cascade,
  value text not null check (value in ('up', 'down')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 8. friend_links (mutual opt-in, added by the app after both sides confirm)
-- ---------------------------------------------------------------------------
create table public.friend_links (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references auth.users(id) on delete cascade,
  user_b_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- MATCHMAKING FUNCTION
-- Runs after every insert *or update* into match_queue. It must cover
-- update too: the client "joins the queue" with an upsert, and if a stale
-- row is still there from an earlier session (tab closed mid-search, no
-- explicit cancel), that upsert becomes an UPDATE — an insert-only trigger
-- would silently never re-run the matcher for that user, and they'd wait
-- forever unless someone else's fresh INSERT happened to pair with them.
-- Looks for a compatible partner already waiting, preferring shared
-- interest tags but falling back to oldest-in-queue regardless of tags
-- (this is what makes "widen the pool after N seconds" unnecessary — it's
-- already the default fallback order). Uses FOR UPDATE SKIP LOCKED so two
-- simultaneous inserts/updates can't double-pair the same person.
-- ============================================================================
create function public.attempt_match()
returns trigger as $$
declare
  candidate record;
  shared_tags text[];
  new_session_id uuid;
begin
  select q.* into candidate
  from public.match_queue q
  where q.user_id <> new.user_id
    and not exists (
      select 1 from public.block_relations b
      where (b.blocker_id = new.user_id and b.blocked_id = q.user_id)
         or (b.blocker_id = q.user_id and b.blocked_id = new.user_id)
    )
  order by
    case when q.interest_tags && new.interest_tags then 0 else 1 end,
    q.created_at asc
  for update skip locked
  limit 1;

  if candidate.user_id is not null then
    shared_tags := array(
      select unnest(new.interest_tags)
      intersect
      select unnest(candidate.interest_tags)
    );

    insert into public.match_sessions (user_a_id, user_b_id, shared_interest_tags)
    values (new.user_id, candidate.user_id, shared_tags)
    returning id into new_session_id;

    delete from public.match_queue where user_id in (new.user_id, candidate.user_id);
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_match_queue_insert
  after insert or update on public.match_queue
  for each row execute function public.attempt_match();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.anonymous_users enable row level security;
alter table public.match_queue enable row level security;
alter table public.match_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.block_relations enable row level security;
alter table public.ratings enable row level security;
alter table public.friend_links enable row level security;

-- anonymous_users: users can read/update only their own row
create policy "read own profile" on public.anonymous_users
  for select using (auth.uid() = id);
create policy "update own profile" on public.anonymous_users
  for update using (auth.uid() = id);

-- match_queue: users manage only their own queue entry
create policy "manage own queue entry" on public.match_queue
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- match_sessions: participants can read; only the matching function (as
-- security definer) can insert; participants can update end_reason/ended_at
create policy "read own sessions" on public.match_sessions
  for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);
create policy "end own session" on public.match_sessions
  for update using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- messages: participants can read all messages in their sessions and send
-- messages only as themselves, only into sessions that haven't ended
create policy "read session messages" on public.messages
  for select using (
    exists (
      select 1 from public.match_sessions s
      where s.id = session_id
        and (s.user_a_id = auth.uid() or s.user_b_id = auth.uid())
    )
  );
create policy "send own messages" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.match_sessions s
      where s.id = session_id
        and s.ended_at is null
        and (s.user_a_id = auth.uid() or s.user_b_id = auth.uid())
    )
  );

-- reports: any participant can file a report on their own session; no
-- client-side read access (only reviewed via the Supabase dashboard / a
-- future admin tool using the service role key)
create policy "file own report" on public.reports
  for insert with check (
    reporter_id = auth.uid()
    and exists (
      select 1 from public.match_sessions s
      where s.id = session_id
        and (s.user_a_id = auth.uid() or s.user_b_id = auth.uid())
    )
  );

-- block_relations: users manage only their own blocks
create policy "manage own blocks" on public.block_relations
  for all using (auth.uid() = blocker_id) with check (auth.uid() = blocker_id);

-- ratings: users can rate only as themselves, only for sessions they were in
create policy "rate own sessions" on public.ratings
  for insert with check (
    rater_id = auth.uid()
    and exists (
      select 1 from public.match_sessions s
      where s.id = session_id
        and (s.user_a_id = auth.uid() or s.user_b_id = auth.uid())
    )
  );

-- friend_links: participants can read; insert allowed for either party of
-- an ended session (app enforces the "both sides opted in" UI flow before
-- calling this)
create policy "read own friend links" on public.friend_links
  for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);
create policy "create friend link" on public.friend_links
  for insert with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- ============================================================================
-- REALTIME — expose the tables the client needs to subscribe to
-- ============================================================================
alter publication supabase_realtime add table public.match_sessions;
alter publication supabase_realtime add table public.messages;

-- ============================================================================
-- SEED DATA
-- ============================================================================
-- Interest tags are a curated, static list in v1 (see docs Section 2.3) —
-- kept as a simple constant in the client (lib/interestTags.ts) rather than
-- a table, so no seed table is needed here.

-- ============================================================================
-- NOTE ON MESSAGE RETENTION (Section 17.6 of the product docs)
-- Messages should not outlive their session unless a report references
-- them. Add a scheduled Supabase Edge Function (cron, e.g. every 10 min)
-- that runs:
--   delete from public.messages
--   where session_id in (
--     select id from public.match_sessions
--     where ended_at < now() - interval '5 minutes'
--   )
--   and session_id not in (select session_id from public.reports);
-- This is not created automatically by this migration — set it up as a
-- Supabase scheduled Edge Function once the project is live.
-- ============================================================================
