import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/**
 * Facilitator: Cohort View — participant roster with this week's engagement
 * at a glance (check-in done, games played, last activity).
 */
export default function CohortView() {
  const { cohortId } = useParams();
  const { t } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [cohort, roster, progress, scores] = await Promise.all([
        dataClient.getCohort(cohortId),
        dataClient.getCohortParticipants(cohortId),
        dataClient.getProgressForCohort(cohortId),
        dataClient.getGameScoresForCohort(cohortId),
      ]);
      if (alive) setData({ cohort, roster, progress, scores });
    })();
    return () => {
      alive = false;
    };
  }, [cohortId]);

  if (!data) return <p className="text-xl text-navy">{t('loading')}</p>;
  const { cohort, roster, progress, scores } = data;
  const week = cohort?.current_week ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/facilitator" className="text-lg font-semibold text-teal underline">
          ← My Cohorts
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold text-navy">{cohort?.name}</h1>
        <p className="mt-1 text-xl text-body/80">
          Week {week} · Track {cohort?.track.toUpperCase()} · {roster.length} participants
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-card shadow">
        <table className="w-full text-left text-lg">
          <thead>
            <tr className="border-b-2 border-appbg text-navy">
              <th scope="col" className="px-5 py-4">Participant</th>
              <th scope="col" className="px-5 py-4">Check-in (wk {week})</th>
              <th scope="col" className="px-5 py-4">Games (wk {week})</th>
              <th scope="col" className="px-5 py-4">Last activity</th>
              <th scope="col" className="px-5 py-4"><span className="sr-only">Detail</span></th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p) => {
              const pProgress = progress.filter(
                (r) => r.participant_id === p.id && r.week_number === week
              );
              const pScores = scores.filter(
                (r) => r.participant_id === p.id && r.week_number === week
              );
              const lastDates = [
                ...pProgress.map((r) => r.completed_at),
                ...pScores.map((r) => r.played_at),
              ].sort();
              const last = lastDates[lastDates.length - 1];
              return (
                <tr key={p.id} className="border-b border-appbg">
                  <td className="px-5 py-4 font-semibold text-navy">{p.full_name}</td>
                  <td className="px-5 py-4">
                    {pProgress.length > 0 ? (
                      <span className="rounded-full bg-teal-light px-4 py-1 font-bold text-teal">
                        Done
                      </span>
                    ) : (
                      <span className="rounded-full bg-appbg px-4 py-1 text-body/70">
                        Not yet
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">{pScores.length}</td>
                  <td className="px-5 py-4">
                    {last ? new Date(last).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/facilitator/participants/${p.id}`}
                      className="inline-flex min-h-tap items-center rounded-lg bg-teal px-4 font-bold text-white hover:bg-teal-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
