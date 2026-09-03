import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminRouteGuard } from '@/components/features/auth/AdminRouteGuard';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminDashboardPage } from '@/routes/pages/AdminDashboardPage';
import { AdminLoginPage } from '@/routes/pages/AdminLoginPage';
import { AdminOrganizationsPage } from '@/routes/pages/AdminOrganizationsPage';
import { AdminSubscriptionsPage } from '@/routes/pages/AdminSubscriptionsPage';
import { AdminUnauthorizedPage } from '@/routes/pages/AdminUnauthorizedPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/unauthorized" element={<AdminUnauthorizedPage />} />
      <Route path="/admin" element={<AdminRouteGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="organizations" element={<AdminOrganizationsPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
        </Route>
      </Route>
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
