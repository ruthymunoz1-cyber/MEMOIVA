# MEMOIVA Program State — living inventory

**Rule: check this file first at the start of every work session; update it
last before pushing.**

_Last updated: 2026-09-23 (Supabase swap built, needs a real project to finish)_

**Timeline note:** the project brief's "week of July 27, 2026" beta launch
date has passed with no cohort started. New target: a real beta cohort
within 4–6 weeks of 2026-09-23 (see `PRD.md` §2, §6 for what that requires).

## Built and verified

- **Public website** — `index.html` (single self-contained file), live via Netlify. Waitlist + partner forms wired to Netlify Forms.
- **Web app v1** — `/app` (React + Vite + Tailwind). Production build verified in BOTH modes (`npm run build` with and without Supabase env vars) and smoke-tested in a browser.
  - Participant: dashboard, This Week, vocabulary flashcards, Memory Grid game, Coloring Studio, My Progress, weekly check-in (confidence + memory 1–5)
  - Facilitator: cohort list, cohort view with roster, participant detail with notes
  - Admin: all-cohorts view, user management
  - Bilingual UI (EN/ES), role-based route guards, accessibility rules for 50+ users
- **Supabase backend code** — `app/supabase/schema.sql` (tables, RLS, the
  auth-linking trigger) and `app/src/lib/supabaseAdapter.js` (real
  implementation of every dataClient function) are written and build clean.
  Magic-link login UI is live in `RolePicker.jsx`, auto-selected whenever
  `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are set — verified with dummy
  credentials that the UI renders correctly; **not yet verified against a
  real Supabase project** (no project exists yet — see Blocked below).

## Mocked (demo mode — active until Supabase credentials are supplied)

- **Auth** — demo role picker (Maria/Teacher/Ruthy), no real login
- **Database** — localStorage mock in `app/src/lib/mockAdapter.js`; row shapes mirror the real Supabase schema exactly (`app/supabase/schema.sql`)
- **Content** — one seeded cohort, week 1 only ("Mi hogar / My Home")

## Planning

- **PRD approved** (`PRD.md`) — founder signed off 2026-09-23. Confirmed:
  app is a between-session companion (not used live during Zoom, PRD §5),
  auth is Supabase magic links with hand-added students (PRD §6), and the
  pre/post assessment stays out of the app for v1 (PRD §7). Still open:
  locking an actual beta date, and the assessment instrument choice (PRD
  §13) — neither blocks the work below.

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
- **Reference docs re-upload** — pedagogy.md, character-system.md, assessment-design.md, short-movie-talks.md, SKILL.md, file-structure.md, and both .docx specs were shared only with a previous Claude session and are not in GitHub. Attach them in a session and have them committed to `docs/app/`. Until then, curriculum-content work should not proceed (risk of contradicting locked design decisions).

## Standing rules

- All data access through `app/src/lib/dataClient.js` — nothing else touches storage or Supabase directly
- Proprietary curriculum details (project-brief §3) never appear in public pages
- Validate design changes against the 50+ / cognitive-health population before shipping
