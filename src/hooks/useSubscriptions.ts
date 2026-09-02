import { useQuery } from "@tanstack/react-query";

import { fetchSubscriptions } from "@/services/super-admin-subscriptions";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });
}
