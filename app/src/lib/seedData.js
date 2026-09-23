/**
 * MEMOIVA mock seed data.
 *
 * Row shapes mirror the planned Supabase schema EXACTLY so the mock adapter in
 * dataClient.js can later be swapped for real Supabase queries with no changes
 * outside that file.
 *
 * Tables mirrored here:
 *   users, cohorts, cohort_participants, weekly_content,
 *   participant_progress, game_scores, coloring_saves
 */

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const SEED_USERS = [
  {
    id: 'user-participant-1',
    email: 'maria@demo.memoiva.com',
    role: 'participant',
    full_name: 'Maria Demo',
    preferred_language: 'es', // updated when the demo user picks a language
    created_at: daysAgo(30),
  },
  {
    id: 'user-facilitator-1',
    email: 'teacher@demo.memoiva.com',
    role: 'facilitator',
    full_name: 'Teacher Demo',
    preferred_language: 'esl',
    created_at: daysAgo(45),
  },
  {
    id: 'user-admin-1',
    email: 'ruthy@demo.memoiva.com',
    role: 'admin',
    full_name: 'Ruthy Demo',
    preferred_language: 'esl',
    created_at: daysAgo(60),
  },
  // Extra enrolled participants so the facilitator roster looks real.
  {
    id: 'user-participant-2',
    email: 'jose@demo.memoiva.com',
    role: 'participant',
    full_name: 'Jose Demo',
    preferred_language: 'es',
    created_at: daysAgo(28),
  },
  {
    id: 'user-participant-3',
    email: 'carmen@demo.memoiva.com',
    role: 'participant',
    full_name: 'Carmen Demo',
    preferred_language: 'es',
    created_at: daysAgo(27),
  },
];

export const SEED_COHORTS = [
  {
    id: 'cohort-1',
    name: 'Cohort 1 — Founding Members',
    track: 'esl', // alternates with the demo user's language pick (es <-> esl)
    level: 'beginner',
    block_number: 1,
    current_week: 1,
    facilitator_id: 'user-facilitator-1',
    start_date: daysAgo(14).slice(0, 10),
    end_date: null,
  },
];

export const SEED_COHORT_PARTICIPANTS = [
  { cohort_id: 'cohort-1', participant_id: 'user-participant-1', enrolled_at: daysAgo(14) },
  { cohort_id: 'cohort-1', participant_id: 'user-participant-2', enrolled_at: daysAgo(14) },
  { cohort_id: 'cohort-1', participant_id: 'user-participant-3', enrolled_at: daysAgo(13) },
];

export const SEED_WEEKLY_CONTENT = [
  {
    id: 'content-c1-w1',
    cohort_id: 'cohort-1',
    week_number: 1,
    track: 'esl',
    theme: 'Mi hogar / My Home',
    vocabulary: [
      { word: 'la casa', translation: 'house', pronunciation: 'lah KAH-sah' },
      { word: 'el sol', translation: 'sun', pronunciation: 'el SOHL' },
      { word: 'el árbol', translation: 'tree', pronunciation: 'el AR-bol' },
      { word: 'la flor', translation: 'flower', pronunciation: 'lah FLOR' },
      { word: 'la puerta', translation: 'door', pronunciation: 'lah PWAIR-tah' },
      { word: 'la ventana', translation: 'window', pronunciation: 'lah ven-TAH-nah' },
    ],
    identity_close_es: 'Cada semana, mi mente crece más fuerte.',
    identity_close_en: 'Every week, my mind grows stronger.',
    // Reserved slot for MEMOIVA's own signature song for this week — see
    // "songs every session" in project-brief.md. Not written/recorded yet;
    // see song-signature-w1 below and docs/app/song-library.md.
    signature_song_id: 'song-signature-w1',
  },
];

/**
 * Songs — two kinds, matching supabase/schema.sql's `songs` table:
 *   - is_signature: true  → MEMOIVA's own, one per week (reserved slot;
 *     content pending real production — see docs/app/song-library.md)
 *   - is_signature: false → browsable public-domain catalog, EN/ES,
 *     available anytime. The one example below uses real, unambiguously
 *     public-domain lyrics (published 1873, decades past any copyright
 *     term) purely to prove the line-by-line sync UI works — it is a
 *     placeholder, not a program content decision. audio_url is null for
 *     everything here: no recordings exist yet. start_seconds/end_seconds
 *     on the catalog example are illustrative pacing, not timed against a
 *     real recording (that can only happen once one exists).
 */
