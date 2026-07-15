# MEMOIVA Program State — living inventory

**Rule: check this file first at the start of every work session; update it
last before pushing.**

_Last updated: 2026-07-15 (docs transfer + app build verification session)_

## Built and verified

- **Public website** — `index.html` (single self-contained file), live via Netlify. Waitlist + partner forms wired to Netlify Forms.
- **Web app v1** — `/app` (React + Vite + Tailwind). Production build verified (`npm run build` passes) and smoke-tested in a browser: role picker, EN/ES toggle, and participant dashboard all render.
  - Participant: dashboard, This Week, vocabulary flashcards, Memory Grid game, Coloring Studio, My Progress, weekly check-in (confidence + memory 1–5)
  - Facilitator: cohort list, cohort view with roster, participant detail with notes
  - Admin: all-cohorts view, user management
  - Bilingual UI (EN/ES), role-based route guards, accessibility rules for 50+ users

## Mocked (works in demo, not real yet)

- **Auth** — demo role picker (Maria/Teacher/Ruthy), no real login
- **Database** — localStorage mock in `app/src/lib/dataClient.js`; row shapes mirror the planned Supabase schema exactly
- **Content** — one seeded cohort, week 1 only ("Mi hogar / My Home")

## Not started

- Supabase project (auth + Postgres) and the dataClient swap
- Deploying the app itself (website is deployed; app is not yet) — see `deployment-and-hosting.md`
- PIN/preview gate for stakeholder demos
- Real curriculum content beyond week 1 (blocked on curriculum docs — see below)
- iOS / Android packaging (Capacitor; planned after Supabase)

## Blocked / needs Ruthy

- **Reference docs re-upload** — pedagogy.md, character-system.md, assessment-design.md, short-movie-talks.md, SKILL.md, file-structure.md, and both .docx specs were shared only with a previous Claude session and are not in GitHub. Attach them in a session and have them committed to `docs/app/`. Until then, curriculum-content work should not proceed (risk of contradicting locked design decisions).

## Standing rules

- All data access through `app/src/lib/dataClient.js` — nothing else touches storage
- Proprietary curriculum details (project-brief §3) never appear in public pages
- Validate design changes against the 50+ / cognitive-health population before shipping
