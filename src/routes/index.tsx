import { Navigate, Route, Routes } from "react-router-dom";

import SuperAdminCoaches from "@/routes/super-admin/Coaches";
import SuperAdminDashboard from "@/routes/super-admin/Dashboard";
import SuperAdminLogin from "@/routes/super-admin/Login";
import SuperAdminOrganizations from "@/routes/super-admin/Organizations";
import SuperAdminPlayers from "@/routes/super-admin/Players";
import SubscriptionsPage from "@/routes/super-admin/Subscriptions";
import SupportRequestsPage from "@/routes/super-admin/SupportRequests";
import SuperAdminUsers from "@/routes/super-admin/Users";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/super-admin/login" replace />} />
      <Route path="/super-admin/login" element={<SuperAdminLogin />} />
      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route
        path="/super-admin/organizations"
        element={<SuperAdminOrganizations />}
      />
      <Route path="/super-admin/coaches" element={<SuperAdminCoaches />} />
      <Route path="/super-admin/players" element={<SuperAdminPlayers />} />
      <Route path="/super-admin/users" element={<SuperAdminUsers />} />
      <Route
        path="/super-admin/subscriptions"
        element={<SubscriptionsPage />}
      />
      <Route
        path="/super-admin/support-requests"
        element={<SupportRequestsPage />}
      />
      <Route path="*" element={<Navigate to="/super-admin/login" replace />} />
    </Routes>
  );
}
