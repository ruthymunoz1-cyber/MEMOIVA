# MEMOIVA Pre/Post Instrument — Design Draft

**Status:** Structure approved; piano segment built in-app; most other
segments still facilitator-administered outside the app. Several items
marked below still need your actual creative content before this is
final.

This is the working replacement for the `assessment-design.md` reference
document that was never uploaded to this repo (see `program-state.md`,
Blocked section). If the original document turns up later, reconcile
against it rather than assuming this draft wins.

Originally scoped (per `PRD.md` §7) to stay entirely external to the app
for beta 1. **Superseded 2026-09-23** — founder direction is to build now
rather than defer to Phase 2 (see §6). Piano is the first segment
actually built into the app; the rest remain facilitator-administered for
now, not because of a timing decision but because their content (song,
movement routine, video) isn't supplied yet.

---

## 1. What it measures and why (founder-directed, 2026-09-23)

Seven areas, matching the program's three pillars (Language · Brain
Health · Music) plus self-report:

1. Vocabulary recognition/recall (**Language**)
2. Conversational/functional ability (**Language**)
3. Song recall (**Music**)
4. Coordinated movement / seated "chair dancing" (**Brain Health**)
5. General cognitive engagement (**Brain Health**)
6. Piano — color-note matching (**Music / Brain Health**, added
   2026-09-23, see §3a and `piano-lessons.md`)
7. Confidence & self-perception (self-report, all three pillars)

**Framing rule, non-negotiable (per project-brief.md §6, FTC/Lumosity
caution):** nothing here is scored as pass/fail or presented as measuring
cognitive decline. Everything is descriptive ("recognized 7 of 10 words,"
"participated fully") and encouraging, never diagnostic language.

## 2. Structure — same shape for both tracks

Same structure for MEMOIVA Circle Español and Círculo MEMOIVA en Inglés —
only the language of the content mirrors. Administered week 1 (baseline)
and week 8 (comparison), by the facilitator, in person over Zoom, with
voice used to capture answers from students who can't write or aren't
comfortable with a keyboard (see §5 on how that need gets met).

**Timing update, 2026-09-23:** the original 8–10 minute cap is lifted per
founder direction, now that piano is part of the instrument — length is
no longer the constraint. The table below is no longer time-boxed;
segments run as long as each actually takes.

| # | Segment | Pillar | Format |
|---|---|---|---|
| 1 | Warm welcome + song moment | Music | Facilitator leads a song; participation noted, not scored |
| 2 | Seated movement | Brain Health | Facilitator leads a simple seated/hand-movement sequence; participation noted, not scored |
| 3 | Vocabulary recall | Language | Facilitator says/shows each item, student answers aloud; score = # recognized out of 10 |
| 4 | One conversational prompt | Language | Open prompt ("Tell me your name and one thing about your home"); rubric: no attempt / attempted / clear response — not right/wrong |
| 5 | Piano — color-note matching | Music / Brain Health | In-app: student matches colored keys to the target sequence (see §3a); score = notes matched in order |
| 6 | Confidence & self-perception | Self-report | 6 short statements, 1–5 scale, read aloud if needed |
| 7 | Closing moment | Engagement | A calm wind-down (coloring or similar); reaction only ("how did that feel?"), not scored |

### What's already built and can be reused

- **Segment 3 could double as a scored round of the existing Memory Grid
  game** for the "general cognitive engagement" measure — same
  infrastructure, no new game to build. Recommend using the game's
  existing score (week 1 vs. week 8) as that data point rather than
  inventing a separate cognitive test.
- **Segment 5 (piano) is built** — `Piano.jsx`, see §3a and
  `piano-lessons.md`.
- **Segment 7** can literally be the existing Coloring Studio — a calm
  close, already built, already brand-appropriate.

### What's new engineering, not built yet

- Voice capture for segments 3–4 (see §5)
- Any video content for segments 1–2 (see §4, needs your input on what
  video)
- In-app builds of segments 1 (song — see §3b/`song-library.md`) and 2
  (movement) — only the piano segment (5) is actually wired into the app
  as a testable activity so far; the rest of the instrument is still
  facilitator-administered outside the app per §6.

## 3. Vocabulary recall — draft 10-item list

**6 real items**, pulled directly from the actual Week 1 content already
in the app (`seedData.js`, theme "Mi hogar / My Home"). These work well as
a pre/post anchor precisely *because* of spaced repetition — a student
shouldn't know these at week 1 and should know them solidly by week 8.

**4 draft items**, common early-beginner vocabulary I've added to round
out the set (greetings, family, counting) — these are NOT from real
curriculum content (none exists for weeks 2–8 yet). Please edit, replace,
or approve.