export const SEED_SONGS = [
  {
    id: 'song-signature-w1',
    title: '(Coming soon)',
    language: 'esl',
    is_signature: true,
    audio_url: null,
    lyrics: [],
    created_at: daysAgo(14),
  },
  {
    id: 'song-catalog-home-on-the-range',
    title: 'Home on the Range',
    language: 'esl',
    is_signature: false,
    audio_url: null,
    lyrics: [
      { text: 'Oh, give me a home where the buffalo roam,', start_seconds: 0, end_seconds: 4 },
      { text: 'Where the deer and the antelope play,', start_seconds: 4, end_seconds: 8 },
      { text: 'Where seldom is heard a discouraging word,', start_seconds: 8, end_seconds: 12 },
      { text: 'And the skies are not cloudy all day.', start_seconds: 12, end_seconds: 16 },
      { text: 'Home, home on the range,', start_seconds: 16, end_seconds: 20 },
      { text: 'Where the deer and the antelope play;', start_seconds: 20, end_seconds: 24 },
      { text: 'Where seldom is heard a discouraging word,', start_seconds: 24, end_seconds: 28 },
      { text: 'And the skies are not cloudy all day.', start_seconds: 28, end_seconds: 32 },
    ],
    created_at: daysAgo(14),
  },
  {
    id: 'song-catalog-cielito-lindo',
    title: 'Cielito Lindo',
    language: 'es',
    is_signature: false,
    audio_url: null,
    lyrics: [
      { text: 'Ay, ay, ay, ay,', start_seconds: 0, end_seconds: 3 },
      { text: 'canta y no llores,', start_seconds: 3, end_seconds: 6 },
      { text: 'porque cantando se alegran,', start_seconds: 6, end_seconds: 10 },
      { text: 'cielito lindo, los corazones.', start_seconds: 10, end_seconds: 15 },
    ],
    created_at: daysAgo(14),
  },
];

export const SEED_PARTICIPANT_PROGRESS = [
  {
    id: 'progress-1',
    participant_id: 'user-participant-1',
    cohort_id: 'cohort-1',
    week_number: 1,
    session: 'A',
    check_in_confidence: 4,
    check_in_memory: 3,
    completed_at: daysAgo(3),
  },
  {
    id: 'progress-2',
    participant_id: 'user-participant-2',
    cohort_id: 'cohort-1',
    week_number: 1,
    session: 'A',
    check_in_confidence: 3,
    check_in_memory: 3,
    completed_at: daysAgo(3),
  },
  {
    id: 'progress-3',
    participant_id: 'user-participant-3',
    cohort_id: 'cohort-1',
    week_number: 1,
    session: 'A',
    check_in_confidence: 5,
    check_in_memory: 4,
    completed_at: daysAgo(2),
  },
];

export const SEED_GAME_SCORES = [
  {
    id: 'score-1',
    participant_id: 'user-participant-1',
    cohort_id: 'cohort-1',
    week_number: 1,
    game_type: 'memory_grid',
    score: 3,
    max_score: 5,
    duration_seconds: 48,
    played_at: daysAgo(4),
  },
  {
    id: 'score-2',
    participant_id: 'user-participant-1',
    cohort_id: 'cohort-1',
    week_number: 1,
    game_type: 'memory_grid',
    score: 4,
    max_score: 5,
    duration_seconds: 41,
    played_at: daysAgo(3),
  },
  {
    id: 'score-3',
    participant_id: 'user-participant-1',
    cohort_id: 'cohort-1',
    week_number: 1,
    game_type: 'flashcards',
    score: 5,
    max_score: 6,
    duration_seconds: 95,
    played_at: daysAgo(2),
  },
  {
    id: 'score-4',
    participant_id: 'user-participant-1',
    cohort_id: 'cohort-1',
    week_number: 1,
    game_type: 'memory_grid',
    score: 5,
    max_score: 5,
    duration_seconds: 37,
    played_at: daysAgo(1),
  },
  {
    id: 'score-5',
    participant_id: 'user-participant-2',
    cohort_id: 'cohort-1',
    week_number: 1,
    game_type: 'memory_grid',
    score: 2,
    max_score: 5,
    duration_seconds: 55,
    played_at: daysAgo(2),
  },
];

export const SEED_COLORING_SAVES = [];

// Facilitator notes are not in the v1 schema list, but the Participant Detail
// screen needs an editable notes field. Kept as its own mock table so a real
// `facilitator_notes` table can back it later.
export const SEED_FACILITATOR_NOTES = [
  {
    id: 'note-1',
    participant_id: 'user-participant-1',
    facilitator_id: 'user-facilitator-1',
    note: 'Maria is very engaged in Session A. Encourage her to try the memory game twice a week.',
    updated_at: daysAgo(2),
  },
];
