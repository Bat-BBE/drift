-- ============================================================================
-- UNFRIEND — friend_links never had a delete policy, so nobody could
-- actually remove a friend once added. Either participant may delete a
-- link row that connects them and the other person; the client deletes
-- both perspective rows (each side inserts their own row when a
-- friendship is confirmed — see useFriends.addFriend) so removing a
-- friend on one side instantly removes it on the other, like unfriending
-- on Messenger.
-- ============================================================================

create policy "remove own friend link" on public.friend_links
  for delete using (auth.uid() = user_a_id or auth.uid() = user_b_id);
