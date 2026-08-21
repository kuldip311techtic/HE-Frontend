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
        className="relative hidden w-[46%] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(234,88,12,0.28),transparent_42%),radial-gradient(circle_at_90%_80%,rgba(29,78,216,0.18),transparent_36%),linear-gradient(160deg,#07111f_0%,#0b1a2e_52%,#12243c_100%)] px-12 py-16 lg:flex lg:flex-col lg:justify-between"
      >
        <div>
          <BrandMark />
          <p className="mt-16 max-w-md text-4xl font-bold leading-tight text-secondary">
            Command the Hoops Engine dashboard.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 text-navy-muted">
            Super Admins sign in here to manage organizations, coaches, and
            players from one secure workspace.
          </p>
        </div>
        <CourtGraphic />
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[420px] rounded-2xl bg-surface p-6 shadow-card sm:p-8">
          <div className="mb-8 lg:hidden">
            <BrandMark dark />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Super Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-8 text-ink sm:text-[32px] sm:leading-10">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Enter your email and password to access the dashboard.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminDashboardPage() {
  const email = getStoredEmail();

  return (
    <AdminLayout title="Dashboard">
      <section className="mb-6 rounded-2xl bg-surface p-6 text-ink shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Super Admin
        </p>
        <h2 className="mt-2 text-3xl font-bold leading-10">Dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          You are signed in
          {email ? ` as ${email}` : ''} and can manage organizations, coaches,
          and players.
        </p>
      </section>
      <div className="space-y-6">
        <DashboardMetrics />
        <NavigationLinks />
      </div>
    </AdminLayout>
  );
}

interface AdminModulePageProps {
  title: string;
  description: string;
}

function AdminModulePage({ title, description }: AdminModulePageProps) {
  return (
    <AdminLayout title={title}>
      <section className="mb-6 rounded-2xl bg-surface p-6 text-ink shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Super Admin
        </p>
        <h2 className="mt-2 text-3xl font-bold leading-10">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </section>
      <EmptyState
        title={`${title} module`}
        description={`Use this workspace to manage ${title.toLowerCase()} across the platform.`}
      />
    </AdminLayout>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path={adminPaths.root}
        element={<Navigate to={adminPaths.login} replace />}
      />
      <Route
        path={adminPaths.admin}
        element={<Navigate to={adminPaths.dashboard} replace />}
      />
      {adminPublicNavigation.map((item) => (
        <Route key={item.to} path={item.to} element={<AdminLoginPage />} />
      ))}
      <Route
        path={adminPaths.dashboard}
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={adminPaths.organizations}
        element={
          <ProtectedRoute>
            <AdminModulePage
              title="Organizations"
              description="View and manage organization accounts, billing contacts, and platform access."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path={adminPaths.coaches}
        element={
          <ProtectedRoute>
            <AdminModulePage
              title="Coaches"
              description="Review coach profiles, assignments, and activity across organizations."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path={adminPaths.players}
        element={
          <ProtectedRoute>
            <AdminModulePage
              title="Players"
              description="Monitor player records, enrollment status, and session participation."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path={adminPaths.sessions}
        element={
          <ProtectedRoute>
            <AdminModulePage
              title="Sessions"
              description="Track scheduled, in-progress, and completed training sessions."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path={adminPaths.subscriptions}
        element={
          <ProtectedRoute>
            <AdminModulePage
              title="Subscriptions"
              description="Review active subscription plans, renewals, and billing status."
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={adminPaths.login} replace />} />
    </Routes>
  );
}
