/**
 * Supabase client — created only when credentials are present.
 *
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example) to
 * point the app at a real Supabase project. Until both are set,
 * isSupabaseConfigured is false and dataClient.js falls back to the mock
 * adapter — nothing here breaks local dev without a project.
 */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
