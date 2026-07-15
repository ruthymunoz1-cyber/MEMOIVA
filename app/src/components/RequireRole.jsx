import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ROLE_HOME = {
  participant: '/app',
  facilitator: '/facilitator',
  admin: '/admin',
};

/**
 * Role-based route guard. Not signed in -> role picker. Signed in with a
 * different role -> redirect to that role's home.
 */
export default function RequireRole({ role, children }) {
  const { user, ready, t } = useApp();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-navy">
        {t('loading')}
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />;
  return children;
}
