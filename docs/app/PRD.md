# MEMOIVA App — Product Requirements Document (PRD)

**Status:** Approved v1 — founder signed off 2026-09-23 (§5, §6 auth approach,
and §7 all confirmed as written)
**Owner:** Ruthy Muñoz
**Last updated:** 2026-09-23

This PRD covers the **web app** (`/app` — participant, facilitator, and admin
experience). It is the "why and for whom" document that sits above the "how
it's built" docs already in this folder:

- `app-architecture.md` — technical design
- `program-state.md` — living build status
- `deployment-and-hosting.md` — hosting/rollout plan

For the live 8-week MEMOIVA Circle program itself (curriculum, pricing,
brand), see `../project-brief.md`. This PRD treats that program as fixed
context, not something it's redefining.

---

## 1. Problem statement

MEMOIVA Circle is a facilitated, bilingual, small-cohort (max 6 students)
cognitive-wellness program for adults 50+. Today the *live* program (Zoom
sessions + printed/digital workbook) can run entirely without any software.
The app's job is to make the parts of that program that benefit from being
digital — practicing vocabulary, playing memory games, tracking how a
student is doing week to week, and giving the facilitator visibility into
her small roster — better than doing those same things on paper or in a
spreadsheet. It is not the thing that delivers the program; the facilitator
and the live session are.

## 2. Current state (read this before planning any work)

- **The live program has not launched yet.** The project brief's "week of
  July 27, 2026" beta date has passed with no cohort started. There is no
  real cohort, no real students, and no real facilitator usage to learn
  from yet.
- **The app is a working v1 prototype, not a live product.** It runs
  entirely on a mock data layer (`localStorage`, one browser only) with
  three demo logins (Maria/participant, Teacher/facilitator, Ruthy/admin).
  Nothing a demo user does is visible to anyone else, on any other device.
- **Target: get a real beta cohort running within 4–6 weeks of this PRD**
  (roughly late October–early November 2026). That timeline is tight
  enough that it should directly shape what's in v1 and what isn't — see
  §5.

## 3. Goals

1. Give the facilitator a single place to see her small roster's weekly
   progress and jot private notes — replacing whatever ad hoc tracking
   (spreadsheet, memory) she'd otherwise use.
2. Give students a simple, dignity-forward way to practice between
   sessions (vocabulary, a memory game, a coloring activity) and to check
   in on how they're feeling week to week.
3. Ship something real enough that the first beta cohort can actually use
   it, within the 4–6 week window, without over-building.

## Non-goals (explicitly out of scope for v1)

- Payments (handled by Stripe on the public website, not this app)
- Messaging/chat between students and facilitator
- Push notifications or email reminders
- Curriculum beyond week 1 content structure (content authoring is a
  separate workstream from the app itself)
- Native iOS/Android apps (see `deployment-and-hosting.md` for that path —
  it comes after real accounts exist, not before)
- A full multi-tenant admin system for managing many staff accounts (see
  §6 on admin roles)

## 4. Target users

| Role | Who they are | What they need from the app |
|---|---|---|
| **Student** (app role: `participant`) | Adult 50+, in a cohort of up to 6, bilingual track (learning Spanish or English), meeting via Zoom twice a week for 8 weeks. May have varying comfort with technology and, per the program's own framing, may be navigating cognitive decline. | A simple, low-friction way to practice vocabulary and a memory game between sessions, see her own progress, and do a 60-second weekly check-in. Never made to feel like a patient or a test subject. |
| **Facilitator** | Runs 1+ cohorts live over Zoom. | A roster view of her cohort, each student's check-in trend and game activity, and a private place to keep notes per student. |
| **Admin** | Ruthy today; the app should not assume it stays just her. | Visibility across all cohorts and the ability to manage users/cohorts as the program adds facilitators and cohorts over time. |

**Brand voice note carried over from the project brief:** students are
never called "participants," "patients," or "clients" in anything they
see. (`participant` is fine as an internal code/role name — it's not
user-facing copy. The current demo role-picker page labels a button
"Participant," which is acceptable for a dev-only demo screen but should
not carry over once real login replaces it.)

