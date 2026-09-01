import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchSupportRequests } from "@/services/super-admin-support-requests";

export function useSupportRequests() {
  return useQuery({
    queryKey: queryKeys.superAdmin.supportRequests,
    queryFn: fetchSupportRequests,
  });
}
