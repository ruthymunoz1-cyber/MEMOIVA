# MEMOIVA Piano Lessons — Design Note

**Status:** v1 built and working (`app/src/pages/participant/Piano.jsx`).
Color scheme and first lesson are placeholders pending your review — see
§3.

## 1. What it is

Piano taught entirely inside the app via an on-screen, color-coded
keyboard — no physical instrument, MIDI device, or microphone needed.
Students tap/click keys (confirmed as the input method, not a real
piano/MIDI connection). Notes play as synthesized tones (Web Audio API,
built into every modern browser — no audio files or paid service
involved).

## 2. Why it isn't built on "Piano by Pictures" / Stephen Ridley's method

Searched for this while building: Stephen Ridley is the creator of
**Ridley Academy** / "The Complete Piano Masterclass," a paid course
($1,397–$2,997). One search result was a Truth in Advertising (a
consumer-protection watchdog) article titled "Stephen Ridley's Piano
Academy: The Disturbing Truth" — worth knowing given MEMOIVA's own brand
carefully avoids anything that reads as overreaching or deceptive (see
the FTC/Lumosity caution in `project-brief.md`). Nothing specifically
called "Piano by Pictures" turned up tied to him.

Two separate things, treated differently:
- **His specific proprietary method/color system** (if he has one) — not
  used. Even if found, building a commercial product around a paid
  competitor's specific method is a real IP risk, not something to do
  without a license.
- **General teaching philosophy** — ideas like "small steps" and "play
  real, simple songs from day one, no sheet music required" are common
  good beginner-piano pedagogy, not exclusive to any one course. v1
  borrows the *spirit* of that, not his content.

If you actually own his course and want something specific pulled from
it, share the material directly and this gets revised — but nothing here
was built by guessing at his proprietary content.

## 3. The color scheme — placeholder, needs your sign-off

v1 uses the standard **rainbow-by-note-name convention**, the same one
used by Boomwhackers and similar color-note teaching tools broadly in
music education (not proprietary to anyone):

| Note | Color |
|---|---|
| C | Red |
| D | Orange |
| E | Yellow |
| F | Green |
| G | Blue |
| A | Indigo (MEMOIVA's brand purple, `#7A6BCC`) |
| B | Violet |

This is a reasonable, safe default — not a claim that it matches
whatever "these" (the reference material that didn't come through) said.
If you have a specific scheme in mind, send it and the keyboard's colors
get swapped — it's one array in the code, not a rebuild.

## 4. First lesson — also a placeholder

v1 ships one guided exercise: the opening phrase of "Twinkle, Twinkle,
Little Star" (C C G G A A G — 7 notes matching the 7 syllables). Chosen
because it's unambiguously public domain (lyrics 1806, melody 1761), a
standard, well-known first exercise in beginner piano teaching generally,
and simple enough to build and verify today. This is not a claim that
it's the "right" first lesson for MEMOIVA's program — just a working
placeholder so the feature is demonstrably real. A real lesson
progression (how many songs, what order, tied to which weeks) is
content-design work for you, same category as the vocabulary and
assessment content in `assessment-design.md`.

## 5. How it's scored

Reuses the existing `game_scores` table/infrastructure (no new schema),
logged as `game_type: 'piano'` — same pattern as the Memory Grid game.
Score = notes matched in the correct sequence out of the lesson length.

## 6. What's NOT built yet

- Black keys are playable (correct pitch) but not part of the color
  lesson or scoring — only the 7 natural notes are taught in v1.
- No lesson progression/levels beyond the one example — just proves the
  mechanism works.
- No admin UI to author new lessons — for now, a developer edits the
  `LESSON` array in code. Worth a proper content-editing tool once
  there's more than one lesson, not before.

## 7. Open items before this is more than a working demo

1. Confirm or replace the color scheme (§3)
2. Confirm or replace the first lesson / decide the real lesson
   progression across weeks (§4)
3. If you have Stephen Ridley's actual material and it's meant to be
   used, share it directly rather than have it guessed at
