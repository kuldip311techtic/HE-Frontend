import { Navigate, Route, Routes } from 'react-router-dom';
import SuperAdminLogin from '@/routes/super-admin/Login';
import SuperAdminDashboard from '@/routes/super-admin/Dashboard';
import ManageUsers from '@/routes/super-admin/ManageUsers';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/manage-users" element={<ManageUsers />} />
      <Route path="*" element={<Navigate to="/super-admin/login" replace />} />
    </Routes>
  );
}
