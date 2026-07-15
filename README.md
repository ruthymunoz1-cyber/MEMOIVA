# 🧠 MEMOIVA Circle

*A Flagship Program of RAMP Linguistic Society LLC — Woman Veteran-Owned Language & Technology Company, West Palm Beach, FL*

The public website and launch materials for **MEMOIVA Circle** — a facilitated
bilingual cognitive wellness program for adults 50+ navigating cognitive
decline or protecting their brain health.

## What's in this repo

```
index.html   — the entire public website (single file, self-contained, no
               build step — images are embedded as base64, fonts load from
               Google Fonts CDN, everything else is plain HTML/CSS/JS)
docs/        — planning & launch reference material
  project-brief.md                        — full spec: brand, pricing, IP
                                             protection rules, tech stack,
                                             locked decisions
  facebook-launch-copy.md                 — ready-to-paste FB page setup +
                                             5 launch posts + hashtag lists
  institutional-partnership-form-guide.md — Google Forms setup guide for the
                                             B2B "Partner With Us" inquiry form
```

**Read `docs/project-brief.md` first** — it's the canonical spec. In
particular, **Section 3 lists proprietary curriculum details that must never
appear in `index.html`** (session structure, character names, assessment
timing, etc.) — check any future edit against that list before it goes live.

## Hosting — Netlify (locked decision, see project brief §4/§10)

This was chosen deliberately over GitHub Pages/Vercel for non-developer ease.

**Recommended path (auto-deploys on every future edit) — do this one:**
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Connect GitHub, authorize Netlify, pick **`ruthymunoz1-cyber/MEMOIVA`**
3. Build settings: leave everything blank/default (no build command, publish directory `/`) — it's a static file, nothing to build
4. Deploy. Every future `git push` to `main` redeploys automatically — no manual re-uploads ever again
5. Site settings → Domain management → add `memoiva.com`

**Fastest path (skip if you did the above)** — drag `index.html` onto [app.netlify.com/drop](https://app.netlify.com/drop) for an instant one-off deploy with no GitHub connection. Fine for a quick preview, but every edit after that has to be re-dragged by hand — the GitHub-connected path above is the one that actually saves you time going forward.

## Waitlist & partner form submissions — Netlify Forms (wired, no setup needed)

Both forms now POST to Netlify Forms automatically once the site is deployed
through Netlify (either path above) — no Google Apps Script, no backend code.
Submissions land in **Site → Forms** in your Netlify dashboard, and you can
turn on an email notification per form there (Forms → Settings → Form
notifications) so you get pinged the moment someone joins the waitlist. The
`mailto:` fallback still fires too, so you get a backup copy in your inbox
either way.

## Still needed before full launch (from the project brief's checklist)

- [ ] Set up Stripe for the $100 refundable deposit
- [ ] Create the Facebook page per `docs/facebook-launch-copy.md`
- [ ] Legal review of the full site
- [ ] Confirm SDVOSB/WOSB certifications, then add to the site

## Brand quick reference

Navy `#1A2B4C` · Teal `#0E7C7B` · Teal Light `#00C4C4` · Gold `#B8860B` ·
Gold Light `#E8B84B` · Purple `#7A6BCC` · Cream `#F8F9FA`
Display: Bebas Neue · Serif: Cormorant Garamond · Sans: Jost

Full details, locked pricing, FTC-compliant language rules, and the complete
decision log are in `docs/project-brief.md`.
