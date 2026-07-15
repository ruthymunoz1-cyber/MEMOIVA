# MEMOIVA Web App — Architecture (v1, as built)

This document is derived from the actual code in `/app` (commit "Add MEMOIVA
web app v1"). It replaces the architecture notes that lived in the other
Claude session. The original `MEMOIVA_WebApp_Architecture_Spec.docx` should
still be re-uploaded for the full v1 feature rationale (see `README.md` in
this folder).

## Stack

- **React 18 + Vite 5** — single-page app, no server-side code
- **Tailwind CSS 3** — brand tokens in `app/tailwind.config.js` (teal `#0E7C7B`, navy `#1A2B4C`, gold `#B8860B`)
- **react-router-dom** — client-side routing
- **No backend yet** — all data goes through one mock adapter (see Data layer)

## Roles & routes

Three roles with route guards (`src/components/RequireRole.jsx`). Entry point
is a demo role picker at `/` with an EN/ES language toggle.

| Role | Routes | Pages |
|---|---|---|
| Participant | `/app`, `/app/week`, `/app/vocabulary`, `/app/games`, `/app/coloring`, `/app/progress`, `/app/check-in` | Dashboard, This Week, Flashcards, Memory Grid game, Coloring Studio, My Progress, weekly Check-In |
| Facilitator | `/facilitator`, `/facilitator/cohorts/:cohortId`, `/facilitator/participants/:participantId` | My Cohorts, Cohort View (roster + progress), Participant Detail (incl. facilitator notes) |
| Admin | `/admin`, `/admin/users` | All Cohorts, User Management |

## Data layer — the single most important rule

**All data access goes through `src/lib/dataClient.js`.** It is the ONLY file
that may touch storage. v1 ships a mock backed by `localStorage`
(`memoiva_mock_db_v1`) seeded from `src/lib/seedData.js`. Every function is
async and returns rows shaped exactly like the planned Supabase schema, so
going live on Supabase later means replacing only the function bodies in that
one file — no component changes.

### Planned Supabase schema (mirrored by the mock)

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
npm run dev     # local dev server
npm run build   # outputs to app/dist — verified working
```

## What v1 deliberately does NOT have

- Real authentication (demo role picker only)
- A real database (localStorage mock)
- Payments, messaging, or notifications
- Server-side anything

See `deployment-and-hosting.md` for how and when those get added.
