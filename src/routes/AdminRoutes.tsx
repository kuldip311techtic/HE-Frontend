import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { RoleGate } from '@/components/ui/RoleGate';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route
        path="/*"
        element={
          <RoleGate>
            <ErrorBoundary>
              <AdminLayout />
            </ErrorBoundary>
          </RoleGate>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
