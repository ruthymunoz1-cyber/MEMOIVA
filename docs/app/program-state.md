# MEMOIVA Program State — living inventory

**Rule: check this file first at the start of every work session; update it
last before pushing.**

_Last updated: 2026-10-24 (Supabase env vars present; live connectivity still blocked — see Blocked)_

**PDF export:** `docs/app/MEMOIVA-Program-Docs.pdf` is a point-in-time,
shareable snapshot (Week 1 curriculum + PRD + assessment + song library +
piano lessons + build status), generated 2026-09-24. It does not
auto-update — regenerate it on request once the source docs it pulls
from have moved on, rather than assuming it's current.

**Timeline note:** the project brief's "week of July 27, 2026" beta launch
date has passed with no cohort started. The 4–6 week target set earlier
on 2026-09-23 is superseded — founder direction is to keep building
scope (assessment expansion, song library, piano) rather than hold to
that window (see `PRD.md` header note). Ruthy has since added the real
Supabase project's env vars to this environment (2026-10-24); what's left
is confirming the schema was actually run and allowing this session's
network policy to reach `*.supabase.co` so that can be verified (see
Blocked below) — nothing else here substitutes for that step.

## Built and verified

- **Public website** — `index.html` (single self-contained file), live via Netlify. Waitlist + partner forms wired to Netlify Forms.
- **Web app v1** — `/app` (React + Vite + Tailwind). Production build verified in BOTH modes (`npm run build` with and without Supabase env vars) and smoke-tested in a browser.
  - Participant: dashboard, This Week, vocabulary flashcards, Memory Grid game, Coloring Studio, **Songs (library + synced-lyrics player), Piano (color-coded lessons)**, My Progress, weekly check-in (confidence + memory 1–5)
  - Facilitator: cohort list, cohort view with roster, participant detail with notes
  - Admin: all-cohorts view, user management
  - Bilingual UI (EN/ES), role-based route guards, accessibility rules for 50+ users
