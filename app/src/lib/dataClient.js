/**
 * MEMOIVA data client — the SINGLE adapter for all data access.
 *
 * v1 ships a MOCK implementation backed by localStorage + seeded demo data
 * (no real Supabase project exists yet). Every function below is async and
 * mirrors the planned Supabase schema, so swapping in real Supabase calls
 * later means replacing ONLY the bodies in this file — same signatures,
 * same return shapes. No component touches localStorage directly.
 *
 * Real-Supabase swap sketch (kept here so the wiring is obvious later):
 *
 *   import { createClient } from '@supabase/supabase-js';
 *   const supabase = createClient(
 *     import.meta.env.VITE_SUPABASE_URL,
 *     import.meta.env.VITE_SUPABASE_ANON_KEY
 *   );
 *   // e.g. getCohort(id) becomes:
 *   //   const { data, error } = await supabase
 *   //     .from('cohorts').select('*').eq('id', id).single();
 */

import {
  SEED_USERS,
  SEED_COHORTS,
  SEED_COHORT_PARTICIPANTS,
  SEED_WEEKLY_CONTENT,
  SEED_PARTICIPANT_PROGRESS,
  SEED_GAME_SCORES,
  SEED_COLORING_SAVES,
  SEED_FACILITATOR_NOTES,
} from './seedData';

const STORE_KEY = 'memoiva_mock_db_v1';
const SESSION_KEY = 'memoiva_session_v1';

// ---------------------------------------------------------------------------
// Mock store (localStorage) — internal only. Nothing outside this file may
// read or write these keys.
// ---------------------------------------------------------------------------

function freshDb() {
  return {
    users: SEED_USERS,
    cohorts: SEED_COHORTS,
    cohort_participants: SEED_COHORT_PARTICIPANTS,
    weekly_content: SEED_WEEKLY_CONTENT,
    participant_progress: SEED_PARTICIPANT_PROGRESS,
    game_scores: SEED_GAME_SCORES,
    coloring_saves: SEED_COLORING_SAVES,
    facilitator_notes: SEED_FACILITATOR_NOTES,
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted store — reseed */
  }
  const db = freshDb();
  saveDb(db);
  return db;
}

