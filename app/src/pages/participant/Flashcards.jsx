import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Vocabulary Practice — flashcards. Tap (or press Enter/Space) to flip
 * between the Spanish word and its English translation. Finishing a round
 * records a game_scores row via the adapter.
 */
export default function Flashcards() {
  const { user, t } = useApp();
  const { loading, cohort, content } = useParticipantData();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startedAt] = useState(() => Date.now());

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  const cards = content?.vocabulary ?? [];
  const card = cards[index];

  async function finishRound() {
    setFinished(true);
    await dataClient.saveGameScore({
      participantId: user.id,
      cohortId: cohort.id,
      weekNumber: cohort.current_week,
      gameType: 'flashcards',
      score: cards.length,
      maxScore: cards.length,
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
    });
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-navy">{t('flashcardsTitle')}</h1>
        <p className="rounded-2xl bg-teal-light p-8 text-2xl font-bold text-teal">
          {t('roundDone', { total: cards.length })}
        </p>
        <button
          type="button"
          onClick={restart}
          className="min-h-tap rounded-xl bg-teal px-8 text-xl font-bold text-white hover:bg-teal-dark"
        >
          {t('playAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-navy">{t('flashcardsTitle')}</h1>
        <p className="mt-1 text-lg text-body/80">{t('flashcardsHint')}</p>
        <p className="mt-1 text-lg font-semibold text-teal">
          {t('cardOf', { n: index + 1, total: cards.length })}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`${t('flashcardsHint')}. ${flipped ? card.translation : card.word}`}
        className="block h-72 w-full [perspective:1000px]"
        data-testid="flashcard"
      >
        <div
          className={`flip-card-inner relative h-full w-full ${flipped ? 'flipped' : ''}`}
        >
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-4 border-teal bg-card p-6 shadow-lg">
            <span className="text-5xl font-extrabold text-navy">{card.word}</span>
            <span className="mt-4 text-xl text-body/70">({card.pronunciation})</span>
          </div>
          <div className="flip-face flip-back absolute inset-0 flex items-center justify-center rounded-3xl border-4 border-gold bg-gold-light p-6 shadow-lg">
            <span className="text-5xl font-extrabold text-navy" data-testid="flashcard-back">
              {card.translation}
            </span>
          </div>
        </div>
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setFlipped(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={index === 0}
          className="min-h-tap flex-1 rounded-xl border-2 border-teal bg-white px-6 text-xl font-bold text-teal hover:bg-teal-light disabled:opacity-40"
        >
          {t('previous')}
        </button>
        {index < cards.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              setFlipped(false);
              setIndex((i) => i + 1);
            }}
            className="min-h-tap flex-1 rounded-xl bg-teal px-6 text-xl font-bold text-white hover:bg-teal-dark"
          >
            {t('next')}
          </button>
        ) : (
          <button
            type="button"
            onClick={finishRound}
            className="min-h-tap flex-1 rounded-xl bg-gold px-6 text-xl font-bold text-white hover:opacity-90"
          >
            {t('finishRound')}
          </button>
        )}
      </div>
    </div>
  );
}
