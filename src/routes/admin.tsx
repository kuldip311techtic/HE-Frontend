import { Route } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRouteGuard } from '@/routes/AdminRouteGuard';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { OrganizationPage } from '@/pages/admin/OrganizationPage';
import { TeamsPage } from '@/pages/admin/TeamsPage';
import { InviteCoachPage } from '@/pages/admin/InviteCoachPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

export const adminRoutes = (
  <Route element={<AdminRouteGuard />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="organization" element={<OrganizationPage />} />
      <Route path="teams" element={<TeamsPage />} />
      <Route path="invite-coach" element={<InviteCoachPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Route>
);
