# Drift — Anonymous Random Chat

A working Next.js 15 + TypeScript + Tailwind + real Supabase backend
implementation of the random-chat flow, using the "Quiet Motion" design
system — now with a more youthful gradient look, Mongolian/English
language toggle, and a simplified flow (no hobby/interest step blocking
the match).

## ⚠️ If you already set up your Supabase project before

There was a real bug in the matchmaking trigger: it only fired on
**INSERT**, not **UPDATE**. Since the client joins the queue with an
`upsert`, if a stale queue row was already there (e.g. a tab was closed
mid-search without cancelling), re-searching became an UPDATE — and the
matcher never re-ran for that user. Symptom: two people both search but
never match, and the chat screen never appears.

**Fix:** run `supabase/migrations/0002_fix_requeue_trigger.sql` once in
your SQL Editor. (If you're setting up fresh, the corrected
`0001_init.sql` already includes this — just run that one file.)

## What changed since the last version

- **Removed the hobby/interest picker step.** Searching now starts the
  instant you land on `/match` — no extra tap, no questions, straight to
  finding a stranger. (The interest-tag matching logic still exists
  server-side for later — see below.)
- **Mongolian is now the default language**, with an EN/MN toggle (top
  right corner, on both the landing page and the chat screen). All UI
  text lives in `lib/i18n.ts` — add more languages by adding another key
  to that dictionary.
- **Refreshed visual design**: gradient CTA buttons, floating blurred
  color blobs on the landing page, a pink accent alongside the original
  violet/cyan for a more energetic, youth-oriented feel, bigger card
  radii.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (Free tier is enough).
2. In **Authentication → Sign In / Providers**, enable **"Allow anonymous sign-ins"**.
3. In **SQL Editor**, run `supabase/migrations/0001_init.sql` in full.
4. In **Project Settings → API**, copy your **Project URL** and **anon public key**.

## 2. Configure the app

```bash
cp .env.local.example .env.local
# then paste your Project URL and anon key into .env.local
```

## 3. Run it

```bash
npm install
npm run dev
```

Open **two separate browser windows** (one normal + one incognito) to
`http://localhost:3000`, hit start in both — they'll match each other for
real within a couple seconds and drop straight into a Messenger-style chat.

## How the real-time matching works

- Landing on `/match` immediately upserts a row into `match_queue`.
- A Postgres trigger (`attempt_match()`) fires on every insert *or*
  update, looks for another compatible, non-blocked person already
  waiting, and creates a `match_sessions` row for both — atomically
  (`FOR UPDATE SKIP LOCKED` prevents double-pairing).
- Both clients are subscribed to Supabase Realtime for `match_sessions`
  inserts where they're a participant — no polling.
- Messages are rows in `messages`, delivered via Realtime Postgres-changes.
  Typing indicators use an ephemeral Realtime **broadcast** channel
  instead of the database.
- Leaving, reporting, and rating write directly to `match_sessions`,
  `reports`, and `ratings`, gated by RLS so a user can only act on their
  own sessions.

## Re-adding the interest/hobby picker (optional)

The `interest_tags` matching logic is still fully live in the database —
`match_sessions.shared_interest_tags`, the tag-preference ordering in
`attempt_match()`, and the `INTEREST_TAGS` constant in
`lib/interestTags.ts` are all still there. If you want it back later (e.g.
as an optional settings toggle rather than a blocking step), the
`InterestPicker` component in `components/match/InterestPicker.tsx` is
still in the project — just call `startSearch(selectedTags)` with real
tags instead of `startSearch([])`.

## What's still a manual next step

| Piece | Status |
|---|---|
| Core matching, chat, typing, leave, report, rate, localized UI | ✅ Fully wired |
| Presence ("N people online now") | ✅ Wired via Realtime Presence |
| Message auto-moderation | ❌ Not included — see the note at the bottom of `0001_init.sql` |
| Message retention purge | ❌ Not automated — add a scheduled Edge Function |
| Block list UI | ❌ Not built — `block_relations` table + RLS already exist |
| Rate limiting | ❌ Not enforced yet |

## Project structure

```
app/
  page.tsx                 Landing page (gradient design, MN/EN toggle)
  match/page.tsx            Auto-search → match → messenger-style chat
components/
  ui/Button.tsx
  chat/ChatBubble.tsx, TypingIndicator.tsx
  match/SearchingAnimation.tsx, MatchFoundBurst.tsx, ReportSheet.tsx,
        RateSheet.tsx, InterestPicker.tsx (currently unused, see above)
  shared/LanguageToggle.tsx
hooks/
  useAnonymousAuth.ts, useMatchmaking.ts, useChatSession.ts, usePresenceCount.ts
lib/
  supabase/client.ts, i18n.ts, interestTags.ts
supabase/
  migrations/0001_init.sql, 0002_fix_requeue_trigger.sql
types/
  database.ts
```