function saveDb(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Simulate a small network latency so loading states are honest.
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Auth / session
// ---------------------------------------------------------------------------

/** Sign in as one of the demo users (mock auth). Returns the user row. */
export async function signInAs(userId) {
  await wait();
  const db = loadDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error(`Unknown demo user: ${userId}`);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return user;
}

/** Current signed-in user row, or null. */
export async function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const { userId } = JSON.parse(raw);
    const db = loadDb();
    return db.users.find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

export async function signOut() {
  await wait(20);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Persist the user's language pick ('es' | 'esl'). In the demo, the cohort's
 * track alternates to match the language the demo user picked.
 */
export async function setPreferredLanguage(userId, lang) {
  await wait(20);
  const db = loadDb();
  const user = db.users.find((u) => u.id === userId);
  if (user) user.preferred_language = lang;
  // Demo behavior: Cohort 1's track follows the demo participant's pick.
  const cohort = db.cohorts.find((c) => c.id === 'cohort-1');
  if (cohort) {
    cohort.track = lang;
    db.weekly_content
      .filter((w) => w.cohort_id === cohort.id)
      .forEach((w) => (w.track = lang));
  }
  saveDb(db);
  return user;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUsers() {
  await wait();
  return loadDb().users;
}

export async function getUser(userId) {
  await wait();
  return loadDb().users.find((u) => u.id === userId) ?? null;
}

// ---------------------------------------------------------------------------
// Cohorts
// ---------------------------------------------------------------------------

export async function getCohorts() {
  await wait();
  return loadDb().cohorts;
}

export async function getCohort(id) {
  await wait();
  return loadDb().cohorts.find((c) => c.id === id) ?? null;
}

export async function getCohortsForFacilitator(facilitatorId) {
  await wait();
  return loadDb().cohorts.filter((c) => c.facilitator_id === facilitatorId);
}

/** Cohort the participant is enrolled in (v1: one cohort per participant). */
export async function getCohortForParticipant(participantId) {
  await wait();
  const db = loadDb();
  const link = db.cohort_participants.find((cp) => cp.participant_id === participantId);
  if (!link) return null;
  return db.cohorts.find((c) => c.id === link.cohort_id) ?? null;
}

/** Roster: user rows of everyone enrolled in a cohort. */
export async function getCohortParticipants(cohortId) {
  await wait();
  const db = loadDb();
  const ids = db.cohort_participants
    .filter((cp) => cp.cohort_id === cohortId)
    .map((cp) => cp.participant_id);
  return db.users.filter((u) => ids.includes(u.id));
}

// ---------------------------------------------------------------------------
// Weekly content
// ---------------------------------------------------------------------------

export async function getWeeklyContent(cohortId, weekNumber) {
  await wait();
  return (
    loadDb().weekly_content.find(
      (w) => w.cohort_id === cohortId && w.week_number === weekNumber
    ) ?? null
  );
}

// ---------------------------------------------------------------------------
// Participant progress / weekly check-in
// ---------------------------------------------------------------------------

export async function getParticipantProgress(participantId) {
  await wait();
  return loadDb()
    .participant_progress.filter((p) => p.participant_id === participantId)
    .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at));
}

export async function getProgressForCohort(cohortId) {
  await wait();
  return loadDb().participant_progress.filter((p) => p.cohort_id === cohortId);
}

/**
 * Weekly check-in: two 1-5 scales (confidence, memory).
 * Writes a participant_progress row.
 */
export async function submitCheckIn({
  participantId,
  cohortId,
  weekNumber,
  session,
  confidence,
  memory,
}) {
  await wait();
  const db = loadDb();
  const row = {
    id: uid('progress'),
    participant_id: participantId,
    cohort_id: cohortId,
    week_number: weekNumber,
    session,
    check_in_confidence: confidence,
    check_in_memory: memory,
    completed_at: new Date().toISOString(),
  };
  db.participant_progress.push(row);
  saveDb(db);
  return row;
}

// ---------------------------------------------------------------------------
// Game scores
// ---------------------------------------------------------------------------

export async function getGameScores(participantId) {
  await wait();
  return loadDb()
    .game_scores.filter((g) => g.participant_id === participantId)
    .sort((a, b) => new Date(a.played_at) - new Date(b.played_at));
}

export async function getGameScoresForCohort(cohortId) {
  await wait();
  return loadDb().game_scores.filter((g) => g.cohort_id === cohortId);
}

export async function saveGameScore({
  participantId,
  cohortId,
  weekNumber,
  gameType,
  score,
  maxScore,
  durationSeconds,
}) {
  await wait();
  const db = loadDb();
  const row = {
    id: uid('score'),
    participant_id: participantId,
    cohort_id: cohortId,
    week_number: weekNumber,
    game_type: gameType,
    score,
    max_score: maxScore,
    duration_seconds: durationSeconds,
    played_at: new Date().toISOString(),
  };
  db.game_scores.push(row);
  saveDb(db);
  return row;
}

// ---------------------------------------------------------------------------
// Coloring saves (v1: localStorage-only persistence is correct)
// ---------------------------------------------------------------------------

export async function getColoringProgress(participantId, weekNumber) {
  await wait();
  return (
    loadDb().coloring_saves.find(
      (c) => c.participant_id === participantId && c.week_number === weekNumber
    ) ?? null
  );
}

/** image_data: JSON-serializable fill state ({ regionId: hexColor }). */
export async function saveColoringProgress({ participantId, weekNumber, imageData }) {
  await wait();
  const db = loadDb();
  const existing = db.coloring_saves.find(
    (c) => c.participant_id === participantId && c.week_number === weekNumber
  );
  if (existing) {
    existing.image_data = imageData;
    existing.saved_at = new Date().toISOString();
    saveDb(db);
    return existing;
  }
  const row = {
    id: uid('coloring'),
    participant_id: participantId,
    week_number: weekNumber,
    image_data: imageData,
    saved_at: new Date().toISOString(),
  };
  db.coloring_saves.push(row);
  saveDb(db);
  return row;
}

// ---------------------------------------------------------------------------
// Facilitator notes
// ---------------------------------------------------------------------------

export async function getFacilitatorNote(participantId) {
  await wait();
  return (
    loadDb().facilitator_notes.find((n) => n.participant_id === participantId) ?? null
  );
}

export async function saveFacilitatorNote({ participantId, facilitatorId, note }) {
  await wait();
  const db = loadDb();
  const existing = db.facilitator_notes.find((n) => n.participant_id === participantId);
  if (existing) {
    existing.note = note;
    existing.facilitator_id = facilitatorId;
    existing.updated_at = new Date().toISOString();
    saveDb(db);
    return existing;
  }
  const row = {
    id: uid('note'),
    participant_id: participantId,
    facilitator_id: facilitatorId,
    note,
    updated_at: new Date().toISOString(),
  };
  db.facilitator_notes.push(row);
  saveDb(db);
  return row;
}

// ---------------------------------------------------------------------------
// Dev helper: reset the demo database (not surfaced in participant UI).
// ---------------------------------------------------------------------------

export async function resetDemoData() {
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(SESSION_KEY);
  loadDb();
}
