import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import RequireRole from './components/RequireRole';
import Layout from './components/Layout';

import RolePicker from './pages/RolePicker';
import Dashboard from './pages/participant/Dashboard';
import ThisWeek from './pages/participant/ThisWeek';
import Flashcards from './pages/participant/Flashcards';
import MemoryGrid from './pages/participant/MemoryGrid';
import ColoringStudio from './pages/participant/ColoringStudio';
import MyProgress from './pages/participant/MyProgress';
import CheckIn from './pages/participant/CheckIn';
import MyCohorts from './pages/facilitator/MyCohorts';
import CohortView from './pages/facilitator/CohortView';
import ParticipantDetail from './pages/facilitator/ParticipantDetail';
import AllCohorts from './pages/admin/AllCohorts';
import UserManagement from './pages/admin/UserManagement';

function ParticipantShell({ children }) {
  const { t } = useApp();
  const nav = [
    { to: '/app', label: t('navHome'), end: true },
    { to: '/app/week', label: t('navThisWeek') },
    { to: '/app/vocabulary', label: t('navVocabulary') },
    { to: '/app/games', label: t('navGames') },
    { to: '/app/coloring', label: t('navColoring') },
    { to: '/app/progress', label: t('navProgress') },
    { to: '/app/check-in', label: t('navCheckIn') },
  ];
  return (
    <RequireRole role="participant">
      <Layout nav={nav}>{children}</Layout>
    </RequireRole>
  );
}

function FacilitatorShell({ children }) {
  const nav = [{ to: '/facilitator', label: 'My Cohorts', end: true }];
  return (
    <RequireRole role="facilitator">
      <Layout nav={nav}>{children}</Layout>
    </RequireRole>
  );
}

function AdminShell({ children }) {
  const nav = [
    { to: '/admin', label: 'All Cohorts', end: true },
    { to: '/admin/users', label: 'User Management' },
  ];
  return (
    <RequireRole role="admin">
      <Layout nav={nav}>{children}</Layout>
    </RequireRole>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RolePicker />} />

      <Route path="/app" element={<ParticipantShell><Dashboard /></ParticipantShell>} />
      <Route path="/app/week" element={<ParticipantShell><ThisWeek /></ParticipantShell>} />
      <Route path="/app/vocabulary" element={<ParticipantShell><Flashcards /></ParticipantShell>} />
      <Route path="/app/games" element={<ParticipantShell><MemoryGrid /></ParticipantShell>} />
      <Route path="/app/coloring" element={<ParticipantShell><ColoringStudio /></ParticipantShell>} />
      <Route path="/app/progress" element={<ParticipantShell><MyProgress /></ParticipantShell>} />
      <Route path="/app/check-in" element={<ParticipantShell><CheckIn /></ParticipantShell>} />

      <Route path="/facilitator" element={<FacilitatorShell><MyCohorts /></FacilitatorShell>} />
      <Route
        path="/facilitator/cohorts/:cohortId"
        element={<FacilitatorShell><CohortView /></FacilitatorShell>}
      />
      <Route
        path="/facilitator/participants/:participantId"
        element={<FacilitatorShell><ParticipantDetail /></FacilitatorShell>}
      />

      <Route path="/admin" element={<AdminShell><AllCohorts /></AdminShell>} />
      <Route path="/admin/users" element={<AdminShell><UserManagement /></AdminShell>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
