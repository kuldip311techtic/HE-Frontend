import { useQuery } from "@tanstack/react-query";
import { listAdminUsers } from "@/lib/api/services/admin";
import type { AdminUserListParams } from "@/types/api";
import { useHasLiveApiAccess } from "@/hooks/useHasLiveApiAccess";

export function useAdminUsers(params: AdminUserListParams) {
  const hasLiveApiAccess = useHasLiveApiAccess();

  return useQuery({
    queryKey: ["super-admin", "users", params],
    queryFn: () => listAdminUsers(params),
    enabled: hasLiveApiAccess,
  });
}
