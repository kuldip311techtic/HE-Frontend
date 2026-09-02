import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchQuickAccessLinks } from "@/services/super-admin-quick-access";

export function useQuickAccessLinks() {
  return useQuery({
    queryKey: queryKeys.superAdmin.quickAccess,
    queryFn: fetchQuickAccessLinks,
  });
}
