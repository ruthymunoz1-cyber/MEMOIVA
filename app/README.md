# MEMOIVA App (v1)

Bilingual (Spanish/English) cognitive-wellness web app for adults 50+.

## Run it

```bash
cd /workspace/memoiva/app
npm install
npm run dev      # dev server
npm run build    # production build
```

## Demo login

No real auth backend yet — the landing screen is a "Choose your demo role"
picker with a language selector (EN/ES):

- **Participant** — Maria Demo
- **Facilitator** — Teacher Demo
- **Admin** — Ruthy Demo

## Architecture notes

- All data access goes through **one adapter**: `src/lib/dataClient.js`.
  It is currently a mock backed by localStorage + seed data
  (`src/lib/seedData.js`) whose row shapes mirror the planned Supabase
  schema exactly. Swapping in real `@supabase/supabase-js` calls later means
  editing only that file — no component touches localStorage directly.
- Roles: participant / facilitator / admin, with role-based route guards
  (`src/components/RequireRole.jsx`).
- Accessibility: 18px minimum body text, 48px minimum tap targets, WCAG AA
  contrast, visible focus states, `prefers-reduced-motion` respected.
- Brand tokens (teal #0E7C7B, navy #1A2B4C, gold #B8860B) live in
  `tailwind.config.js`. The marketing site uses Bebas Neue / Cormorant
  Garamond / Jost from Google Fonts if font brand-match is wanted later.
