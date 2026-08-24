import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SuperAdminDashboard from "@/routes/super-admin/Dashboard";
import SuperAdminLogin from "@/routes/super-admin/Login";
import ManageOrganizations from "@/routes/super-admin/ManageOrganizations";
import ManageUsers from "@/routes/super-admin/ManageUsers";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route
          path="/super-admin/manage-organizations"
          element={<ManageOrganizations />}
        />
        <Route path="/super-admin/manage-users" element={<ManageUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/super-admin/login" replace />} />
    </Routes>
  );
}
