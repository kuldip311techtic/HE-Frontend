import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import { fetchQuickAccessLinks } from "@/services/super-admin-quick-access";

/**
 * Loads Super Admin quick-access module links via React Query.
 *
 * API contract: GET `/api/super-admin/quick-access`
 * - Auth: Bearer token (super-admin session)
 * - Response: QuickAccessResponse | QuickAccessLinkApiItem[]
 * - Returns: QuickAccessLink[]
 *
 * @see fetchQuickAccessLinks
 */
export function useQuickAccessLinks() {
  return useQuery({
    queryKey: queryKeys.superAdmin.quickAccess,
    queryFn: fetchQuickAccessLinks,
  });
}
