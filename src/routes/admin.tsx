import { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { RoleGate } from '@/components/ui/RoleGate';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <RoleGate allowedRoles={['super_admin', 'admin']}>
        <AdminLayout />
      </RoleGate>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
];