- **Supabase backend code** — `app/supabase/schema.sql` (tables, RLS, the
  auth-linking trigger, plus the new `songs` table and `weekly_content.
  signature_song_id`) and `app/src/lib/supabaseAdapter.js` (real
  implementation of every dataClient function, including songs) are
  written and build clean. Magic-link login UI is live in `RolePicker.jsx`,
  auto-selected whenever `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are
  set. 2026-10-24: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are now
  set in this environment and the production build picks them up —
  confirmed the real project URL (`hzjlsnhabhqtzrbrdjfz.supabase.co`) is
  baked into `dist/assets/*.js`, i.e. live mode, not mock mode. **Could
  not go further than that**: this session's outbound network policy
  rejects connections to `*.supabase.co` (`curl` through the required
  proxy gets `403 connect_rejected` — host not allowed for this session),
  so whether the schema was actually run, whether the `users` table
  exists, and whether `sendMagicLink`/login work end-to-end against the
  real project are **still unverified** — see Blocked below. This is a
  session network-policy restriction, not a code or credentials problem.
- **Song library** — `SongLibrary.jsx` + `SongPlayer.jsx`. Weekly
  signature-song slot (one per week, "songs every session" per
  project-brief.md) plus a public-domain catalog, both EN/ES. Line-by-line
  lyric highlight synced to audio playback, big font, auto-scroll
  (respects reduced-motion). Screenshot-verified. **Content gap:** no real
  audio exists yet — see `song-library.md`.
- **Piano lessons** — `Piano.jsx`. On-screen color-coded virtual keyboard
  (tap/click, Web Audio synthesized tones, no physical instrument or MIDI
  needed), one working guided exercise, scored via the existing
  `game_scores` table. Screenshot-verified. Color scheme and lesson
  content are placeholders pending founder review — see
  `piano-lessons.md`, including why it wasn't built on Stephen Ridley's
  specific (paid, proprietary) method.
- **Coloring Studio, redesigned** — `ColoringStudio.jsx` now offers two
  patterns via a tab row: the original "Home" scene, and a new "Calm
  Pattern" — a generated mandala (37 fillable regions), added because the
  in-app activity needed to read as adult/calming rather than a themed
  scene. Progress now saves per pattern (`coloring_saves.page_id`, was
  `week_number`-only) so the two never overwrite each other. Screenshot-
  verified. See `coloring-studio.md` for why this is separate from the
  printed coloring book (that one has characters and is a print-only
  deliverable, not app scope).

## Mocked (demo mode — active until Supabase credentials are supplied)

- **Auth** — demo role picker (Maria/Teacher/Ruthy), no real login
- **Database** — localStorage mock in `app/src/lib/mockAdapter.js`; row shapes mirror the real Supabase schema exactly (`app/supabase/schema.sql`)
- **Content** — one seeded cohort, week 1 only ("Mi hogar / My Home")

## Planning

- **PRD approved** (`PRD.md`) — founder signed off 2026-09-23. §5 (between-
  session use) and §6 auth approach still hold. §7 (assessment) and the
  original 4–6 week timeline have both been superseded by later direction
  — see the PRD's header note.
- **Pre/post assessment — now 7 segments** (`assessment-design.md`,
  updated 2026-09-23): the original 6, plus piano. The 8–10 minute cap is
  lifted. Piano is the one segment actually built into the app; the rest
  (song, movement, video, voice capture) remain facilitator-administered
  outside the app because their content isn't supplied yet, not because
  of a timing decision. See that doc's §7 checklist.
- **Movie talk / story characters — placeholder only** (`movie-talk-story.md`,
  2026-09-24): founder is still deciding the actual approach ("will get
  back to you"). No app feature built or scoped — this is a structure +
  placeholder-persona document only, explicitly not a production plan.
  Robert/Elena/Carlos are the only real, locked fact (from
  `project-brief.md`); everything else in that doc is a stand-in.

## Not started

- **Creating the actual Supabase project and running the schema** — the
  code is ready and waiting; this needs Ruthy (see Blocked below).
- Deploying the app itself (website is deployed; app is not yet) — see `deployment-and-hosting.md`
- PIN/preview gate for stakeholder demos
- Real curriculum content beyond week 1 (blocked on curriculum docs — see below)
- iOS / Android packaging (Capacitor; planned after Supabase is live)

- **Supabase live connectivity — blocked by this environment's network
  policy, not by missing credentials** (2026-10-24): `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY` are correctly set in this session and the
  app build picks them up in live mode. But this cloud session's outbound
  network policy currently denies connections to `*.supabase.co`
  entirely — every attempt (REST query, `signInWithOtp`) fails at the
  proxy with "host not allowed for this session," before ever reaching
  Supabase. That means none of the following is actually confirmed yet:
  whether `app/supabase/schema.sql` was run against the project, whether
  the `users` table (or any table) exists, or whether magic-link login
  works end-to-end. **What Ruthy needs to do:** open this environment's
  settings (cloud environment menu → Edit → Network access) and add
  `*.supabase.co` (or the project's exact host) to Allowed domains, then
  start a new session so the policy change takes effect. Once that's
  done, a session can actually query the `users` table and send a real
  magic-link to confirm the schema is live. Separately — still worth
  double-checking regardless of the network fix — confirm
  `app/supabase/schema.sql` was in fact run in the Supabase SQL Editor;
  if it wasn't, that's a second, independent step still needed.
- **Assessment content** — `assessment-design.md` needs founder-supplied
  content (the song, the movement routine, review of draft items) before
  it's final. See that doc's §7 checklist.
- **Real song recordings** — `song-library.md` needs the actual Week 1
  signature song (and the real public-domain catalog list) before the
  song library is more than a working mechanism with placeholder content.
- **Piano method write-up** — a collaborator is writing up MEMOIVA's own
  original color/picture piano method to replace the current placeholder.
  Full spec for what that write-up needs is `piano-lessons.md` §8. (Two
  outside sources were checked and ruled out as things to copy from:
  Stephen Ridley's Ridley Academy and Gospel on the Go Piano's "Piano by
  Pictures" — both real, both paid, both left alone for IP reasons — see
  that doc §2.)
- **Reference docs re-upload** — pedagogy.md, character-system.md, short-movie-talks.md, SKILL.md, file-structure.md, and both .docx specs were shared only with a previous Claude session and are not in GitHub. Attach them in a session and have them committed to `docs/app/`. Until then, curriculum-content work (beyond what's in `assessment-design.md`, `movie-talk-story.md`, and week 1) should not proceed (risk of contradicting locked design decisions). Note: `assessment-design.md` and `movie-talk-story.md` have both now been reconstructed as working drafts — if either original file turns up, reconcile against it rather than assuming the draft wins.
- **Movie talk direction** — founder needs to decide format and confirm
  or replace the placeholder characters before this becomes real work.
  See `movie-talk-story.md` §5.
- **Printed coloring book** — separate production workstream (design/
  print, not app code) once ready to start. See `coloring-studio.md`.

## Standing rules

- All data access through `app/src/lib/dataClient.js` — nothing else touches storage or Supabase directly
- Proprietary curriculum details (project-brief §3) never appear in public pages
- Validate design changes against the 50+ / cognitive-health population before shipping
