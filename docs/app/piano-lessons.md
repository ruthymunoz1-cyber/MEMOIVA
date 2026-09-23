# MEMOIVA Piano Lessons — Design Note

**Status:** v1 built and working (`app/src/pages/participant/Piano.jsx`),
running on a placeholder color scheme and lesson (§3–4) by founder
decision, 2026-09-23. A collaborator is writing up MEMOIVA's own original
method to replace it — see §8 for the exact spec they need.

## 1. What it is

Piano taught entirely inside the app via an on-screen, color-coded
keyboard — no physical instrument, MIDI device, or microphone needed.
Students tap/click keys (confirmed as the input method, not a real
piano/MIDI connection). Notes play as synthesized tones (Web Audio API,
built into every modern browser — no audio files or paid service
involved).

## 2. Why it isn't built on "Piano by Pictures" or Stephen Ridley's method

Two different sources got checked, and turned out to be two different,
unrelated products:

- **Stephen Ridley** — creator of **Ridley Academy** / "The Complete
  Piano Masterclass," a paid course ($1,397–$2,997). One search result
  was a Truth in Advertising (consumer-protection watchdog) article
  titled "Stephen Ridley's Piano Academy: The Disturbing Truth" — worth
  knowing given MEMOIVA's own brand carefully avoids anything that reads
  as overreaching or deceptive (see the FTC/Lumosity caution in
  `project-brief.md`). Nothing tied "Piano by Pictures" to him
  specifically.
- **"Piano by Pictures"** — a real, separate paid product from **Gospel
  on the Go Piano**, which teaches using images instead of traditional
  sheet music. Confirmed via search that it exists and is real; could not
  access the actual site or landing page directly (blocked by this
  session's network policy as an ad-tracking domain) or find specifics of
  their actual system beyond the general "pictures, not sheet music"
  description.

Either way, the same reasoning applies: **building a commercial product
around a paid competitor's specific proprietary method is a real IP
risk**, not something to do by guessing from marketing copy, even where
the general teaching philosophy (pictures/colors instead of sheet music,
small steps, real songs early) is common, non-exclusive good pedagogy
that's fine to draw on in spirit.

**Founder decision, 2026-09-23:** keep the current placeholder system for
now (§3–4 below). A trusted collaborator is writing up MEMOIVA's own
original method description, which replaces this placeholder once ready
— see §8 for exactly what that write-up needs to include.

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
3. Original MEMOIVA method write-up from your collaborator — see §8 for
   exactly what to give them

## 8. Spec for the original MEMOIVA method write-up

Six things this needs to cover to actually replace the placeholder —
written for a non-technical collaborator, not as code:

1. **Color-to-note mapping** — for all 12 notes in an octave (the 7
   natural notes C-D-E-F-G-A-B, plus the 5 sharps/flats in between),
   which color represents each one. A simple list is enough ("C = red,
   C# = ?, D = orange…"); specific hex codes are ideal but "a warm red"
   works too.
2. **Color-only, or color + picture** — some methods pair each note with
   both a color *and* a small image (e.g. "C = red apple," "D = orange
   sun") to help it stick. If pictures are part of it, need the image
   that goes with each note.
3. **How a full song gets represented** — once a note has a color/
   picture, a song becomes a sequence of those cues in order (sheet
   music, but in colors instead of notes on a staff). For each song
   wanted, need that sequence — either the song translated into
   color-sequence form, or enough detail (song name + notes in order) to
   build it from.
4. **Lesson progression** — what comes first, second, third (e.g. learn
   where each color/note is → play a 3-note pattern → play a full simple
   song). How many lessons for a first version, and roughly what order.
5. **What counts as "done"** — hit every note perfectly in order, or is
   there room for mistakes/retries before a lesson counts as complete?
   (Current placeholder: unlimited retries, must hit the sequence in
   order.)
6. **Real song choices, if any** — actual well-known songs (not just
   drills) each need the same public-domain check done for
   `song-library.md` — flag the song titles and this gets verified.

**Separate, bigger ask, not part of this handoff:** real piano-sample
audio instead of the synthesized tones currently used would need actual
audio files, not just a written description — treat as a later upgrade.
