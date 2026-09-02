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
        <Route
          path="organization"
          element={
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Organization</h2>
              <p className="text-muted-foreground">
                Manage your organization profile and settings.
              </p>
            </div>
          }
        />
        <Route
          path="teams"
          element={
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Teams</h2>
              <p className="text-muted-foreground">
                Create and manage teams for your organization.
              </p>
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <p className="text-muted-foreground">
                Configure admin panel preferences and account settings.
              </p>
            </div>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
