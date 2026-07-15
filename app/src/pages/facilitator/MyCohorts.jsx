import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/** Facilitator: My Cohorts — list with current week indicator. */
export default function MyCohorts() {
  const { user, t } = useApp();
  const [cohorts, setCohorts] = useState(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    dataClient.getCohortsForFacilitator(user.id).then((c) => alive && setCohorts(c));
    return () => {
      alive = false;
    };
  }, [user]);

  if (!cohorts) return <p className="text-xl text-navy">{t('loading')}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-navy">My Cohorts</h1>
      <ul className="space-y-4">
        {cohorts.map((c) => (
          <li key={c.id}>
            <Link
              to={`/facilitator/cohorts/${c.id}`}
              className="flex min-h-tap flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-6 shadow hover:bg-teal-light"
            >
              <span>
                <span className="block text-2xl font-bold text-navy">{c.name}</span>
                <span className="mt-1 block text-lg text-body/70">
                  Track: {c.track.toUpperCase()} · Level: {c.level} · Block {c.block_number}
                </span>
              </span>
              <span className="rounded-full bg-teal px-5 py-2 text-lg font-bold text-white">
                Week {c.current_week}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
