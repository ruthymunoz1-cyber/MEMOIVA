import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as dataClient from '../lib/dataClient';
import { STRINGS, fmt } from '../lib/i18n';

/**
 * App-wide session + language state. All data access goes through the
 * dataClient adapter — this context never touches localStorage itself.
 */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  // 'esl' = English UI, 'es' = Spanish UI (matches schema language codes)
  const [language, setLanguageState] = useState('esl');

  useEffect(() => {
    let alive = true;
    dataClient.getCurrentUser().then((u) => {
      if (!alive) return;
      setUser(u);
      if (u?.preferred_language) setLanguageState(u.preferred_language);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(
    async (userId) => {
      const u = await dataClient.signInAs(userId);
      await dataClient.setPreferredLanguage(u.id, language);
      setUser({ ...u, preferred_language: language });
      return u;
    },
    [language]
  );

  const signOut = useCallback(async () => {
    await dataClient.signOut();
    setUser(null);
  }, []);

  const setLanguage = useCallback(
    async (lang) => {
      setLanguageState(lang);
      if (user) {
        await dataClient.setPreferredLanguage(user.id, lang);
        setUser((u) => (u ? { ...u, preferred_language: lang } : u));
      }
    },
    [user]
  );

  const t = useCallback(
    (key, vars) => {
      const table = STRINGS[language] ?? STRINGS.esl;
      const raw = table[key] ?? STRINGS.esl[key] ?? key;
      return vars ? fmt(raw, vars) : raw;
    },
    [language]
  );

  return (
    <AppContext.Provider value={{ user, ready, language, setLanguage, signIn, signOut, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
