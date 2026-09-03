import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="support-requests" element={<SupportRequestsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
