import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';

/** This Week: Session A/B cards, vocabulary list, story summary placeholder. */
export default function ThisWeek() {
  const { t } = useApp();
  const { loading, cohort, content } = useParticipantData();

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{t('thisWeekTitle')}</h1>
        <p className="mt-1 text-xl text-body/80">
          {t('weekLabel', { week: cohort?.current_week ?? 1 })} · {t('theme')}:{' '}
          <span className="font-semibold text-teal">{content?.theme}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border-t-8 border-teal bg-card p-6 shadow">
          <h2 className="text-2xl font-bold text-navy">{t('sessionA')}</h2>
          <p className="mt-3 text-lg leading-relaxed">{t('sessionADesc')}</p>
        </section>
        <section className="rounded-2xl border-t-8 border-gold bg-card p-6 shadow">
          <h2 className="text-2xl font-bold text-navy">{t('sessionB')}</h2>
          <p className="mt-3 text-lg leading-relaxed">{t('sessionBDesc')}</p>
        </section>
      </div>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">{t('vocabListTitle')}</h2>
        <ul className="mt-4 divide-y divide-appbg">
          {(content?.vocabulary ?? []).map((v) => (
            <li key={v.word} className="flex flex-wrap items-baseline gap-x-4 py-3">
              <span className="text-xl font-bold text-teal">{v.word}</span>
              <span className="text-xl">{v.translation}</span>
              <span className="text-lg text-body/70">({v.pronunciation})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">{t('storyTitle')}</h2>
        <p className="mt-3 text-lg leading-relaxed">{t('storyPlaceholder')}</p>
      </section>
    </div>
  );
}
