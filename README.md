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

**Fastest path (no GitHub connection needed):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `index.html` onto the page → it's live immediately on a `*.netlify.app` URL
3. Netlify → Site settings → Domain management → add `memoiva.com`

**Recommended path (auto-deploys on every future edit):**
1. Netlify → Add new site → Import an existing project → connect this GitHub repo
2. Every push to `main` redeploys automatically — no manual re-uploads ever again
3. Connect `memoiva.com` the same way as above

## Still needed before full launch (from the project brief's checklist)

- [ ] Replace `SHEETS_URL` placeholder in `index.html`'s `<script>` with a real
      Google Apps Script Web App URL (both the waitlist and partner forms post
      here) — until then, submissions fall back to a `mailto:` link, which
      works but isn't as reliable on mobile
- [ ] Build the two Google Forms (waitlist + partner) per `docs/`
      guide, or finish wiring the Apps Script Sheets pipeline instead
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
