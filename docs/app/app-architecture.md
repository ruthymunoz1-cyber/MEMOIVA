# MEMOIVA Web App — Architecture (as built)

This document is derived from the actual code in `/app`. It replaces the
architecture notes that lived in the other Claude session. The original
`MEMOIVA_WebApp_Architecture_Spec.docx` should still be re-uploaded for the
full v1 feature rationale (see `README.md` in this folder).

## Stack

- **React 18 + Vite 5** — single-page app
- **Tailwind CSS 3** — brand tokens in `app/tailwind.config.js` (teal `#0E7C7B`, navy `#1A2B4C`, gold `#B8860B`)
- **react-router-dom** — client-side routing
- **Supabase** — Postgres + Auth backend, used once configured (see Data layer). Falls back to a localStorage mock when it isn't.

## Roles & routes

Three roles with route guards (`src/components/RequireRole.jsx`). Entry point
is `/`, which shows either a real email-login form or the demo role picker
depending on whether Supabase is configured (see Data layer), plus an EN/ES
language toggle either way.

| Role | Routes | Pages |
|---|---|---|
| Participant | `/app`, `/app/week`, `/app/vocabulary`, `/app/games`, `/app/coloring`, `/app/progress`, `/app/check-in` | Dashboard, This Week, Flashcards, Memory Grid game, Coloring Studio, My Progress, weekly Check-In |
| Facilitator | `/facilitator`, `/facilitator/cohorts/:cohortId`, `/facilitator/participants/:participantId` | My Cohorts, Cohort View (roster + progress), Participant Detail (incl. facilitator notes) |
| Admin | `/admin`, `/admin/users` | All Cohorts, User Management |

## Data layer — the single most important rule

**All data access goes through `src/lib/dataClient.js`.** No component or
page touches storage, Supabase, or any adapter directly.

`dataClient.js` is a thin dispatcher between two adapters with matching
function signatures, chosen by whether `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are set (see `app/.env.example`):

- **`src/lib/supabaseAdapter.js`** — the real backend. Auth is email magic
  links (`supabase.auth.signInWithOtp`), not passwords — friendlier for a
  50+ audience and avoids building account-recovery UI a 6-person cohort
  doesn't need. There is no self-serve signup: a facilitator/admin
  pre-creates each real student's row in `public.users` (email + role)
  before that person's first login; a database trigger links their auth
  account to that row by email on first sign-in (see
  `app/supabase/schema.sql`). If someone signs in whose email nobody
  provisioned, `hasUnprovisionedSession()` reports it and the UI shows
  "ask your facilitator to add you" instead of crashing.
- **`src/lib/mockAdapter.js`** — the original v1 mock, backed by
  `localStorage` (`memoiva_mock_db_v1`) seeded from `src/lib/seedData.js`.
  Used automatically whenever Supabase isn't configured, so local dev and
  any preview deploy without a project still work exactly as v1 shipped
  (three demo logins, no real backend).

Both adapters export the same function names and return shapes, so which
one is active is invisible to every component.

### Supabase schema

Run `app/supabase/schema.sql` once against a fresh Supabase project (SQL
Editor, or the CLI) to create the tables, the auth-linking trigger, and
row-level security policies (participants see only their own data;
facilitators see only their own cohorts; facilitator notes and coloring
saves are never visible to the participant; admins see everything).

| Table | Key columns |
|---|---|
| `users` | id, email, role (`participant`/`facilitator`/`admin`), full_name, preferred_language (`es`/`esl`), created_at |
| `cohorts` | id, name, track (`es`/`esl`), level, block_number, current_week, facilitator_id, start_date, end_date |
| `cohort_participants` | cohort_id, participant_id, enrolled_at |
| `weekly_content` | id, cohort_id, week_number, track, theme, vocabulary[] ({word, translation, pronunciation}), identity_close_es, identity_close_en |
| `participant_progress` | id, participant_id, cohort_id, week_number, session (`A`/`B`), check_in_confidence (1–5), check_in_memory (1–5), completed_at |
| `game_scores` | id, participant_id, cohort_id, week_number, game_type, score, max_score, duration_seconds, played_at |
| `coloring_saves` | id, participant_id, week_number, image_data ({regionId: hexColor}), saved_at |
| `facilitator_notes` | id, participant_id, facilitator_id, note, updated_at |

## Bilingual UI (i18n)

`src/lib/i18n.js` holds all UI strings in EN and ES; components call `t(key)`
via `AppContext`. The demo cohort's track follows the demo participant's
language pick. Program model: `es` track (English speakers learning Spanish)
and `esl` track (Spanish speakers learning English).

## Accessibility (designed for 50+ / cognitive-health population)

Non-negotiables already implemented — preserve them in every future change:

- 18px minimum body text
- 48px minimum tap targets
- WCAG AA contrast
- Visible focus states
- `prefers-reduced-motion` respected
- One clear action per screen wherever possible

## Build & run

```bash
cd app
npm install
cp .env.example .env.local   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
                              # to use a real backend — leave unset for the demo mock
npm run dev     # local dev server
npm run build   # outputs to app/dist — verified working in both modes
```

## What's still deliberately NOT here

- Real invite/account-management UI for adding facilitators/admins (rows
  are added directly in Supabase for now — see `PRD.md` §8)
- Payments, messaging, or notifications
- The pre/post assessment (kept out of the app by design — see `PRD.md` §7)

See `deployment-and-hosting.md` for how and when those get added, and
`PRD.md` for the product decisions behind these choices.
