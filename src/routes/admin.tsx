import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminLoginPage } from "@/pages/admin/LoginPage";
import { UnauthorizedPage } from "@/pages/admin/UnauthorizedPage";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/*"
        element={
          <RoleGate>
            <AdminLayout />
          </RoleGate>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
