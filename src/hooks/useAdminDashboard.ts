import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationProfile,
  getOrganizations,
  getSuperAdminDashboard,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";

export function useAdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");

  const profileQuery = useQuery({
    queryKey: ["organization", "profile"],
    queryFn: getOrganizationProfile,
    enabled: !isSuperAdmin,
    select: (data) => data.profile,
  });

  const superAdminDashboardQuery = useQuery({
    queryKey: ["super-admin", "dashboard"],
    queryFn: getSuperAdminDashboard,
    enabled: isSuperAdmin,
  });

  const organizationsQuery = useQuery({
    queryKey: ["super-admin", "organizations"],
    queryFn: getOrganizations,
    enabled: isSuperAdmin,
    select: (data) => data.items,
  });

  const isLoading = isSuperAdmin
    ? superAdminDashboardQuery.isLoading || organizationsQuery.isLoading
    : profileQuery.isLoading;

  const error = isSuperAdmin
    ? superAdminDashboardQuery.error ?? organizationsQuery.error
    : profileQuery.error;

  return {
    isSuperAdmin,
    profile: profileQuery.data,
    dashboard: superAdminDashboardQuery.data,
    organizations: organizationsQuery.data ?? [],
    isLoading,
    error: error ? getApiErrorMessage(error) : null,
    refetch: () => {
      if (isSuperAdmin) {
        void superAdminDashboardQuery.refetch();
        void organizationsQuery.refetch();
      } else {
        void profileQuery.refetch();
      }
    },
  };
}
