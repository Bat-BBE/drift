-- ============================================================================
-- FIX: match_queue trigger only fired on INSERT, not UPDATE.
--
-- The client joins the queue with an upsert. If a stale row was already
-- there (e.g. a tab was closed mid-search without cancelling), that upsert
-- resolves as an UPDATE — and an insert-only trigger never re-runs the
-- matcher for that user. Symptom: two people both "search" but never
-- match, and the chat screen never appears.
--
-- Run this once in the SQL Editor if your project was set up before this
-- fix (i.e. you ran the original version of 0001_init.sql). If you're
-- setting up a fresh project, the corrected 0001_init.sql already includes
-- this — you don't need to run this file separately.
-- ============================================================================

drop trigger if exists on_match_queue_insert on public.match_queue;

create trigger on_match_queue_insert
  after insert or update on public.match_queue
  for each row execute function public.attempt_match();