## 5. How the app relates to the live Zoom session — DECIDED

**The app is a between-session companion, not a live-session tool.**
Students use it on their own time — practicing vocabulary, playing the
memory game, checking in — before the next Zoom session. The facilitator
reviews it before or between sessions to see how her roster is doing, not
during the live class. Nothing about the app assumes screen-sharing, Zoom
integration, or real-time use, and nothing in the current build requires
it.

Why: the program is fundamentally a *facilitated, human-led* experience —
that's MEMOIVA's stated advantage over software-only competitors like Lingo
Flamingo. Building the app to be used live during Zoom would mean building
real-time sync, screen-share-friendly UI, and facilitator-led pacing
features — a materially bigger scope that doesn't fit a 4–6 week runway and
isn't needed for the app's core jobs in §3.

**Confirmed by Ruthy, 2026-09-23.** If live-session use turns out to
matter later, that's a Phase 2 scope decision, revisited with real beta
feedback — not something to reopen speculatively.

## 6. Scope for v1 (real beta, not just demo)

### Hard requirement (confirmed): replace the mock data layer with a real shared database

The single biggest gap between today's build and something a real cohort
can use: `localStorage` is scoped to one browser. A facilitator opening the
app on her own laptop cannot see anything a student did on the student's
phone — the core facilitator value in §3 (roster visibility) literally
cannot work without a shared backend. This has to close before beta,
regardless of anything else.

**Auth approach (confirmed):** not a full self-serve signup flow. With
cohorts capped at 6 students, use **Supabase Auth with email magic links**
(no passwords to remember or reset — friendlier for a 50+ audience) and
have the facilitator/admin add each real student's email by hand before
the cohort starts. This gets a real, working, multi-device backend live
within the timeline without building account-management UI that a cohort
of 6 doesn't need yet. `dataClient.js` was already written so this swap
touches one file, not the app's components (see `app-architecture.md`).

### Everything else already in the v1 build carries forward as-is

Dashboard, This Week, vocabulary flashcards, memory game, coloring studio,
weekly check-in, facilitator roster/notes, admin cohort/user views — these
are functionally right for §3's goals. The work for real beta is swapping
their data source, not rebuilding them.

### Explicitly deferred past this beta (Phase 2+)

- Real invite/account-management flow for adding facilitators and admins
  as staff grows (today: hand-added by Ruthy or whoever has database
  access)
- Anything from the "not decided" list in §5 if it turns out to matter
- Content for weeks 2–8 (a curriculum/content workstream, not an app
  engineering one — flag separately)

## 7. The pre/post cognitive assessment — DECIDED: kept out of the app for v1

The pricing in the project brief includes a "pre/post cognitive assessment
+ results" for every student. **Confirmed: this is not built into the app
in v1.** Two reasons:

1. **Compliance risk.** The project brief itself is careful to say the
   program's tools are "educational tools, not clinical diagnostic
   instruments," citing the FTC's $2M Lumosity settlement as the reason to
   avoid overreaching claims. Building an in-app "assessment" under time
   pressure, without a real instrument and methodology already chosen, is
   exactly the kind of thing that could cross that line by accident.
2. **It depends on a decision that hasn't been made yet** — what
   instrument, administered how (paper? a licensed tool? something
   RAMP designs?). That's a content/methodology decision, not an app
   engineering one, and it shouldn't be improvised into existence to hit
   a beta deadline.

**Instrument chosen, 2026-09-23:** a custom RAMP-owned instrument covering
all three program pillars — vocabulary recall and a conversational prompt
(Language), a song moment and seated movement (Music/Brain Health), plus
an expanded confidence/self-perception self-report — explicitly framed as
not a clinical assessment. Full structure, a draft vocabulary list, and
what still needs founder-supplied content are in
**`assessment-design.md`** (new — this is the working replacement for the
un-uploaded `assessment-design.md` reference doc; reconcile against the
original if it turns up later).

**Curriculum-status finding, 2026-09-23:** checked both this repo and the
`ramping-it-up-video-and-content-studio` repo — weeks 2–8 curriculum
content does not exist in either. Only Week 1 is real (the 6 vocabulary
words already in `seedData.js`). The instrument design works around this
by anchoring on Week 1's real content (which holds up well given
spaced-repetition methodology) rather than waiting on curriculum that
doesn't exist yet.

