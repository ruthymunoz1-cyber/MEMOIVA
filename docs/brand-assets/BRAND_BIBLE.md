# MEMOIVA Brand Bible

**This is the single source of truth for colors, fonts, and logo usage.**
Both the public website (`index.html`) and the app (`app/`) must match this
exactly. When either one drifts from this file, that's a bug — fix the code,
not this doc (unless the founder changes the actual brand decision, in which
case update this file first, then propagate to both places).

Created 2026-10-25 after the deployed app was found to be using placeholder
colors and plain text instead of the real brand system — see "Known-drift
history" at the bottom so this doesn't quietly happen again.

## Colors

Locked. Do not substitute, lighten, darken, or "improve" these without the
founder's explicit sign-off — see `program-state.md` for the standing rule.

| Token | Hex | Role |
|---|---|---|
| `navy` | `#1A2B4C` | Primary text, headings, nav |
| `teal` | `#0E7C7B` | Primary brand color — buttons, links, accents |
| `teal-light` (accent) | `#00C4C4` | **Bright accent only** — the stylized "I" in the wordmark, small highlight details, focus rings. Not a background wash. |
| `gold` | `#B8860B` | Secondary accent, CTAs, section labels |
| `gold-light` (accent) | `#E8B84B` | **Bright accent only** — badges, trust dots, highlight text. Not a background wash. |
| `purple` | `#7A6BCC` | Tertiary accent (piano key color, variety in illustrations) |
| `cream` | `#FAF6EC` | Page background. Warm ivory — if it ever renders as a cool gray, the hex got corrupted; it should look warm, not gray. |
| `white` | `#FFFFFF` | Cards, surfaces |
| `text-body` | `#1A1A2E` | Body copy |
| `text-muted` | `#4A5A6A` | Secondary/caption text |

**Important naming trap (this is what went wrong in the app):** the app's
Tailwind config separately defines `teal-light`/`gold-light` as *pale
background washes* (`#E6F2F2`, `#FBF3DF`) for things like button hover
states and card fills — a completely different use case from the bright
`#00C4C4`/`#E8B84B` accent colors above. Both are legitimate, but they are
**not the same color** and must not be confused. In the app's Tailwind
config these live as separate, clearly-named tokens (`teal.wash` /
`gold.wash` for the pale fills, `teal.accent` / `gold.accent` for the true
brand accents) specifically so this doesn't happen again.

## Fonts

Loaded from Google Fonts:
`https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&family=Bebas+Neue&display=swap`

| Role | Font | CSS var (website) | Used for |
|---|---|---|---|
| Display | Bebas Neue | `--ff-display` | The MEMOIVA wordmark, big display numbers/logos |
| Serif | Cormorant Garamond | `--ff-serif` | Headlines, section titles, quotes, emotional/warm copy |
| Sans | Jost | `--ff-sans` | Body text, UI labels, buttons, forms |

Both the website and the app load this same font stack. Neither should fall
back to a generic system font stack — if you see default system fonts
anywhere in MEMOIVA, that's a bug.

## Logo / wordmark usage

The real wordmark (`memoiva-wordmark.png`) treats the word MEMOIVA with one
deliberate detail: **the "I" is set apart in the bright teal accent color**,
everything else navy, in Bebas Neue with wide letter-spacing. The full lockup
also has a thin teal bar and small gold dot beneath the "I" (a stem/note
motif) plus the gold "A Flagship Program of RAMP Linguistic Society" tagline
with the "A" in RAMP picked out in teal — that fuller treatment is for the
standalone logo file itself, not required in running UI text.

**For running text/headings (nav bars, page titles, the app's login
screen),** the website's actual markup is the pattern to copy — it does not
need the dot/bar flourish, just the display font + the colored "I":

```html
<span class="wordmark">MEMO<span class="teal-i">I</span>VA</span>
```
```css
.wordmark { font-family: var(--ff-display); letter-spacing: .18em; color: var(--navy); }
.teal-i { color: var(--teal-light); } /* the #00C4C4 accent, not the wash */
```

Any place in the app or website that renders "MEMOIVA" as a heading should
use this pattern — plain flat-colored text is not the brand wordmark, even
if the color is technically close.

**Trademark symbol:** mark is unregistered, so it's ™ — not ® (® is only
correct once the USPTO has actually issued a registration; using it before
that is a real legal problem, not just a styling choice). ™ goes on the
primary logo/wordmark instances (nav, hero/footer lockups, the app's header
and login screen) — not on every casual mention of "MEMOIVA" in running
body copy, which is standard trademark usage practice. If/when the mark is
actually registered, swap ™ → ® in these same spots and update this note.

**Other approved assets** (`docs/brand-assets/`):
- `memoiva-wordmark.png` — full logo lockup with tagline, for places needing
  the complete mark as an image (e.g. a footer, a PDF cover).
- `memoiva-circle-mark.png` — the glowing-brain circle icon alone, for small
  spaces (favicon-style, badges).
- `memoiva-hero-five-adults.png` — the five-adults-with-glowing-brains
  illustration, with the circle-mark badge above it. Used as-is on the
  website hero.
- `memoiva-hero-faces-only.png` — the same illustration cropped to remove
  the badge, for reuse anywhere the faces alone (without a second MEMOIVA
  mark competing with a nearby wordmark) read better.
- `memoiva-logo-directions-screenshot.png` — reference screenshot of logo
  direction options; not a final asset.

## Accessibility baseline (applies everywhere)

- 18px minimum body text (the app's base font size should not go below this
  for a 50+ audience)
- 48px minimum tap targets
- Respect `prefers-reduced-motion` on any animation
- Don't rely on color alone to convey state/meaning
- **Optional larger text, user-controlled.** The website already has this
  (`index.html` — a "A / A+ / A++" control, `body.fs-large`/`body.fs-xl`
  bump `--fs-base` from 20px up to 23px/26px) plus a high-contrast toggle.
  The app needs the equivalent: a visible, persistent control (not buried in
  a settings page) to step text size up, available on every screen. Confirmed
  founder requirement 2026-10-25 — not yet built in the app.
- **Spoken / read-aloud support.** Founder requirement, 2026-10-25, not yet
  built anywhere (website or app). Plan: a "read this aloud" control using
  the browser's built-in Web Speech API (`speechSynthesis` — free, no API
  key, no new backend), on screens with meaningful text to read (lesson
  content, instructions, vocabulary). Caveat to flag to the founder before
  relying on it: voice quality/availability (especially Spanish voices)
  varies by the participant's own device and OS, since it uses whatever
  voices are already installed there — it is not a studio-recorded
  narration. If consistent, high-quality narration turns out to matter more
  than the zero-cost/no-backend tradeoff, pre-recorded audio per screen
  would be the more reliable alternative, at the cost of needing real
  recordings for every piece of text.

## Known-drift history

- **2026-10-25:** Deployed app's login screen found rendering "MEMOIVA" as
  plain system-font text in flat `#0E7C7B` teal, no distinctive "I", no
  brand font loaded at all (`app/index.html` had no Google Fonts link). Root
  cause: the app's Tailwind tokens (`teal.light` = `#E6F2F2`, `gold.light` =
  `#FBF3DF`) were pale washes building out existing hover/fill states, while
  the real brand accent colors (`#00C4C4` / `#E8B84B`) were never added
  under any name, so no code was using them even though the website already
  had them. Fixed same day — see `program-state.md` for what changed.
