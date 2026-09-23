/**
 * MEMOIVA Supabase data adapter — real backend for real cohorts.
 *
 * This is the live counterpart to mockAdapter.js, selected by
 * dataClient.js whenever VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are
 * set. Same exported function names and return shapes as mockAdapter.js
 * wherever both exist, so components never know which one is active.
 *
 * Auth model (see supabase/schema.sql and docs/app/PRD.md §6): no
 * self-serve signup. A facilitator/admin pre-creates a row in
 * public.users (email + role) before a person's first login. That person
 * then signs in via emailed magic link (sendMagicLink). A database
 * trigger links their auth account to the matching profile row by email
 * on first login. If no row was pre-created, the login still succeeds at
 * the auth layer but hasUnprovisionedSession() reports true — the UI
 * should show "ask your facilitator to add you" rather than crash.
 */

import { supabase } from './supabaseClient';

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Auth / session
// ---------------------------------------------------------------------------

/** Not supported in live mode — real accounts sign in via sendMagicLink. */
export async function signInAs() {
  throw new Error('signInAs is not available with a real backend — use sendMagicLink.');
}

/** Emails a one-time sign-in link. The person clicks it to return signed in. */
export async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
}

/** Current signed-in user's profile row, or null if not signed in. */
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .maybeSingle();
  if (error) throw error;
  return data; // null here means "signed in, but no profile" — see hasUnprovisionedSession
}

/**
 * True when there's a live Supabase auth session but no matching
 * public.users row — i.e. someone signed in whose account nobody set up
 * yet. Lets the UI show a clear message instead of silently bouncing them
 * back to the login screen.
 */
export async function hasUnprovisionedSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return false;
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', session.user.id)
    .maybeSingle();
  return !data;
}

