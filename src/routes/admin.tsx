import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AccessDeniedPage, RoleGate } from '@/components/RoleGate';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RoleGate allowedRoles={['super_admin', 'admin']}>
            <AdminLayout />
          </RoleGate>
        }
      >
        <Route
          index
          element={<DashboardPage />}
          handle={{ title: 'Dashboard' }}
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
