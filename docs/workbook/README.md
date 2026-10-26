# MEMOIVA Circle Student Workbook — build

`MEMOIVA-Circle-Student-Workbook.pdf` is generated, not hand-edited.

**To regenerate** (after editing `workbook-source.html` or `calm-mandala.svg`):

```
npm install playwright   # one-time, if not already available
node assemble.mjs        # merges the week-placeholder pages + mandala SVG
                          # into workbook-source.html -> workbook-assembled.html
node render-pdf.mjs       # renders workbook-assembled.html -> the PDF
```

`workbook-assembled.html` is a build artifact (not committed) — safe to
delete between runs.

**What's real vs. placeholder, as of 2026-10-26:**
- Cover, welcome page, Week 1 ("Mi hogar / My Home" — 6 vocabulary words,
  the real identity-close affirmation), both coloring pages (the exact
  "Calm Pattern" mandala geometry from `app/src/pages/participant/
  ColoringStudio.jsx`, reproduced as line art), and the closing page are
  real, finished content.
- Weeks 2–8 are intentionally blank templates ("Content coming soon"),
  matching Week 1's exact layout, waiting on real curriculum content that
  isn't in this repo yet — see `docs/app/program-state.md`'s standing note
  on the missing reference docs. Do not fill these in with invented
  vocabulary; replace them with real content once it's available.

**A rendering note for whoever touches this next:** the cover, closing, and
coloring pages intentionally avoid CSS flexbox for vertical centering
(padding-based centering instead). Flexbox combined with multi-page print
pagination produced unreliable, shrunk page boxes in Chromium's print
engine when this was built — keep new full-bleed pages block-flow, not
flex, unless that's independently re-verified fixed.