/** Subscribe to sign-in/sign-out. Returns an unsubscribe function. */
export function onAuthChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => callback());
  return () => subscription.unsubscribe();
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function setPreferredLanguage(userId, lang) {
  const data = unwrap(
    await supabase
      .from('users')
      .update({ preferred_language: lang })
      .eq('id', userId)
      .select()
      .single()
  );
  // Demo behavior carried over intentionally: no per-cohort track flip here.
  // A real cohort's track is set once at cohort creation, not toggled by a
  // single student's language pick — revisit if that turns out to be wrong.
  return data;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUsers() {
  return unwrap(await supabase.from('users').select('*'));
}

export async function getUser(userId) {
  return unwrap(await supabase.from('users').select('*').eq('id', userId).maybeSingle());
}

// ---------------------------------------------------------------------------
// Cohorts
// ---------------------------------------------------------------------------

export async function getCohorts() {
  return unwrap(await supabase.from('cohorts').select('*'));
}

export async function getCohort(id) {
  return unwrap(await supabase.from('cohorts').select('*').eq('id', id).maybeSingle());
}

export async function getCohortsForFacilitator(facilitatorId) {
  return unwrap(
    await supabase.from('cohorts').select('*').eq('facilitator_id', facilitatorId)
  );
}

export async function getCohortForParticipant(participantId) {
  const link = unwrap(
    await supabase
      .from('cohort_participants')
      .select('cohort_id')
      .eq('participant_id', participantId)
      .maybeSingle()
  );
  if (!link) return null;
  return getCohort(link.cohort_id);
}

export async function getCohortParticipants(cohortId) {
  const links = unwrap(
    await supabase.from('cohort_participants').select('participant_id').eq('cohort_id', cohortId)
  );
  const ids = links.map((l) => l.participant_id);
  if (ids.length === 0) return [];
  return unwrap(await supabase.from('users').select('*').in('id', ids));
}

// ---------------------------------------------------------------------------
// Weekly content
// ---------------------------------------------------------------------------

export async function getWeeklyContent(cohortId, weekNumber) {
  return unwrap(
    await supabase
      .from('weekly_content')
      .select('*')
      .eq('cohort_id', cohortId)
      .eq('week_number', weekNumber)
      .maybeSingle()
  );
}

// ---------------------------------------------------------------------------
// Songs (catalog + weekly signature song)
// ---------------------------------------------------------------------------

/** Catalog songs for a UI language ('es' | 'esl'), signature songs first. */
export async function getSongs(language) {
  return unwrap(
    await supabase
      .from('songs')
      .select('*')
      .eq('language', language)
      .order('is_signature', { ascending: false })
  );
}

export async function getSong(id) {
  return unwrap(await supabase.from('songs').select('*').eq('id', id).maybeSingle());
}

// ---------------------------------------------------------------------------
// Participant progress / weekly check-in
// ---------------------------------------------------------------------------

export async function getParticipantProgress(participantId) {
  return unwrap(
    await supabase
      .from('participant_progress')
      .select('*')
      .eq('participant_id', participantId)
      .order('completed_at', { ascending: true })
  );
}

export async function getProgressForCohort(cohortId) {
  return unwrap(
    await supabase.from('participant_progress').select('*').eq('cohort_id', cohortId)
  );
}

export async function submitCheckIn({
  participantId,
  cohortId,
  weekNumber,
  session,
  confidence,
  memory,
}) {
  return unwrap(
    await supabase
      .from('participant_progress')
      .insert({
        participant_id: participantId,
        cohort_id: cohortId,
        week_number: weekNumber,
        session,
        check_in_confidence: confidence,
        check_in_memory: memory,
      })
      .select()
      .single()
  );
}

// ---------------------------------------------------------------------------
// Game scores
// ---------------------------------------------------------------------------

export async function getGameScores(participantId) {
  return unwrap(
    await supabase
      .from('game_scores')
      .select('*')
      .eq('participant_id', participantId)
      .order('played_at', { ascending: true })
  );
}

export async function getGameScoresForCohort(cohortId) {
  return unwrap(await supabase.from('game_scores').select('*').eq('cohort_id', cohortId));
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
  return unwrap(
    await supabase
      .from('game_scores')
      .insert({
        participant_id: participantId,
        cohort_id: cohortId,
        week_number: weekNumber,
        game_type: gameType,
        score,
        max_score: maxScore,
        duration_seconds: durationSeconds,
      })
      .select()
      .single()
  );
}

// ---------------------------------------------------------------------------
// Coloring saves
// ---------------------------------------------------------------------------

export async function getColoringProgress(participantId, weekNumber) {
  return unwrap(
    await supabase
      .from('coloring_saves')
      .select('*')
      .eq('participant_id', participantId)
      .eq('week_number', weekNumber)
      .maybeSingle()
  );
}

export async function saveColoringProgress({ participantId, weekNumber, imageData }) {
  return unwrap(
    await supabase
      .from('coloring_saves')
      .upsert(
        {
          participant_id: participantId,
          week_number: weekNumber,
          image_data: imageData,
          saved_at: new Date().toISOString(),
        },
        { onConflict: 'participant_id,week_number' }
      )
      .select()
      .single()
  );
}

// ---------------------------------------------------------------------------
// Facilitator notes
// ---------------------------------------------------------------------------

export async function getFacilitatorNote(participantId) {
  return unwrap(
    await supabase
      .from('facilitator_notes')
      .select('*')
      .eq('participant_id', participantId)
      .maybeSingle()
  );
}

export async function saveFacilitatorNote({ participantId, facilitatorId, note }) {
  return unwrap(
    await supabase
      .from('facilitator_notes')
      .upsert(
        {
          participant_id: participantId,
          facilitator_id: facilitatorId,
          note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'participant_id' }
      )
      .select()
      .single()
  );
}

// ---------------------------------------------------------------------------
// Not applicable with a real backend — see mockAdapter.js for the demo
// version. Never casually truncate a real cohort's data from the app.
// ---------------------------------------------------------------------------
export async function resetDemoData() {
  throw new Error('resetDemoData is not available with a real backend.');
}
