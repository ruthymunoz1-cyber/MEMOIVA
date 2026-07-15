import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';

/**
 * My Progress: week-by-week engagement summary + a lightweight inline SVG
 * bar chart of game scores over time (single series, brand teal — no
 * charting library).
 */

function ScoresChart({ scores, t }) {
  if (scores.length === 0) {
    return <p className="mt-4 text-lg text-body/70">{t('noScores')}</p>;
  }

  const W = 640;
  const H = 260;
  const pad = { top: 16, right: 16, bottom: 44, left: 52 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const barW = Math.min(36, (plotW / scores.length) * 0.6);
  const step = plotW / scores.length;

  const pct = (s) => (s.max_score ? Math.round((s.score / s.max_score) * 100) : 0);
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="mt-4 overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full min-w-[480px]"
        role="img"
        aria-label={t('scoresChartTitle')}
      >
        {/* recessive gridlines + y-axis labels */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = pad.top + plotH - (v / 100) * plotH;
          return (
            <g key={v}>
              <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} stroke="#E5E7EB" strokeWidth="1" />
              <text x={pad.left - 10} y={y + 5} textAnchor="end" fontSize="14" fill="#6B7280">
                {v}%
              </text>
            </g>
          );
        })}
        {/* bars: single series (teal), rounded data-ends, 2px+ gaps by layout */}
        {scores.map((s, i) => {
          const h = Math.max(2, (pct(s) / 100) * plotH);
          const x = pad.left + i * step + (step - barW) / 2;
          const y = pad.top + plotH - h;
          return (
            <g key={s.id}>
              <rect x={x} y={y} width={barW} height={h} rx="4" fill="#0E7C7B">
                <title>
                  {`${s.game_type === 'memory_grid' ? 'Memory Grid' : 'Flashcards'} — ${s.score}/${s.max_score} (${pct(s)}%) — ${fmtDate(s.played_at)}`}
                </title>
              </rect>
              <text
                x={x + barW / 2}
                y={H - pad.bottom + 20}
                textAnchor="middle"
                fontSize="13"
                fill="#6B7280"
              >
                {fmtDate(s.played_at)}
              </text>
            </g>
          );
        })}
        <line
          x1={pad.left}
          x2={W - pad.right}
          y1={pad.top + plotH}
          y2={pad.top + plotH}
          stroke="#9CA3AF"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export default function MyProgress() {
  const { t } = useApp();
  const { loading, cohort, progress, scores } = useParticipantData();

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  const currentWeek = cohort?.current_week ?? 1;
  const weeks = Array.from({ length: currentWeek }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-navy">{t('progressTitle')}</h1>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">{t('engagementTitle')}</h2>
        <ul className="mt-4 space-y-3">
          {weeks.map((w) => {
            const wScores = scores.filter((s) => s.week_number === w);
            const wCheckIns = progress.filter((p) => p.week_number === w);
            return (
              <li
                key={w}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-appbg px-5 py-4"
              >
                <span className="text-xl font-bold text-teal">{t('weekLabel', { week: w })}</span>
                <span className="text-lg">
                  {wScores.length} {t('gamesPlayed')}
                </span>
                <span className="text-lg">
                  {wCheckIns.length} {t('checkInsDone')}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">{t('scoresChartTitle')}</h2>
        <p className="mt-1 text-lg text-body/70">{t('scoresChartNote')}</p>
        <ScoresChart scores={scores} t={t} />
      </section>
    </div>
  );
}
