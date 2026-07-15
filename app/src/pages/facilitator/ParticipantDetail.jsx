import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/**
 * Facilitator: Participant Detail — one participant's check-in scores,
 * game scores, and an editable notes field saved via the adapter.
 */
export default function ParticipantDetail() {
  const { participantId } = useParams();
  const { user, t } = useApp();
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [noteStatus, setNoteStatus] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const [participant, progress, scores, noteRow] = await Promise.all([
        dataClient.getUser(participantId),
        dataClient.getParticipantProgress(participantId),
        dataClient.getGameScores(participantId),
        dataClient.getFacilitatorNote(participantId),
      ]);
      if (!alive) return;
      setData({ participant, progress, scores });
      setNote(noteRow?.note ?? '');
    })();
    return () => {
      alive = false;
    };
  }, [participantId]);

  if (!data) return <p className="text-xl text-navy">{t('loading')}</p>;
  const { participant, progress, scores } = data;

  async function saveNote() {
    setNoteStatus('');
    await dataClient.saveFacilitatorNote({
      participantId,
      facilitatorId: user.id,
      note,
    });
    setNoteStatus('Note saved.');
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/facilitator" className="text-lg font-semibold text-teal underline">
          ← My Cohorts
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">{participant?.full_name}</h1>
        <p className="mt-1 text-lg text-body/70">{participant?.email}</p>
      </div>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">Check-in scores</h2>
        {progress.length === 0 ? (
          <p className="mt-3 text-lg text-body/70">No check-ins yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-lg">
            <thead>
              <tr className="border-b-2 border-appbg text-navy">
                <th scope="col" className="py-2 pr-4">Week</th>
                <th scope="col" className="py-2 pr-4">Session</th>
                <th scope="col" className="py-2 pr-4">Confidence</th>
                <th scope="col" className="py-2 pr-4">Memory</th>
                <th scope="col" className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p) => (
                <tr key={p.id} className="border-b border-appbg">
                  <td className="py-3 pr-4">Week {p.week_number}</td>
                  <td className="py-3 pr-4">{p.session}</td>
                  <td className="py-3 pr-4 font-bold text-teal">{p.check_in_confidence}/5</td>
                  <td className="py-3 pr-4 font-bold text-teal">{p.check_in_memory}/5</td>
                  <td className="py-3">{new Date(p.completed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">Game scores</h2>
        {scores.length === 0 ? (
          <p className="mt-3 text-lg text-body/70">No games played yet.</p>
        ) : (
          <table className="mt-4 w-full text-left text-lg">
            <thead>
              <tr className="border-b-2 border-appbg text-navy">
                <th scope="col" className="py-2 pr-4">Game</th>
                <th scope="col" className="py-2 pr-4">Score</th>
                <th scope="col" className="py-2 pr-4">Week</th>
                <th scope="col" className="py-2">Played</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s) => (
                <tr key={s.id} className="border-b border-appbg">
                  <td className="py-3 pr-4">
                    {s.game_type === 'memory_grid' ? 'Memory Grid' : 'Flashcards'}
                  </td>
                  <td className="py-3 pr-4 font-bold text-teal">
                    {s.score}/{s.max_score}
                  </td>
                  <td className="py-3 pr-4">Week {s.week_number}</td>
                  <td className="py-3">{new Date(s.played_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-2xl bg-card p-6 shadow">
        <h2 className="text-2xl font-bold text-navy">
          <label htmlFor="facilitator-note">Notes</label>
        </h2>
        <textarea
          id="facilitator-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          className="mt-4 w-full rounded-xl border-2 border-teal/40 p-4 text-lg focus:border-teal"
        />
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={saveNote}
            className="min-h-tap rounded-xl bg-teal px-6 text-xl font-bold text-white hover:bg-teal-dark"
          >
            Save note
          </button>
          <span aria-live="polite" className="text-lg font-semibold text-teal">
            {noteStatus}
          </span>
        </div>
      </section>
    </div>
  );
}
