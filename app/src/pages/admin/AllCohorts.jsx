import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/** Admin: All Cohorts — global overview list. */
export default function AllCohorts() {
  const { t } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const cohorts = await dataClient.getCohorts();
      const users = await dataClient.getUsers();
      const rosters = await Promise.all(
        cohorts.map((c) => dataClient.getCohortParticipants(c.id))
      );
      if (alive) setData({ cohorts, users, rosters });
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return <p className="text-xl text-navy">{t('loading')}</p>;
  const { cohorts, users, rosters } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-navy">All Cohorts</h1>
      <div className="overflow-x-auto rounded-2xl bg-card shadow">
        <table className="w-full text-left text-lg">
          <thead>
            <tr className="border-b-2 border-appbg text-navy">
              <th scope="col" className="px-5 py-4">Cohort</th>
              <th scope="col" className="px-5 py-4">Track</th>
              <th scope="col" className="px-5 py-4">Level</th>
              <th scope="col" className="px-5 py-4">Block</th>
              <th scope="col" className="px-5 py-4">Current week</th>
              <th scope="col" className="px-5 py-4">Facilitator</th>
              <th scope="col" className="px-5 py-4">Participants</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c, i) => (
              <tr key={c.id} className="border-b border-appbg">
                <td className="px-5 py-4 font-semibold text-navy">{c.name}</td>
                <td className="px-5 py-4 uppercase">{c.track}</td>
                <td className="px-5 py-4">{c.level}</td>
                <td className="px-5 py-4">{c.block_number}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-teal px-4 py-1 font-bold text-white">
                    Week {c.current_week}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {users.find((u) => u.id === c.facilitator_id)?.full_name ?? '—'}
                </td>
                <td className="px-5 py-4">{rosters[i].length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
