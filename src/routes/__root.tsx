import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { adminPublicNavigation, paths } from './paths';
import AdminDashboardPage from './admin/Dashboard';
import AdminLoginPage from './admin/Login';
import ManageOrganizationsPage from './super-admin/manage-organizations';
import ManageSupportRequestsPage from './super-admin/manage-support-requests';
import ManageUsersPage from './super-admin/manage-users';

export default function RootRoutes() {
  return (
    <Routes>
      <Route path={paths.root} element={<Navigate to={paths.login} replace />} />
      <Route
        path={paths.admin}
        element={<Navigate to={paths.dashboard} replace />}
      />
      {adminPublicNavigation.map((item) => (
        <Route key={item.to} path={item.to} element={<AdminLoginPage />} />
      ))}
      <Route
        path={paths.dashboard}
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={paths.manageOrganizations}
        element={
          <ProtectedRoute>
            <ManageOrganizationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={paths.manageUsers}
        element={
          <ProtectedRoute>
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={paths.manageSupportRequests}
        element={
          <ProtectedRoute>
            <ManageSupportRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={paths.login} replace />} />
    </Routes>
  );
}
