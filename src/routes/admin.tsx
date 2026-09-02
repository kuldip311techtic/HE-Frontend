import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminLoginPage } from "@/pages/admin/LoginPage";
import { SessionDetailPage } from "@/pages/admin/SessionDetailPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
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
        <Route
          path="sessions/:sessionId"
          element={<SessionDetailPage />}
        />
        <Route
          path="organization"
          element={
            <PageHeader
              title="Organization"
              description="Manage your organization profile and settings."
            />
          }
        />
        <Route
          path="teams"
          element={
            <PageHeader
              title="Teams"
              description="Create and manage teams for your organization."
            />
          }
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
