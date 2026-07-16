# MEMOIVA Web App — Architecture & Build Specification
Version 1.0 · RAMP Linguistic Society · SDVOSB · WOSB · Confidential

*This is the original pre-build spec Ruthy wrote/commissioned before the v1 app existed. It's kept here verbatim for reference — see `app-architecture.md` in this same folder for how v1 was actually built, which supersedes some details below (e.g. v1 shipped a localStorage mock instead of live Supabase, per the phased rollout in `deployment-and-hosting.md`).*

## 1. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React (JSX) | Single codebase, all browsers/devices, fast iteration |
| Styling | Tailwind CSS | Responsive, mobile-first, accessibility-ready |
| Backend / Auth / DB | Supabase | Free tier (50k MAU), handles auth + Postgres + storage |
| Hosting | Vercel | Free tier, one-click deploy from GitHub, HTTPS automatic |
| Coloring Engine | Canvas API (HTML5) | Browser-native, touch + mouse support, no library needed |
| Games | Custom React components | Vocabulary games: simple state machines. Cognitive: canvas-based |

*(Hosting note: the actual deployment decision was later changed to Netlify-only, serving the app at `memoiva.com/app` from the same repo as the marketing site — see `deployment-and-hosting.md`.)*

## 2. User Roles

| Role | What They See | Key Permissions |
|---|---|---|
| Participant | Personal dashboard, weekly content, games, coloring, workbook, own progress | Complete activities, save coloring, submit check-ins, view own history |
| Facilitator | Their cohort(s): roster, engagement, check-in scores, assessment results | Monitor cohort, download materials, view individual participant data, record assessment scores |
| Admin (Ruthy) | Everything — all cohorts, all languages, all tracks, all data | Full access: manage users, cohorts, content, facilitators, global analytics |

## 3. Database Schema (Supabase / Postgres)

### 3.1 Core Tables
```
users
  id (uuid, primary key) | email | role: participant | facilitator | admin
  full_name | preferred_language: es | esl | created_at
cohorts
  id (uuid) | name | track: es | esl | level: beginner | intermediate | advanced
  block_number | current_week (1-8) | facilitator_id | start_date | end_date
cohort_participants
  cohort_id | participant_id | enrolled_at
weekly_content
  id | cohort_id | week_number | track | theme
  vocabulary (jsonb: [{word, translation, pronunciation}])
  identity_close_es | identity_close_en
```

### 3.2 Activity Tables
```
participant_progress
  id | participant_id | cohort_id | week_number | session: A | B
  check_in_confidence (1-5) | check_in_memory (1-5) | completed_at
game_scores
  id | participant_id | cohort_id | week_number
  game_type: vocabulary_match | flashcard | fill_blank | word_scramble |
             memory_speed | attention | working_memory
  score | max_score | duration_seconds | played_at
coloring_saves
  id | participant_id | week_number
  image_data (base64 or Supabase Storage URL) | saved_at
assessment_scores
  id | participant_id | cohort_id | administration: pre | post
  week_number | scores (jsonb: {item_1: 1, item_2: 0, ...})
  total_score | administered_at | notes (facilitator qualitative)
```

## 4. App Screens — Complete Map

### 4.1 Participant Portal
| Screen | Description |
|---|---|
| Login / Onboarding | Email + password, language selector (EN/ES), first-time welcome flow |
| Home Dashboard | Week progress ring, today's recommended activity, streak counter, Identity Close of the week (large typographic centerpiece) |
| This Week | Session A and B content cards, vocabulary list, story summary, download workbook + coloring page ZIP |
| Vocabulary Practice | 4 games rotating by day: Flashcards (Mon), Match Pairs (Tue), Fill in the Blank (Wed), Word Scramble (Thu) |
| Brain Health Games | 3 cognitive games: Memory Grid (working memory), Speed Sort (processing speed + attention), Sequence Recall (sequential memory) |
| Coloring Studio | Full touch/click coloring tool, color palette (large swatches), fill-by-tap, save + download |
| My Progress | Week-by-week engagement, game scores over time, confidence/memory self-rating chart |
| Weekly Check-In | Digital version of the workbook's 1-5 confidence + memory self-rating, submitted to facilitator dashboard |

