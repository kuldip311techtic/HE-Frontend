import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRouteGuard } from '@/components/features/auth/AdminRouteGuard';
import { RootRedirect } from '@/routes/RootRedirect';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage';
import { OrganizationsPage } from '@/pages/admin/OrganizationsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { SubscriptionsPage } from '@/pages/admin/SubscriptionsPage';
import { SupportRequestsPage } from '@/pages/admin/SupportRequestsPage';
import { TeamDetailPage } from '@/pages/admin/TeamDetailPage';
import { SessionDetailPage } from '@/pages/admin/SessionDetailPage';
import { UnauthorizedPage } from '@/pages/admin/UnauthorizedPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<AdminRouteGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/organizations" element={<OrganizationsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/admin/support" element={<SupportRequestsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/admin/sessions/:sessionId" element={<SessionDetailPage />} />
          <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
