import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate } from "@/components/auth/RoleGate";
import { SuperAdminGate } from "@/components/auth/SuperAdminGate";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminLoginPage } from "@/pages/admin/LoginPage";
import { OrganizationsPage } from "@/pages/admin/OrganizationsPage";
import { SessionDetailPage } from "@/pages/admin/SessionDetailPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { SubscriptionsPage } from "@/pages/admin/SubscriptionsPage";
import { SupportRequestsPage } from "@/pages/admin/SupportRequestsPage";
import { UnauthorizedPage } from "@/pages/admin/UnauthorizedPage";
import { UsersPage } from "@/pages/admin/UsersPage";

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

        <Route
          path="organizations"
          element={
            <SuperAdminGate>
              <OrganizationsPage />
            </SuperAdminGate>
          }
        />
        <Route
          path="users"
          element={
            <SuperAdminGate>
              <UsersPage />
            </SuperAdminGate>
          }
        />
        <Route
          path="subscriptions"
          element={
            <SuperAdminGate>
              <SubscriptionsPage />
            </SuperAdminGate>
          }
        />
        <Route
          path="support-requests"
          element={
            <SuperAdminGate>
              <SupportRequestsPage />
            </SuperAdminGate>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
