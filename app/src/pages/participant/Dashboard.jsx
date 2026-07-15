import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import ProgressRing from '../../components/ProgressRing';

/**
 * Home Dashboard: week progress ring, today's recommended activity, streak
 * counter, and the Identity Close of the week as a large centered
 * typographic moment (the signature design element).
 */

function computeStreak(progress, scores) {
  // Day streak: consecutive calendar days (ending today or yesterday) with
  // any activity (check-in or game).
  const days = new Set(
    [...progress.map((p) => p.completed_at), ...scores.map((s) => s.played_at)]
      .filter(Boolean)
      .map((iso) => new Date(iso).toDateString())
  );
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function Dashboard() {
  const { user, language, t } = useApp();
  const { loading, cohort, content, progress, scores } = useParticipantData();

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  const week = cohort?.current_week ?? 1;
  // Weekly activities: check-in, memory grid, flashcards, coloring (4 total).
  const weekScores = scores.filter((s) => s.week_number === week);
  const weekProgress = progress.filter((p) => p.week_number === week);
  const done =
    (weekProgress.length > 0 ? 1 : 0) +
    (weekScores.some((s) => s.game_type === 'memory_grid') ? 1 : 0) +
    (weekScores.some((s) => s.game_type === 'flashcards') ? 1 : 0);
  const total = 4;
  const percent = (done / total) * 100;
  const streak = computeStreak(progress, scores);

  const identityClose =
    language === 'es' ? content?.identity_close_es : content?.identity_close_en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">
          {t('helloName', { name: user.full_name.split(' ')[0] })}
        </h1>
        <p className="mt-1 text-xl text-body/80">
          {cohort?.name} · {t('weekLabel', { week })}
        </p>
      </div>

      {/* Identity Close — signature typographic moment */}
      <section
        aria-label={t('identityCloseLabel')}
        className="rounded-3xl border-2 border-gold/40 bg-gold-light px-6 py-12 text-center sm:py-16"
      >
        <p className="text-base font-bold uppercase tracking-[0.2em] text-gold">
          {t('identityCloseLabel')}
        </p>
        <blockquote className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-snug text-navy sm:text-5xl">
          “{identityClose ?? '—'}”
        </blockquote>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="flex flex-col items-center rounded-2xl bg-card p-6 shadow">
          <h2 className="text-xl font-bold text-navy">{t('weekProgress')}</h2>
          <div className="mt-4">
            <ProgressRing
              percent={percent}
              label={t('activitiesDone', { done, total })}
            />
          </div>
          <p className="mt-3 text-center text-lg">{t('activitiesDone', { done, total })}</p>
        </section>

        <section className="flex flex-col rounded-2xl bg-card p-6 shadow">
          <h2 className="text-xl font-bold text-navy">{t('todaysActivity')}</h2>
          <p className="mt-4 flex-1 text-lg">{t('playMemoryGrid')}</p>
          <Link
            to="/app/games"
            className="mt-4 inline-flex min-h-tap items-center justify-center rounded-xl bg-teal px-6 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('goToActivity')}
          </Link>
        </section>

        <section className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow">
          <h2 className="text-xl font-bold text-navy">{t('streak')}</h2>
          <p aria-hidden="true" className="mt-2 text-6xl font-extrabold text-gold">
            {streak}
          </p>
          <p className="mt-1 text-lg">{t('streakDays', { n: streak })}</p>
        </section>
      </div>
    </div>
  );
}
