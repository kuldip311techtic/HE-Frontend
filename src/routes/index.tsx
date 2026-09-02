import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SuperAdminDashboard from "@/routes/super-admin/Dashboard";
import SuperAdminLogin from "@/routes/super-admin/Login";
import ManageOrganizations from "@/routes/super-admin/ManageOrganizations";
import ManageUsers from "@/routes/super-admin/ManageUsers";
import Subscriptions from "@/routes/super-admin/Subscriptions";
import SupportRequests from "@/routes/super-admin/SupportRequests";

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
        <Route path="/admin" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route
          path="/super-admin/manage-organizations"
          element={<ManageOrganizations />}
        />
        <Route path="/super-admin/manage-users" element={<ManageUsers />} />
        <Route
          path="/super-admin/subscriptions"
          element={<Subscriptions />}
        />
        <Route
          path="/super-admin/support-requests"
          element={<SupportRequests />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/super-admin/login" replace />} />
    </Routes>
  );
}
