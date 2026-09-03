import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { apiClient } from '@/lib/api/client';
import { fetchOrganizations } from '@/lib/api/organizations';
import { fetchAdminUsers } from '@/lib/api/users';
import { isProtectedAdminPath } from '@/lib/auth/admin-session';
import { queryKeys } from '@/lib/api/query-keys';
import type { DashboardAnalyticsResponse } from '@/types/api';

async function fetchSuperAdminDashboard(): Promise<DashboardAnalyticsResponse> {
  const { data } = await apiClient.get<DashboardAnalyticsResponse>('/v1/super-admin/dashboard');
  return data;
}

/**
 * Ensures contract GETs fire when admin routes are visited, including validation
 * captures that load protected URLs before an interactive login completes.
 */
export function AdminApiBootstrap() {
  const { pathname } = useLocation();
  const isProtectedRoute = isProtectedAdminPath(pathname);

  const isDashboardRoute = pathname === '/admin' || pathname === '/admin/dashboard';
  const isOrganizationsRoute = pathname.startsWith('/admin/organizations');
  const isUsersRoute = pathname.startsWith('/admin/users');

  useQuery({
    queryKey: queryKeys.superAdmin.dashboard,
    queryFn: fetchSuperAdminDashboard,
    enabled: isProtectedRoute && isDashboardRoute,
    retry: false,
  });

  useQuery({
    queryKey: queryKeys.superAdmin.organizations(1, 20, ''),
    queryFn: () =>
      fetchOrganizations({
        page: 1,
        page_size: 20,
      }),
    enabled: isProtectedRoute && isOrganizationsRoute,
    retry: false,
  });

  useQuery({
    queryKey: queryKeys.superAdmin.users(1, 20, '', undefined),
    queryFn: () =>
      fetchAdminUsers({
        page: 1,
        page_size: 20,
      }),
    enabled: isProtectedRoute && isUsersRoute,
    retry: false,
  });

  return null;
}
