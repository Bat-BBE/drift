-- ============================================================================
-- STORAGE RETENTION — bounds growth on the free Supabase tier.
--
-- Random-match chat content is already never stored (see 0003) — nothing
-- to clean up there. What DOES grow forever today:
--   1. match_sessions (+ its cascade: reports, ratings) — one row per
--      match ever made, no message content, but still an unbounded row
--      count.
--   2. direct_messages (+ its cascade: direct_message_reactions) — real
--      persisted friend-chat history, which the product now caps at 3
--      days instead of forever.
--
-- No cron/scheduler is set up for this project, so both cleanups use the
-- same self-healing pattern already used for the match_queue (see
-- 0005_stale_queue_cleanup.sql): piggyback an opportunistic sweep onto a
-- write that's already happening, so the tables stay bounded as long as
-- the app is getting *any* use — no extra infrastructure required. If
-- you later enable pg_cron on the project, a scheduled call to
-- public.cleanup_old_data() once a day is a fine belt-and-suspenders
-- addition, but isn't required for this to work.
-- ============================================================================

create or replace function public.cleanup_old_data()
returns void as $$
begin
  -- Ended matches older than a week, EXCEPT ones with a still-pending
  -- report — those need to survive long enough to actually be reviewed
  -- from the Supabase dashboard. Cascades to reports/ratings for the
  -- rows it does remove.
  delete from public.match_sessions ms
  where ms.ended_at is not null
    and ms.ended_at < now() - interval '7 days'
    and not exists (
      select 1 from public.reports r
      where r.session_id = ms.id and r.status = 'pending'
    );

  -- Friend-chat messages older than 3 days. Cascades to
  -- direct_message_reactions for the rows it removes.
  delete from public.direct_messages
  where sent_at < now() - interval '3 days';
end;
$$ language plpgsql security definer;

-- Piggyback on match_queue activity (every search) to sweep old matches.
create or replace function public.attempt_match()
returns trigger as $$
declare
  candidate record;
  shared_tags text[];
  new_session_id uuid;
begin
  perform public.cleanup_old_data();

  delete from public.match_queue
  where user_id <> new.user_id
    and created_at < now() - interval '25 seconds';

  select q.* into candidate
  from public.match_queue q
  where q.user_id <> new.user_id
    and q.created_at >= now() - interval '25 seconds'
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

-- Piggyback on every new direct message too, so DM history stays capped
-- even for people who never touch random chat.
create or replace function public.cleanup_on_direct_message()
returns trigger as $$
begin
  delete from public.direct_messages
  where sent_at < now() - interval '3 days';
  return new;
end;
$$ language plpgsql security definer;

create trigger on_direct_message_cleanup
  after insert on public.direct_messages
  for each row execute function public.cleanup_on_direct_message();
