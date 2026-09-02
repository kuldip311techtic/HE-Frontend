import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminLoginPage } from "@/pages/admin/LoginPage";
import { OrganizationsPage } from "@/pages/admin/OrganizationsPage";
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
        <Route path="organization" element={<OrganizationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="support-requests" element={<SupportRequestsPage />} />
        <Route
          path="teams"
          element={
            <PageHeader
              title="Teams"
              description="Create and manage teams for your organization."
            />
          }
        />
        <Route
          path="settings"
          element={
            <PageHeader
              title="Settings"
              description="Configure admin panel preferences and account settings."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
