import { useQuery } from "@tanstack/react-query";

import { fetchSupportRequests } from "@/services/super-admin-support-requests";

export function useSupportRequests() {
  return useQuery({
    queryKey: ["support-requests"],
    queryFn: fetchSupportRequests,
  });
}