### 4.2 Facilitator Dashboard
| Screen | Description |
|---|---|
| My Cohorts | List of active cohorts, current week, quick engagement stats |
| Cohort View | Participant roster, this week's engagement (who logged in, completed check-in, played games) |
| Participant Detail | Individual participant's full history: check-ins, game scores, session completion, notes field |
| Assessment Manager | Administer + record pre/post assessment scores, view pre vs. post comparison per participant |
| Materials Hub | Download any week's ZIP (workbook + coloring pages) for any track/language |
| Reports | Cohort-level summary: avg check-in scores, game engagement, assessment pre/post delta |

### 4.3 Admin Panel
| Screen | Description |
|---|---|
| All Cohorts | Global view across all cohorts, all languages, all facilitators |
| User Management | Add/remove users, assign roles, reset passwords |
| Content Management | Edit weekly vocabulary, themes, identity closes per week/track |
| Analytics | Program-wide engagement, retention, assessment outcomes across all cohorts |
| Facilitator Management | Assign facilitators to cohorts, view facilitator activity |

## 5. v1 Feature Set

### 5.1 IN v1 — Build First
- Auth: login, role-based routing (participant / facilitator / admin)
- Participant home dashboard with Identity Close centerpiece
- This Week screen with vocabulary list and story summary
- Flashcard vocabulary game (most important, builds daily habit)
- Memory Grid cognitive game (simplest to build, strongest research basis for this population)
- Coloring Studio with 1 demo coloring page (Week 1 scene, SVG-based)
- Weekly check-in (confidence + memory self-ratings, written to database)
- Basic facilitator dashboard: cohort view + participant list + check-in scores
- Admin view: all cohorts overview
- Both languages: ES and ESL tracks, content switchable per participant preference
- Supabase: all tables created + auth working + basic read/write wired in

**Actual v1 build note:** everything above shipped except live Supabase — v1 runs on a localStorage mock with the identical schema shapes, by design, so the founder could demo all three roles immediately without first setting up a database. See `program-state.md` for the current, accurate built/mocked/not-started breakdown.

### 5.2 DEFERRED to v1.1
- Full game suite: Match Pairs, Fill in the Blank, Word Scramble, Speed Sort, Sequence Recall
- Progress charts and history view (participant)
- Assessment Manager (pre/post scoring and comparison)
- Materials Hub and ZIP download
- Full report builder for facilitators
- Push/email notifications between sessions
- Coloring saves to Supabase Storage (v1 saves to localStorage only)
- Content management UI (v1 content is hardcoded from Block 1 vocabulary)

## 6. Design Direction

### 6.1 Color Palette
| Role | Hex | Usage |
|---|---|---|
| Primary / Teal | #0E7C7B | Navigation, primary buttons, progress rings, active states |
| Dark / Navy | #1A2B4C | Headings, high-emphasis text, admin elements |
| Gold Accent | #B8860B | Identity Close highlight, milestone moments, streak counters |
| Background | #F8F9FA | App background — warmer than stark white, easier on older eyes |
| Card Surface | #FFFFFF | Content cards, game areas, coloring studio |
| Body Text | #1A1A2E | All body text — near-black for maximum contrast |

### 6.2 Accessibility Standards (Non-Negotiable for This Population)
- Minimum body font size: 18px throughout the participant portal
- Minimum tap target size: 48px height (WCAG AA for motor accessibility)
- Color contrast: WCAG AA minimum, AAA where possible
- No small print anywhere in participant-facing UI
- Coloring palette: large swatches (minimum 48x48px), spaced for thick-finger accuracy
- Reduced motion respected via `prefers-reduced-motion` CSS media query

### 6.3 Signature Design Element
The weekly Identity Close appears on the home dashboard as a large, full-width typographic centerpiece — the program's emotional and cognitive core made visually prominent, not buried in a card. This single element should be the most memorable thing on the screen when a participant opens the app each day.

## 7. Supabase Setup (when ready to go live with real accounts)

1. Go to supabase.com and sign up for a free account.
2. Click "New Project." Name it: `memoiva-app`
3. Choose region: US East (closest to West Palm Beach, FL)
4. Set a strong database password. Save it somewhere safe.
5. Wait ~2 minutes for the project to provision.
6. Go to Settings → API in the left sidebar.
7. Copy and save TWO values: (1) Project URL, (2) anon/public key.
8. Do NOT create any tables manually — the schema in Section 3 gets scripted in once these credentials are handed over.
