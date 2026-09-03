import { Navigate, Route, Routes } from 'react-router-dom';

import { RoleGate } from '@/components/auth/RoleGate';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { OrganizationsPage } from '@/pages/admin/OrganizationsPage';
import { SubscriptionsPage } from '@/pages/admin/SubscriptionsPage';
import { SupportRequestsPage } from '@/pages/admin/SupportRequestsPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { UnauthorizedPage } from '@/pages/admin/UnauthorizedPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/admin"
        element={
          <RoleGate>
            <AdminLayout />
          </RoleGate>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="support-requests" element={<SupportRequestsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
