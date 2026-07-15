import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Brain Health Games — Memory Grid (the only cognitive game in v1).
 * A pattern of highlighted cells shows briefly, hides, and the player
 * reproduces it by tapping. Score = pattern cells correctly recalled.
 */

const GRID_SIZE = 4; // 4x4
const PATTERN_COUNT = 5;
const SHOW_MS = 2500;

function randomPattern() {
  const cells = new Set();
  while (cells.size < PATTERN_COUNT) {
    cells.add(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
  }
  return cells;
}

export default function MemoryGrid() {
  const { user, t } = useApp();
  const { loading, cohort } = useParticipantData();
  const [phase, setPhase] = useState('idle'); // idle | showing | input | result
  const [pattern, setPattern] = useState(() => new Set());
  const [picks, setPicks] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  function start() {
    setPattern(randomPattern());
    setPicks(new Set());
    setResult(null);
    setPhase('showing');
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => setPhase('input'), SHOW_MS);
  }

  function toggleCell(i) {
    if (phase !== 'input') return;
    setPicks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function check() {
    const correct = [...picks].filter((i) => pattern.has(i)).length;
    const res = { score: correct, max: PATTERN_COUNT };
    setResult(res);
    setPhase('result');
    await dataClient.saveGameScore({
      participantId: user.id,
      cohortId: cohort.id,
      weekNumber: cohort.current_week,
      gameType: 'memory_grid',
      score: res.score,
      maxScore: res.max,
      durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
    });
  }

  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  function cellClasses(i) {
    if (phase === 'showing' && pattern.has(i)) return 'bg-teal border-teal';
    if (phase === 'input' && picks.has(i)) return 'bg-navy border-navy';
    if (phase === 'result') {
      if (pattern.has(i) && picks.has(i)) return 'bg-teal border-teal';
      if (pattern.has(i)) return 'bg-gold-light border-gold';
      if (picks.has(i)) return 'bg-navy/30 border-navy/40';
    }
    return 'bg-white border-teal/40 hover:bg-teal-light';
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{t('memoryGridTitle')}</h1>
        <p className="mt-2 text-lg text-body/80">{t('memoryGridHow')}</p>
      </div>

      <p aria-live="polite" className="min-h-[2rem] text-xl font-bold text-teal">
        {phase === 'showing' && t('watchPattern')}
        {phase === 'input' && t('yourTurn')}
        {phase === 'result' && result && (
          <>
            {t('youGot', { score: result.score, max: result.max })}{' '}
            <span className="text-body/70">{t('scoreSaved')}</span>
          </>
        )}
      </p>

      <div
        role="grid"
        aria-label={t('memoryGridTitle')}
        className="mx-auto grid w-fit grid-cols-4 gap-2"
        data-testid="memory-grid"
      >
        {cells.map((i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            aria-pressed={picks.has(i)}
            aria-label={`Cell ${i + 1}`}
            disabled={phase !== 'input'}
            onClick={() => toggleCell(i)}
            className={`h-16 w-16 rounded-xl border-2 sm:h-20 sm:w-20 ${cellClasses(i)}`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-3">
        {(phase === 'idle' || phase === 'result') && (
          <button
            type="button"
            onClick={start}
            className="min-h-tap rounded-xl bg-teal px-8 text-xl font-bold text-white hover:bg-teal-dark"
            data-testid="memory-start"
          >
            {phase === 'idle' ? t('startGame') : t('tryAgain')}
          </button>
        )}
        {phase === 'input' && (
          <button
            type="button"
            onClick={check}
            className="min-h-tap rounded-xl bg-gold px-8 text-xl font-bold text-white hover:opacity-90"
            data-testid="memory-check"
          >
            {t('checkAnswer')}
          </button>
        )}
      </div>
    </div>
  );
}
