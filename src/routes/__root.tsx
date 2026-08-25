import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { adminPublicNavigation, paths } from './paths';
import SuperAdminDashboardPage from './super-admin/dashboard';
import SuperAdminLoginPage from './super-admin/login';
import SubscriptionsPage from './super-admin/subscriptions';
import SupportRequestsPage from './super-admin/support-requests';

export default function RootRoutes() {
  return (
    <Routes>
      <Route path={paths.root} element={<Navigate to={paths.login} replace />} />
      {adminPublicNavigation.map((item) => (
        <Route key={item.to} path={item.to} element={<SuperAdminLoginPage />} />
      ))}
      <Route
        path={paths.dashboard}
        element={
          <ProtectedRoute>
            <SuperAdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={paths.subscriptions}
        element={
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={paths.supportRequests}
        element={
          <ProtectedRoute>
            <SupportRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={paths.dashboard} replace />} />
    </Routes>
  );
}
