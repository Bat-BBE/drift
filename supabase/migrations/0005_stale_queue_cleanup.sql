-- ============================================================================
-- FIX: matching against abandoned ("ghost") match_queue rows.
--
-- The client gives up and removes its own queue row after 20s of no match
-- (see useMatchmaking's noMatchTimer) — but only if the tab is still open
-- to run that timeout. A closed tab, killed process, or lost connection
-- leaves its match_queue row behind forever, since nothing ever deletes it.
--
-- attempt_match() picked a candidate purely by "oldest in queue", with no
-- freshness check — so a real searcher could be instantly paired with one
-- of these ghosts. The result looks like an immediate "match found!" with
-- nobody actually on the other end, without ever really searching.
--
-- Fix: opportunistically purge queue rows older than the client's own
-- give-up window (a small margin over 20s) before picking a candidate, and
-- only ever consider fresh rows as candidates in the first place.
-- ============================================================================

create or replace function public.attempt_match()
returns trigger as $$
declare
  candidate record;
  shared_tags text[];
  new_session_id uuid;
begin
  -- Self-heal the queue: anything left over from a closed tab / dead
  -- connection is well past the client's own 20s give-up window by now.
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
