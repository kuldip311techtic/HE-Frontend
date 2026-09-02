import { useQuery } from "@tanstack/react-query";
import { getSupportRequests } from "@/lib/api/services/admin";
import type { ListQueryParams } from "@/types/api";

export function useSupportRequests(params: ListQueryParams) {
  return useQuery({
    queryKey: ["super-admin", "support-requests", params],
    queryFn: () => getSupportRequests(params),
  });
}
