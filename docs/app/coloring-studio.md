# MEMOIVA Coloring — App vs. Print (two separate things)

**Status:** Clarified 2026-09-24. These were being treated as one thing;
they aren't.

## The split

- **Printed coloring book** — a physical product, part of the workbook
  deliverable (`project-brief.md` §5: "Printed workbook — optional
  add-on"). Features the story characters (Robert, Elena, Carlos — see
  `movie-talk-story.md`). **Not part of the app.** This is print design
  work (layout, line art meant for paper, a print-ready file), a separate
  production line from anything in `/app`. If/when this gets designed,
  it's not a code task — flag it as a design/print workstream, not
  something to build here.
- **In-app Coloring Studio** — stays in the app, but re-scoped per
  founder direction: not a character-illustrated scene, but something
  "more suitable for an adult thing" — brain-health/calming-oriented,
  dignity-forward, not childlike.

## What's in the app now

Two patterns, picked from a tab row in `ColoringStudio.jsx`:

1. **Home** — the original v1 scene (house, sun, tree, flower), matching
   Week 1's actual vocabulary. Unchanged.
2. **Calm Pattern** — new, 2026-09-24: a generated mandala (a center
   circle plus three rings of 8/12/16 segments, 37 fillable regions
   total). Geometric and symmetric rather than a scene — the point is a
   quiet, self-paced activity, not a themed illustration. Computed from
   coordinates in code, not hand-drawn, so it stays evenly proportioned.

Progress is saved per pattern (a `page_id` — `week-1` or `calm-mandala` —
not just a week number as before), so working on one never overwrites
progress on the other. Screenshot-verified working in both mock and (once
credentials exist) Supabase mode — same `getColoringProgress`/
`saveColoringProgress` functions, now keyed by `pageId`.

## Open items

1. Is one calming mandala enough for v1, or do you want more than one
   pattern to choose from (still non-character, still adult-register)?
2. Confirm the framing/copy — currently "A quiet moment — pick a color
   and fill in the pattern at your own pace." Change if that's not the
   right tone.
3. The printed coloring book itself — whenever that's ready to move
   forward, it needs a designer/print workflow, not app engineering. Flag
   separately when you're ready to start it.
