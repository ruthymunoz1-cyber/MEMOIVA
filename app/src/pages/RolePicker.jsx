import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ROLE_HOME } from '../components/RequireRole';

/**
 * Login / role picker + language selector. No real auth backend exists yet,
 * so this screen signs you in as one of three demo accounts via the adapter.
 */

const DEMO_ROLES = [
  { userId: 'user-participant-1', role: 'participant', name: 'Maria Demo', labelKey: 'participant' },
  { userId: 'user-facilitator-1', role: 'facilitator', name: 'Teacher Demo', labelKey: 'facilitator' },
  { userId: 'user-admin-1', role: 'admin', name: 'Ruthy Demo', labelKey: 'admin' },
];

export default function RolePicker() {
  const { language, setLanguage, signIn, t } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-appbg px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-card p-8 shadow-lg">
        <h1 className="text-center text-4xl font-extrabold tracking-wide text-teal">MEMOIVA</h1>
        <p className="mt-1 text-center text-lg text-navy">{t('tagline')}</p>

        <h2 className="mt-6 text-2xl font-bold text-navy">{t('welcomeTitle')}</h2>
        <p className="mt-2 text-lg leading-relaxed">{t('welcomeBody')}</p>

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
      </div>
    </div>
  );
}