| # | Spanish | English | Source |
|---|---|---|---|
| 1 | la casa | house | Real — Week 1 |
| 2 | el sol | sun | Real — Week 1 |
| 3 | el árbol | tree | Real — Week 1 |
| 4 | la flor | flower | Real — Week 1 |
| 5 | la puerta | door | Real — Week 1 |
| 6 | la ventana | window | Real — Week 1 |
| 7 | hola | hello | **Draft — please review** |
| 8 | gracias | thank you | **Draft — please review** |
| 9 | la familia | family | **Draft — please review** |
| 10 | contar del uno al cinco | count from one to five | **Draft — please review** (functional task, not a single word) |

For the English track (Círculo MEMOIVA en Inglés), mirror the same 10
concepts in the other direction once you confirm the list.

## 3a. Piano segment — built, see `piano-lessons.md`

Added 2026-09-23 per founder direction, using an on-screen color-coded
virtual keyboard (tap/click, no physical instrument). Full design
rationale — including why it isn't built on Stephen Ridley's specific
method (paid, proprietary, and not something that could be verified as
"Piano by Pictures") — is in `piano-lessons.md`. Short version: the color
scheme and first exercise are working placeholders using a
non-proprietary, widely-used convention, pending your review.

## 3b. Song segment — resolved, see `song-library.md`

Segment 1's "which song" question (§4 below, originally open) is
resolved: MEMOIVA records its own vocal performances over public-domain
melodies, for both the weekly signature song and a browsable public-
domain catalog. Full design, including a legal note on recordings vs.
compositions being public domain, is in `song-library.md`. The specific
song for segment 1 is still pending — see that doc's open items.

## 4. Needs your actual creative content — not something I should invent

These are proprietary/creative decisions, not engineering ones, and
inventing them myself risks contradicting whatever you already have in
mind (the same reason character names, the Identity Close, and session
structure are locked, founder-owned content per `project-brief.md`):

- **The song** for segment 1 — resolved as "RAMP's own recording of a
  public-domain melody," see §3b. Still needed: the actual song itself
  (see `song-library.md` open items).
- **The movement routine** for segment 2 — specific seated/hand-movement
  sequence (a "clap-clap-tap" pattern? something else?)
- **The 6 confidence/self-perception statements** — I drafted a
  starting set below in the program's brand voice; treat these as a
  draft, not final:

  **English (draft):**
  1. I feel confident trying to speak or understand new words.
  2. I feel like my memory is getting stronger since I started.
  3. I look forward to our sessions together.
  4. I feel comfortable making mistakes while I practice.
  5. I feel connected to the other students in my circle.
  6. I feel proud of what I'm learning.

  **Español (borrador, usted formal):**
  1. Me siento con confianza al intentar hablar o entender palabras nuevas.
  2. Siento que mi memoria se ha fortalecido desde que comencé.
  3. Espero con gusto nuestras sesiones juntas/os.
  4. Me siento cómoda/o cometiendo errores mientras practico.
  5. Me siento conectada/o con las demás personas de mi círculo.
  6. Me siento orgullosa/o de lo que estoy aprendiendo.

- **Video content** — you mentioned videos specifically. What should they
  show — the movement routine demonstrated? Something else? Needed before
  this can be scoped as engineering work.

## 5. Voice recognition — what it would take

You asked for voice recognition so students who can't write or aren't
tech-savvy can still answer. This is buildable using the browser's
built-in speech-to-text (Web Speech API) — no per-use cost, works in
Chrome/Safari/Edge. Scope: capture the student's spoken answer to
segments 3–4, convert to text, and let the facilitator review/confirm it
rather than trusting the transcription blindly (accuracy varies,
especially with accents and background noise on a Zoom call — this needs
a human check, not silent auto-scoring). This is new engineering, not
something that exists in the app today.

## 6. Timing — superseded, 2026-09-23: building now, not deferred to Phase 2

The original recommendation here was to design this now and build it
after beta 1, so it wouldn't compete with the Supabase backend work.
**Founder direction, 2026-09-23: build now instead** — accepting that
this pushes the beta timeline past the original 4–6 week target. Piano
(§3a) and the song library mechanism (§3b) are built as a result. Voice
capture (§5) and video content (§4) are not yet — still real, not-yet-
scoped engineering work.

One thing that hasn't changed: **the actual Supabase project still needs
to be created by you** (see `program-state.md`, Blocked section) — no
amount of building here substitutes for that step, and it's still what's
actually standing between the app and a real cohort using any of this
with real, persistent, multi-device data.

## 7. Open items before this is final

1. Approve or edit the 4 draft vocabulary items (§3)
2. Supply the actual song (§3b / `song-library.md`)
3. Supply the movement routine (§4)
4. Approve or edit the 6 confidence statements (§4)
5. Describe what the video content should actually show (§4)
6. Review/replace the piano color scheme and first lesson (§3a /
   `piano-lessons.md`)
7. Create the Supabase project — see `program-state.md`, still the real
   blocker regardless of how much else gets built
