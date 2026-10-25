# MEMOIVA Program State — living inventory

**Rule: check this file first at the start of every work session; update it
last before pushing.**

_Last updated: 2026-10-25 (background color corrected to an actual warm cream)_

**⚠️ Bigger context, found 2026-10-25:** MEMOIVA Circle (everything this
file tracks) is only "Project 1" of a two-project structure — see
`../RAMP_Project_Migration_Report.md`. "Project 2 — RAMP Learning
Platform" is a much larger, previously undocumented business line: 10
curriculum tracks (DIALOVA, INGLOVA, MEMOIVA, VORANA, SONARA, AGELESS
FLUIDEZ, ORIVA, NATOVA, FLUOVA, PINGOVA), 74 of a 150-lesson target
already written, plus a press kit, capability statement, trademark
roadmap, and several HTML artifacts (`RAMP_Beta_App.html`,
`RAMP_Landing_Page.html`, `RAMP_Logo_Suite.html`, etc.) referenced as
already built. **None of this exists anywhere in GitHub, and a search of
the founder's published Claude Artifacts didn't find it either — its
current location is unknown.** Likely candidates: a claude.ai Project
(if the two Projects this report recommends were ever actually set up),
inside the original chat conversation's history (never explicitly
published), or saved locally on the founder's own computer. This is a
live data-loss risk until located and committed somewhere durable — flag
it in any future session, don't let it go quiet.

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

- **Design pass, 2026-10-25** — restrained motion (hero entrance, scroll-
  reveal on the card sections, count-up on the two research stats, see
  commit history) plus a color correction: `--cream` / the app's `appbg`
  token was `#F8F9FA` — a cool, slightly blue-tinted gray despite the
  name — corrected to `#FAF6EC`, an actual warm ivory. Applied
  identically to both the website and the app so they stay in sync. The
  other locked brand colors (navy, teal, gold, purple) were left
  untouched — this was a correction to match the token's own documented
  intent, not a creative substitution of a locked value. Screenshot-
  verified in both places; contrast against navy/body text is
  unaffected (both backgrounds are >90% luminance).
- **Public website** — `index.html` (single self-contained file). **Not
  actually deployed anywhere yet** — confirmed directly with the founder
  2026-10-25; earlier notes in this file saying "live via Netlify" were
  wrong/aspirational. Waitlist + partner forms are wired for Netlify
  Forms and will work once it actually is deployed there.
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
  set. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set in this
  environment and the production build picks them up — confirmed the real
  project URL (`hzjlsnhabhqtzrbrdjfz.supabase.co`) is baked into
  `dist/assets/*.js`, i.e. live mode, not mock mode.
  **2026-10-24 — schema run against the real project:** `schema.sql` had
  an ordering bug (`facilitates_cohort()`/`is_in_cohort()` referenced
  `public.cohorts`/`public.cohort_participants` before those tables
  existed — Postgres rejects that at `CREATE FUNCTION` time for
  `LANGUAGE SQL` functions, `42P01 relation does not exist`). Fixed by
  reordering table/function creation and adding idempotent
  `drop ... if exists` cleanup at the top (safe to re-run after a partial
  failure). Ruthy then ran the corrected file in the Supabase SQL Editor
  herself and got **"Success, no rows returned"** — the schema (all 9
  tables, the auth-linking trigger, RLS policies) is now confirmed live
  on the real project. **Still not verified:** this Claude session's own
  outbound network policy rejects connections to `*.supabase.co`
  (`403 connect_rejected` through the required proxy), so a Claude
  session still can't directly query the `users` table or test
  `sendMagicLink` end-to-end — that remains a session network-policy
  restriction (see Blocked below), not a sign anything is wrong with the
  schema or credentials. The next real test is **Ruthy pre-creating one
  real `users` row (her own email + `admin` role) via the Supabase Table
  Editor, then trying the actual magic-link login in the app** — that
  exercises the whole live path without needing this session's network
  access fixed.
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

- ~~Creating the actual Supabase project and running the schema~~ — DONE,
  2026-10-24 (see Built and verified above).
- **Deploying the app itself** — `netlify.toml` added 2026-10-25, builds
  the app as its own standalone Netlify site (not nested under the
  marketing site, to avoid a routing conflict with the app's own
  internal `/app` route — see `deployment-and-hosting.md`). Still needs
  Ruthy to actually connect it in Netlify's dashboard — the real step
  that gets a login-able URL.
- PIN/preview gate — no longer the plan now that real accounts exist;
  magic-link login is the real gate.
- Real curriculum content beyond week 1 (blocked on curriculum docs — see below)
- iOS / Android packaging (Capacitor; planned after Supabase is live)

- **Supabase live connectivity — a Claude session still can't verify it
  directly, but the schema itself is confirmed done** (updated
  2026-10-24): the schema is run (see Built and verified above — Ruthy
  got "Success, no rows returned" in the Supabase SQL Editor), so this is
  now narrower than before. What's left is just that *this cloud
  session's* outbound network policy denies connections to
  `*.supabase.co` entirely, so a Claude session can't itself query the
  `users` table or call `sendMagicLink` to prove the end-to-end flow
  works. **What Ruthy needs to do, if she wants a Claude session to be
  able to verify this directly:** open this environment's settings
  (cloud environment menu → Edit → Network access) and add
  `*.supabase.co` (or the project's exact host) to Allowed domains, then
  start a new session so the policy change takes effect. **This isn't
  strictly required, though** — the real-world test that actually matters
  (a person pre-created in `public.users`, signing in via magic link) can
  be done directly by Ruthy without any session network-policy change:
  add one row to `public.users` (her own email, `role = 'admin'`) via the
  Supabase Table Editor, then try logging into the deployed app with that
  email through the magic-link flow.
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
