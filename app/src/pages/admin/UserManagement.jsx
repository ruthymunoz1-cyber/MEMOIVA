import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import * as dataClient from '../../lib/dataClient';

/** Admin: User Management — read-only list of all users with role labels. */

const ROLE_STYLES = {
  participant: 'bg-teal-light text-teal',
  facilitator: 'bg-gold-light text-gold',
  admin: 'bg-navy text-white',
};

export default function UserManagement() {
  const { t } = useApp();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    let alive = true;
    dataClient.getUsers().then((u) => alive && setUsers(u));
    return () => {
      alive = false;
    };
  }, []);

  if (!users) return <p className="text-xl text-navy">{t('loading')}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-navy">User Management</h1>
      <div className="overflow-x-auto rounded-2xl bg-card shadow">
        <table className="w-full text-left text-lg">
          <thead>
            <tr className="border-b-2 border-appbg text-navy">
              <th scope="col" className="px-5 py-4">Name</th>
              <th scope="col" className="px-5 py-4">Email</th>
              <th scope="col" className="px-5 py-4">Role</th>
              <th scope="col" className="px-5 py-4">Language</th>
              <th scope="col" className="px-5 py-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-appbg">
                <td className="px-5 py-4 font-semibold text-navy">{u.full_name}</td>
                <td className="px-5 py-4">{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-4 py-1 font-bold capitalize ${ROLE_STYLES[u.role]}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 uppercase">{u.preferred_language}</td>
                <td className="px-5 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
