import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Weekly Check-In: two 1-5 rating scales (confidence, memory). Big 48px+
 * radio-style buttons; submit writes a participant_progress row via the
 * adapter.
 */

function Scale({ legend, value, onChange, t, testId }) {
  return (
    <fieldset className="rounded-2xl bg-card p-6 shadow">
      <legend className="float-left mb-4 w-full text-xl font-bold text-navy">{legend}</legend>
      <div className="flex items-center justify-between gap-2" role="radiogroup" aria-label={legend}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            data-testid={`${testId}-${n}`}
            className={`h-16 w-16 rounded-full border-4 text-2xl font-extrabold ${
              value === n
                ? 'border-teal bg-teal text-white'
                : 'border-teal/50 bg-white text-navy hover:bg-teal-light'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-lg text-body/70">
        <span>{t('scaleLow')}</span>
        <span>{t('scaleHigh')}</span>
      </div>
    </fieldset>
  );
}

export default function CheckIn() {
  const { user, t } = useApp();
  const { loading, cohort } = useParticipantData();
  const [confidence, setConfidence] = useState(null);
  const [memory, setMemory] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  async function submit() {
    if (confidence == null || memory == null || busy) return;
    setBusy(true);
    try {
      await dataClient.submitCheckIn({
        participantId: user.id,
        cohortId: cohort.id,
        weekNumber: cohort.current_week,
        session: 'B',
        confidence,
        memory,
      });
      setSubmitted(true);
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-navy">{t('checkInTitle')}</h1>
        <p
          className="rounded-2xl bg-teal-light p-8 text-2xl font-bold text-teal"
          data-testid="checkin-thanks"
        >
          {t('checkInThanks')}
        </p>
        <Link
          to="/app"
          className="inline-flex min-h-tap items-center justify-center rounded-xl bg-teal px-8 text-xl font-bold text-white hover:bg-teal-dark"
        >
          {t('backHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-navy">{t('checkInTitle')}</h1>
        <p className="mt-2 text-lg text-body/80">{t('checkInIntro')}</p>
      </div>

      <Scale
        legend={t('confidenceQ')}
        value={confidence}
        onChange={setConfidence}
        t={t}
        testId="confidence"
      />
      <Scale legend={t('memoryQ')} value={memory} onChange={setMemory} t={t} testId="memory" />

      <button
        type="button"
        onClick={submit}
        disabled={confidence == null || memory == null || busy}
        data-testid="checkin-submit"
        className="min-h-[56px] w-full rounded-xl bg-teal px-8 text-2xl font-bold text-white hover:bg-teal-dark disabled:opacity-40"
      >
        {t('submit')}
      </button>
    </div>
  );
}