**Still administered outside the app for beta 1** (v1 scope in §6 is
unchanged) — recommended in `assessment-design.md` §6: finalize content
now, administer low-tech for beta 1, build the in-app version (including
voice-capture for students who can't write) as Phase 2 once beta 1 is
running, so it doesn't compete with finishing the Supabase backend. Open
for founder override if this should move up in priority instead.

## 8. Admin roles

You said to plan for multiple staff over time, not just yourself. Good
news: the existing data model already supports this — `users.role` isn't
hardcoded to one admin, and there's already an admin "User Management"
page. What v1 does *not* have yet is a real invite flow (see §6) — for
beta 1, additional admin/facilitator accounts get added by hand, same as
students. Building self-serve staff invites is reasonable Phase 2 scope
once there's more than one or two of them.

## 9. Success metric for v1

You picked **participant engagement** as what matters most right now.
Concretely, for the first real cohort, that means tracking:

- % of students who complete the weekly check-in each week (target: track
  it, don't guess at a number yet — there's no baseline)
- % of students who open the app at all between sessions in a given week
- Which of vocabulary / memory game / coloring gets used, to learn what's
  actually worth a student's time vs. what to cut or rework

None of this requires new instrumentation beyond what already gets written
to the database once it's real (`participant_progress`, `game_scores`,
`coloring_saves` already capture timestamps) — it's a reporting question
for later, not a new feature.

## 10. Non-functional requirements (carried over, already mostly built)

- **Accessibility:** 18px minimum body text, 48px minimum tap targets, WCAG
  AA contrast, visible focus states, `prefers-reduced-motion` respected —
  already implemented per `app-architecture.md`; preserve in all future
  work.
- **Bilingual:** full EN/ES UI, not just content — already implemented.
- **Data sensitivity:** check-in responses (confidence/memory 1–5) and any
  future assessment results are health-adjacent self-report data for an
  older adult population. Even though the program is explicitly not a
  medical device, this data should be treated as private by default: no
  public-facing display of any individual student's data, and only that
  student's own facilitator/admin should see it (not other cohorts). The
  current mock respects this shape already; carry it into the real
  backend's access rules (Supabase row-level security scoped by
  cohort/role).

## 11. Assumptions I'm making that you should correct if wrong

- **Devices:** assuming students may use phones, tablets, or computers
  interchangeably, not a single assumed device — the app should keep
  working responsively across all three rather than being designed for
  one. (Not explicitly confirmed — flag if there's a reason to prioritize
  one.)
- **One cohort at a time for the facilitator in beta 1** — the facilitator
  UI already supports multiple cohorts, so this isn't a build constraint,
  just an assumption about beta 1's actual scale.
- **No offline requirement** — assuming students have internet access when
  using the app (consistent with it being a Zoom-based program already).

## 12. Rollout plan

See `deployment-and-hosting.md` for the staged plan (PIN-gated preview →
real accounts → PWA → app stores). This PRD's v1 scope (§6) corresponds to
completing that plan's **Stage 2** before the first real cohort — the PIN
gate in Stage 1 is fine for stakeholder preview, but not sufficient once
real students' check-in data is involved (see §10).

## 13. Remaining open items

§5, the auth approach in §6, and §7 are all confirmed — the PRD is approved
as written. What's still genuinely open, and doesn't block starting work:

1. **New target beta date** — "4–6 weeks from now" (late Oct–early Nov
   2026) is still a window, not a locked date. Worth picking an actual
   date once facilitator/cohort readiness is known.
2. **Assessment instrument — structure drafted (§7, `assessment-design.md`).**
   Still needs founder-supplied content: the song, the movement routine,
   review of the draft vocabulary/confidence-statement items, and what
   the video content should show. See `assessment-design.md` §7 for the
   full checklist.
3. Anything in §11 that turns out to be a wrong assumption.

---

*This document should be updated whenever a decision above gets made —
don't let it go stale the way the July 27 date did.*
