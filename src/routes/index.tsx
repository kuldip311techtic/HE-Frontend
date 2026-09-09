import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRouteGuard } from '@/components/features/auth/AdminRouteGuard';
import { RootRedirect } from '@/routes/RootRedirect';
import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPlaceholderPage } from '@/pages/admin/DashboardPlaceholderPage';
import { UnauthorizedPage } from '@/pages/admin/UnauthorizedPage';
import { OrganizationsPage } from '@/pages/admin/OrganizationsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { SubscriptionsPage } from '@/pages/admin/SubscriptionsPage';
import { SupportPage } from '@/pages/admin/SupportPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<AdminRouteGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPlaceholderPage />} />
          <Route path="/admin/organizations" element={<OrganizationsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/admin/support" element={<SupportPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
