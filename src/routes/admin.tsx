import { Navigate, Route, Routes } from 'react-router-dom';
import { RoleGate } from '@/components/auth/RoleGate';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<RoleGate />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="organizations"
            element={<Navigate to="/admin" replace />}
          />
          <Route path="users" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
