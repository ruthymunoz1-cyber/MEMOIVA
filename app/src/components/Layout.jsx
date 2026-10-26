import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Shared shell: teal top bar with brand, per-role nav, language toggle and
 * sign-out. Nav links meet the 48px tap-target minimum.
 */

function LangToggle() {
  const { language, setLanguage } = useApp();
  const btn = (code, label) => (
    <button
      type="button"
      onClick={() => setLanguage(code)}
      aria-pressed={language === code}
      className={`min-h-tap min-w-tap rounded-lg px-3 text-lg font-semibold ${
        language === code
          ? 'bg-white text-teal'
          : 'bg-teal-dark text-white hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="flex gap-1 rounded-xl bg-teal-dark p-1" role="group" aria-label="Language">
      {btn('esl', 'EN')}
      {btn('es', 'ES')}
    </div>
  );
}

export default function Layout({ nav, children }) {
  const { user, signOut, t } = useApp();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-appbg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-navy"
      >
        Skip to content
      </a>
      <header className="bg-teal text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <div className="font-display text-2xl tracking-[0.12em] text-white">
              MEMOIVA CIRCLE<sup className="ml-0.5 text-xs font-sans tracking-normal text-white/70">™</sup>
            </div>
            <div className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-gold-accent">
              {t('flagship')}
            </div>
            {user && <div className="text-base text-white/90">{user.full_name}</div>}
          </div>
          <LangToggle />
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-tap rounded-lg bg-teal-dark px-4 text-lg font-semibold hover:bg-white/20"
          >
            {t('signOut')}
          </button>
        </div>
        <nav aria-label="Main" className="border-t border-white/20">
          <ul className="mx-auto flex max-w-6xl flex-wrap px-2">
            {nav.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `block min-h-tap px-4 py-3 text-lg font-semibold ${
                      isActive
                        ? 'border-b-4 border-gold bg-teal-dark text-white'
                        : 'text-white/90 hover:bg-teal-dark hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-8">
        <p className="text-sm leading-relaxed text-body/60">{t('disclaimer')}</p>
      </footer>
    </div>
  );
}
