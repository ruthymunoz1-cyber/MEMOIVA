import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import useParticipantData from '../../lib/useParticipantData';
import * as dataClient from '../../lib/dataClient';

/**
 * Piano — teaches piano entirely inside the app via an on-screen,
 * color-coded keyboard (tap/click, no physical instrument or MIDI
 * needed). Colors follow the widely-used rainbow-by-note-name convention
 * from music education generally (the same scheme used by Boomwhackers
 * and similar color-note teaching tools) — not modeled on any single
 * proprietary course. See docs/app/piano-lessons.md for the full design
 * note and why a specific "Piano by Pictures" / Stephen Ridley source
 * wasn't used.
 */

// Rainbow-by-note-name convention — one full octave from middle C.
const NOTES = [
  { name: 'C', freq: 261.63, color: '#E4423F', textColor: '#FFFFFF' }, // red
  { name: 'C#', freq: 277.18, black: true },
  { name: 'D', freq: 293.66, color: '#F08A24', textColor: '#1A2B4C' }, // orange
  { name: 'D#', freq: 311.13, black: true },
  { name: 'E', freq: 329.63, color: '#F4D03F', textColor: '#1A2B4C' }, // yellow
  { name: 'F', freq: 349.23, color: '#4CAF6D', textColor: '#FFFFFF' }, // green
  { name: 'F#', freq: 369.99, black: true },
  { name: 'G', freq: 392.0, color: '#3A8DDE', textColor: '#FFFFFF' }, // blue
  { name: 'G#', freq: 415.3, black: true },
  { name: 'A', freq: 440.0, color: '#7A6BCC', textColor: '#FFFFFF' }, // indigo (brand purple)
  { name: 'A#', freq: 466.16, black: true },
  { name: 'B', freq: 493.88, color: '#D46FB3', textColor: '#FFFFFF' }, // violet
];

const WHITE_NOTES = NOTES.filter((n) => !n.black);

// "Twinkle, Twinkle, Little Star" opening phrase — 7 syllables, 7 notes,
// unambiguously public domain (lyrics 1806, melody 1761). A simple,
// well-known first lesson, not proprietary content.
const LESSON = ['C', 'C', 'G', 'G', 'A', 'A', 'G'];

let audioCtx = null;
function playTone(freq) {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

function Keyboard({ onPlay, highlightNote }) {
  return (
    <div className="relative mx-auto flex h-40 w-fit" data-testid="piano-keyboard">
      {WHITE_NOTES.map((note) => (
        <button
          key={note.name}
          type="button"
          onClick={() => onPlay(note)}
          aria-label={note.name}
          data-testid={`piano-key-${note.name}`}
          className="flex h-40 w-14 flex-col items-center justify-end rounded-b-lg border-2 border-navy/20 pb-2 text-lg font-bold sm:w-16"
          style={{
            backgroundColor: note.color,
            color: note.textColor,
            outline: highlightNote === note.name ? '4px solid #1A2B4C' : 'none',
          }}
        >
          {note.name}
        </button>
      ))}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-24 justify-center gap-2">
        {NOTES.filter((n) => n.black).map((note, i) => {
          // Rough visual placement between white keys — approximate, not
          // acoustically precise; fine for a teaching UI, not a real piano.
          const offsets = [42, 98, 210, 266, 322];
          return (
            <button
              key={note.name}
              type="button"
              onClick={() => onPlay(note)}
              aria-label={note.name}
              className="pointer-events-auto absolute h-24 w-9 rounded-b-md bg-navy"
              style={{ left: offsets[i] }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Piano() {
  const { user, t } = useApp();
  const { loading, cohort } = useParticipantData();
  const [step, setStep] = useState(0); // index into LESSON
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [mistakes, setMistakes] = useState(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (phase === 'playing' && step >= LESSON.length) {
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, phase]);

  if (loading) return <p className="text-xl text-navy">{t('loading')}</p>;

  function start() {
    setStep(0);
    setMistakes(0);
    setPhase('playing');
    startedAtRef.current = Date.now();
  }

  async function finish() {
    setPhase('done');
    const correct = LESSON.length - Math.min(mistakes, LESSON.length);
    await dataClient.saveGameScore({
      participantId: user.id,
      cohortId: cohort.id,
      weekNumber: cohort.current_week,
      gameType: 'piano',
      score: correct,
      maxScore: LESSON.length,
      durationSeconds: Math.round((Date.now() - startedAtRef.current) / 1000),
    });
  }

  function handlePlay(note) {
    playTone(note.freq);
    if (phase !== 'playing') return;
    if (note.name === LESSON[step]) {
      setStep((s) => s + 1);
    } else {
      setMistakes((m) => m + 1);
    }
  }

  const target = phase === 'playing' ? NOTES.find((n) => n.name === LESSON[step]) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">{t('pianoTitle')}</h1>
        <p className="mt-2 text-lg text-body/80">{t('pianoIntro')}</p>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-2xl font-bold text-navy">
        {phase === 'idle' && t('pianoReady')}
        {phase === 'playing' && target && (
          <>
            {t('pianoFindColor')}{' '}
            <span
              className="inline-block rounded-full px-4 py-1"
              style={{ backgroundColor: target.color, color: target.textColor }}
            >
              {target.name}
            </span>
          </>
        )}
        {phase === 'done' && t('pianoDone', { score: LESSON.length - Math.min(mistakes, LESSON.length), max: LESSON.length })}
      </p>

      <Keyboard onPlay={handlePlay} highlightNote={target?.name} />

      <div className="flex justify-center gap-3">
        {(phase === 'idle' || phase === 'done') && (
          <button
            type="button"
            onClick={start}
            className="min-h-tap rounded-xl bg-teal px-8 text-xl font-bold text-white hover:bg-teal-dark"
            data-testid="piano-start"
          >
            {phase === 'idle' ? t('startGame') : t('tryAgain')}
          </button>
        )}
      </div>
    </div>
  );
}
