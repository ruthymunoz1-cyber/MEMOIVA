# MEMOIVA App — Deployment & Hosting Plan

Answering the standing question: *"Do I need Supabase or Vercel, or can we
just use GitHub/Netlify, or bake the app into the MEMOIVA website with a PIN?"*

## Short answer

- **GitHub + Netlify is enough for now. No Vercel, ever** — Vercel does the
  same job as Netlify and the Netlify decision is already locked (project
  brief §4/§10). Two hosts means double the accounts and confusion for zero
  benefit.
- **Supabase is not hosting** — it's the future login + database service. The
  app doesn't need it yet (v1 runs on built-in demo data). It becomes
  necessary the day real participants have real accounts and real progress
  data that must survive across devices. It has a free tier; the swap point
  is already built into the code (`app/src/lib/dataClient.js`).
- **Yes, the app can be baked into the MEMOIVA website with a PIN.** The app
  builds to plain static files, so Netlify can serve the marketing site at
  `memoiva.com` and the app at `memoiva.com/app` from the same repo, same
  deploy, same (free) Netlify account.

## The PIN — what it is and isn't

A PIN screen in front of `/app` is a *curtain*, not a *lock*: it keeps casual
visitors and search engines out during the preview period, and that's all v1
needs because the demo contains no real participant data. It is **not**
adequate protection for real participants' names and progress — that data is
private health-adjacent information for a 50+ population. Before any real
participant uses the app, the PIN must be replaced by real logins (Supabase
Auth: email + password or magic email links, which are friendlier for 50+
users than passwords).

## Rollout stages

| Stage | What changes | New accounts/costs |
|---|---|---|
| **1. Now — preview** | Netlify builds `/app` and serves it at `memoiva.com/app` behind a simple PIN screen | None (existing Netlify free tier) |
| **2. Real participants** | Create Supabase project; swap mock bodies in `dataClient.js` for real Supabase calls; replace PIN with real logins | Supabase free tier (paid ~$25/mo only if usage grows) |
| **3. Phones — easy step** | Enable PWA (installable web app): participants "Add to Home Screen", get an icon and full-screen app. No app stores involved | None |
| **4. App stores** | Wrap the same React app with **Capacitor** to produce real iOS and Android apps; submit to stores | Apple Developer $99/yr, Google Play $25 one-time, and store-review lead time |

Stages 3 and 4 reuse the same codebase — nothing about the current React app
has to be rebuilt for mobile. Do stage 2 before stage 4: app stores will
reject or flag apps whose "login" is a shared PIN.

## Practical notes for stage 1 (when approved)

- Add a `netlify.toml` at repo root: build command `cd app && npm install && npm run build`, publish the site so `index.html` stays at `/` and `app/dist` is served under `/app` (Vite `base: '/app/'`).
- Keep Netlify Forms wiring on the marketing site untouched.
- Add `noindex` meta to the app pages while it's preview-only.

## 2026-09-23: re-confirmed — still Netlify, not Vercel

Came up again while discussing whether the Supabase backend work was
blocking progress. To be clear: **switching to Vercel would not have
helped with that** — Vercel and Netlify are both just static-file hosts;
neither one provides a database or accounts. The actual blocker is that
a Supabase project (a separate free service, unrelated to hosting) needs
to be created — see `program-state.md`, Blocked section. Netlify stays
the answer above.

## 2026-10-25: app deploys as its own Netlify site — path-prefix plan revised

Real accounts are live (Supabase schema confirmed run against the real
project — see `program-state.md`). To actually log in, the app needs a
real URL. Building it:

**The original "serve under `memoiva.com/app`" idea has a routing bug,
caught before deploying:** the app's own React Router already uses
`/app` as an internal path (for the participant section, distinct from
`/facilitator` and `/admin`). Nesting the whole app under a Netlify path
prefix of `/app` too would double it up — `memoiva.com/app/app/songs`.

**Revised plan:** `netlify.toml` (repo root) now builds the app as its
**own separate Netlify site** — `base = "app"`, builds from that
subfolder, serves at its own `something.netlify.app` URL with no prefix,
so the app's internal `/app`, `/facilitator`, `/admin` routes work
exactly as written. Includes the SPA fallback redirect so direct links
and page refreshes on any route work (not just the homepage).

When ready to attach a real domain: point a **subdomain** at this site —
`app.memoiva.com` — rather than a path prefix. Avoids the nesting problem
entirely and is simpler in Netlify's domain settings than a path-based
split would be anyway. The marketing site keeps `index.html` at
`memoiva.com` exactly as it is now; nothing about it changes.

**To actually deploy:**
1. app.netlify.com → **Add new site → Import an existing project** →
   connect GitHub → pick `ruthymunoz1-cyber/MEMOIVA`
2. Netlify should auto-detect the settings from `netlify.toml`; if asked
   to confirm: base directory `app`, build command `npm install && npm
   run build`, publish directory `dist`
3. **Before the first deploy** (or right after, then redeploy): Site
   settings → Environment variables → add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` with the same values used in the Claude
   session's environment. **This is a separate step from that
   environment setup** — Netlify's build has no access to this session's
   environment variables; without adding them here too, the deployed app
   builds in demo/mock mode instead of connecting to the real backend.
4. Deploy. You'll get a `yourname.netlify.app` URL immediately — that's
   enough to actually test logging in.

