import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationProfile,
  getSuperAdminDashboard,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSuperAdminQueryEnabled } from "@/hooks/useSuperAdminQueryEnabled";
import { useAuth } from "@/hooks/useAuth";

export function useAdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isSuperAdminQueryEnabled = useSuperAdminQueryEnabled();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.roles.includes("super_admin");

  const profileQuery = useQuery({
    queryKey: ["organization", "profile"],
    queryFn: getOrganizationProfile,
    enabled: !isAuthLoading && !isSuperAdmin && Boolean(user),
    select: (data) => data.profile,
  });

  const superAdminDashboardQuery = useQuery({
    queryKey: ["super-admin", "dashboard"],
    queryFn: getSuperAdminDashboard,
    enabled: isSuperAdminQueryEnabled,
  });

  const isLoading = isSuperAdmin
    ? superAdminDashboardQuery.isLoading
    : profileQuery.isLoading;

  const isFetching = isSuperAdmin
    ? superAdminDashboardQuery.isFetching
    : profileQuery.isFetching;

  const error = isSuperAdmin
    ? superAdminDashboardQuery.error
    : profileQuery.error;

  const refetch = async () => {
    if (isSuperAdmin) {
      return superAdminDashboardQuery.refetch();
    }
    return profileQuery.refetch();
  };

  return {
    isSuperAdmin,
    profile: profileQuery.data,
    dashboard: superAdminDashboardQuery.data,
    isLoading,
    isFetching,
    error: error ? getApiErrorMessage(error) : null,
    refetch,
  };
}
