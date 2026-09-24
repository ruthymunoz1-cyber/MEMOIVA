# MEMOIVA Program State — living inventory

**Rule: check this file first at the start of every work session; update it
last before pushing.**

_Last updated: 2026-09-24 (coloring studio redesigned; movie-talk placeholder drafted)_

**Timeline note:** the project brief's "week of July 27, 2026" beta launch
date has passed with no cohort started. The 4–6 week target set earlier
on 2026-09-23 is superseded — founder direction is to keep building
scope (assessment expansion, song library, piano) rather than hold to
that window (see `PRD.md` header note). The one thing that hasn't
changed: creating the real Supabase project still needs Ruthy, and
nothing else here substitutes for that step (see Blocked below).

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
  set — verified with dummy credentials that the UI renders correctly;
  **not yet verified against a real Supabase project** (no project exists
  yet — see Blocked below).
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

## Blocked / needs Ruthy

- **Supabase project creation** — a Claude session can't create a
  Supabase account on your behalf. To finish the swap: (1) create a free
  project at supabase.com, (2) run `app/supabase/schema.sql` against it
  (SQL Editor), (3) add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  (Project Settings → API) as environment variables in this session's
  environment settings — not pasted in chat — then start a new session so
  they load. From there the real end-to-end flow (magic-link email,
  roster visibility, RLS) can actually be tested for the first time.
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
