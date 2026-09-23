/**
 * MEMOIVA data client — the SINGLE entry point for all data access.
 *
 * Dispatches to one of two adapters with matching function signatures:
 *   - supabaseAdapter.js — real backend, used once VITE_SUPABASE_URL and
 *     VITE_SUPABASE_ANON_KEY are set (see .env.example, supabase/schema.sql)
 *   - mockAdapter.js — localStorage + seeded demo data, used otherwise
 *
 * No component or page should import either adapter directly, or touch
 * localStorage/Supabase directly — always come through here, so swapping
 * backends never touches component code.
 */

import { isSupabaseConfigured } from './supabaseClient';
import * as mockAdapter from './mockAdapter';
import * as supabaseAdapter from './supabaseAdapter';

const adapter = isSupabaseConfigured ? supabaseAdapter : mockAdapter;

export { isSupabaseConfigured };

export const signInAs = adapter.signInAs;
export const sendMagicLink = adapter.sendMagicLink;
export const getCurrentUser = adapter.getCurrentUser;
export const hasUnprovisionedSession = adapter.hasUnprovisionedSession;
export const onAuthChange = adapter.onAuthChange;
export const signOut = adapter.signOut;
export const setPreferredLanguage = adapter.setPreferredLanguage;

export const getUsers = adapter.getUsers;
export const getUser = adapter.getUser;

export const getCohorts = adapter.getCohorts;
export const getCohort = adapter.getCohort;
export const getCohortsForFacilitator = adapter.getCohortsForFacilitator;
export const getCohortForParticipant = adapter.getCohortForParticipant;
export const getCohortParticipants = adapter.getCohortParticipants;

export const getWeeklyContent = adapter.getWeeklyContent;

export const getParticipantProgress = adapter.getParticipantProgress;
export const getProgressForCohort = adapter.getProgressForCohort;
export const submitCheckIn = adapter.submitCheckIn;

export const getGameScores = adapter.getGameScores;
export const getGameScoresForCohort = adapter.getGameScoresForCohort;
export const saveGameScore = adapter.saveGameScore;

export const getColoringProgress = adapter.getColoringProgress;
export const saveColoringProgress = adapter.saveColoringProgress;

export const getFacilitatorNote = adapter.getFacilitatorNote;
export const saveFacilitatorNote = adapter.saveFacilitatorNote;

// Mock-only dev helper — not surfaced in participant UI, throws in live mode.
export const resetDemoData = adapter.resetDemoData;
