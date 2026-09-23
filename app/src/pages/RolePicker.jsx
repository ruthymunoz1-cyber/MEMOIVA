import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ROLE_HOME } from '../components/RequireRole';
import * as dataClient from '../lib/dataClient';

/**
 * Login / role picker + language selector.
 *
 * Two modes, chosen automatically by whether a Supabase project is
 * configured (see dataClient.js / supabaseClient.js):
 *   - Real mode: an email + "send login link" form (magic-link auth).
 *   - Demo mode (no Supabase project set up yet): pick one of three demo
 *     accounts directly, same as v1 shipped with.
 */

const DEMO_ROLES = [
  { userId: 'user-participant-1', role: 'participant', name: 'Maria Demo', labelKey: 'participant' },
  { userId: 'user-facilitator-1', role: 'facilitator', name: 'Teacher Demo', labelKey: 'facilitator' },
  { userId: 'user-admin-1', role: 'admin', name: 'Ruthy Demo', labelKey: 'admin' },
];

export default function RolePicker() {
  const { user, ready, language, setLanguage, signIn, t } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [linkStatus, setLinkStatus] = useState(null); // null | 'sent' | 'error'
  const [noAccount, setNoAccount] = useState(false);

  // Already signed in (e.g. returned from clicking the magic link) — go
  // straight to that role's home instead of showing the login screen again.
  useEffect(() => {
    if (ready && user) navigate(ROLE_HOME[user.role] ?? '/', { replace: true });
  }, [ready, user, navigate]);

  // A magic link can succeed at the auth layer for an email nobody
  // provisioned yet. Surface that clearly instead of silently looping.
  useEffect(() => {
    if (!dataClient.isSupabaseConfigured || !ready || user) return;
    dataClient.hasUnprovisionedSession().then(setNoAccount);
  }, [ready, user]);

  async function pick(entry) {
    if (busy) return;
    setBusy(true);
    try {
      await signIn(entry.userId);
      navigate(ROLE_HOME[entry.role]);
    } finally {
      setBusy(false);
    }
  }

  async function submitEmail(e) {
    e.preventDefault();
    if (busy || !email.trim()) return;
    setBusy(true);
    setLinkStatus(null);
    try {
      await dataClient.sendMagicLink(email.trim());
      setLinkStatus('sent');
    } catch {
      setLinkStatus('error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-appbg px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-card p-8 shadow-lg">
        <h1 className="text-center text-4xl font-extrabold tracking-wide text-teal">MEMOIVA</h1>
        <p className="mt-1 text-center text-lg text-navy">{t('tagline')}</p>

        <h2 className="mt-6 text-2xl font-bold text-navy">{t('welcomeTitle')}</h2>
        <p className="mt-2 text-lg leading-relaxed">
          {t(dataClient.isSupabaseConfigured ? 'welcomeBodyLive' : 'welcomeBody')}
        </p>

        <fieldset className="mt-8">
          <legend className="text-xl font-bold text-navy">{t('chooseLanguage')}</legend>
          <div className="mt-3 flex gap-3" role="group">
            {[
              { code: 'esl', label: 'English' },
              { code: 'es', label: 'Español' },
            ].map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
                className={`min-h-tap flex-1 rounded-xl border-2 px-4 text-xl font-semibold ${
                  language === code
                    ? 'border-teal bg-teal text-white'
                    : 'border-teal bg-white text-teal hover:bg-teal-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        {dataClient.isSupabaseConfigured ? (
          <fieldset className="mt-8">
            <legend className="text-xl font-bold text-navy">{t('signInTitle')}</legend>
            {noAccount && (
              <p className="mt-3 rounded-xl border-2 border-gold bg-gold-light/20 px-4 py-3 text-lg text-navy">
                {t('noAccountFound')}
              </p>
            )}
            <form className="mt-3 flex flex-col gap-3" onSubmit={submitEmail}>
              <label className="text-lg font-semibold text-navy" htmlFor="email">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="min-h-tap rounded-xl border-2 border-teal px-4 text-xl text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-teal-light"
              />
              <button
                type="submit"
                disabled={busy}
                className="min-h-tap rounded-xl bg-teal px-4 text-xl font-semibold text-white hover:bg-teal/90 disabled:opacity-60"
              >
                {busy ? t('sendingLoginLink') : t('sendLoginLink')}
              </button>
              {linkStatus === 'sent' && (
                <p className="text-lg text-teal" role="status">
                  {t('loginLinkSent', { email })}
                </p>
              )}
              {linkStatus === 'error' && (
                <p className="text-lg text-red-700" role="alert">
                  {t('loginLinkError')}
                </p>
              )}
            </form>
          </fieldset>
        ) : (
        <fieldset className="mt-8">
          <legend className="text-xl font-bold text-navy">{t('chooseRole')}</legend>
          <div className="mt-3 flex flex-col gap-3">
            {DEMO_ROLES.map((entry) => (
              <button
                key={entry.userId}
                type="button"
                disabled={busy}
                onClick={() => pick(entry)}
                className="flex min-h-[64px] items-center justify-between rounded-xl border-2 border-teal bg-white px-5 py-3 text-left hover:bg-teal-light disabled:opacity-60"
              >
                <span>
                  <span className="block text-xl font-bold text-navy">{t(entry.labelKey)}</span>
                  <span className="block text-lg text-body/70">{entry.name}</span>
                </span>
                <span aria-hidden="true" className="text-2xl font-bold text-teal">
                  →
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        )}
      </div>
    </div>
  );
}
