import { Navigate, Route, Routes } from 'react-router-dom';
import CourtGraphic from '../assets/CourtGraphic';
import AdminLayout from '../components/layout/AdminLayout';
import BrandMark from '../components/layout/BrandMark';
import { ProtectedRoute } from '../components/layout/RoleGate';
import DashboardMetrics from '../components/ui/DashboardMetrics';
import EmptyState from '../components/ui/EmptyState';
import LoginForm from '../components/ui/LoginForm';
import NavigationLinks from '../components/ui/NavigationLinks';
import { getStoredEmail, isAuthenticated } from '../hooks/useAuth';
import { breakpoints } from '../theme/breakpoints';
import AdminDashboard from './admin.dashboard';

export const adminPaths = {
  root: '/',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  organizations: '/admin/organizations',
  coaches: '/admin/coaches',
  players: '/admin/players',
  sessions: '/admin/sessions',
  subscriptions: '/admin/subscriptions',
} as const;

export type AdminPath = (typeof adminPaths)[keyof typeof adminPaths];

export const adminPublicNavigation = [
  { label: 'Login', to: adminPaths.login },
] as const;

export const adminCoreModules = [
  {
    label: 'Organizations',
    to: adminPaths.organizations,
    description: 'Manage organization accounts and settings.',
  },
  {
    label: 'Coaches',
    to: adminPaths.coaches,
    description: 'Review coach profiles and assignments.',
  },
  {
    label: 'Players',
    to: adminPaths.players,
    description: 'Monitor player records across the platform.',
  },
  {
    label: 'Sessions',
    to: adminPaths.sessions,
    description: 'Track scheduled and completed sessions.',
  },
  {
    label: 'Subscriptions',
    to: adminPaths.subscriptions,
    description: 'Review active subscription plans and billing.',
  },
] as const;

export const adminNavigation = [
  { label: 'Dashboard', to: adminPaths.dashboard },
  ...adminCoreModules.map(({ label, to }) => ({ label, to })),
] as const;

function AdminLoginPage() {
  if (isAuthenticated()) {
    return <Navigate to={adminPaths.dashboard} replace />;
  }

  return (
    <main
      className="flex min-h-screen bg-canvas font-sans text-secondary"
      data-breakpoint-mobile={breakpoints.mobile}
      data-breakpoint-tablet={breakpoints.tablet}
      data-breakpoint-desktop={breakpoints.desktop}
    >
      <section
        aria-label="Hoops Engine brand"
        className="relative hidden w-[46%] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(234,88,12,0.28),"
      >
        <CourtGraphic />
      </section>
      <section className="flex flex-1 flex-col items-center justify-center p-8">
        <BrandMark />
        <LoginForm />
      </section>
    </main>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path={adminPaths.root} element={<Navigate to={adminPaths.dashboard} replace />} />
      <Route path={adminPaths.login} element={<AdminLoginPage />} />
      <Route path={adminPaths.dashboard} element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      {/* Other routes */}
    </Routes>
  );
}
