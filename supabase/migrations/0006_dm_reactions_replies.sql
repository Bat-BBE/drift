-- ============================================================================
-- DM PARITY — reply-to and per-message reactions for direct_messages, so
-- friend conversations can carry the same reply/react/delete interactions
-- as random-match chat (minus the get-to-know-a-stranger extras: the
-- compatibility quiz, streak badge, and friend-request chip don't apply
-- once you're already friends).
-- ============================================================================

alter table public.direct_messages
  add column reply_to_id uuid references public.direct_messages(id) on delete set null;

create policy "delete own dm" on public.direct_messages
  for delete using (auth.uid() = sender_id);

create table public.direct_message_reactions (
  message_id uuid not null references public.direct_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

alter table public.direct_message_reactions enable row level security;

create policy "read reactions on own dm thread" on public.direct_message_reactions
  for select using (
    exists (
      select 1 from public.direct_messages dm
      where dm.id = message_id
        and (dm.sender_id = auth.uid() or dm.recipient_id = auth.uid())
    )
  );

create policy "react on own dm thread" on public.direct_message_reactions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.direct_messages dm
      where dm.id = message_id
        and (dm.sender_id = auth.uid() or dm.recipient_id = auth.uid())
    )
  );

create policy "remove own reaction" on public.direct_message_reactions
  for delete using (user_id = auth.uid());

alter publication supabase_realtime add table public.direct_message_reactions;
