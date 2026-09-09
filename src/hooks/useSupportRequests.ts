import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { fetchSupportRequests } from '@/lib/api/services/support';

export function useSupportRequestsList() {
  return useQuery({
    queryKey: queryKeys.supportRequests.all,
    queryFn: fetchSupportRequests,
  });
}
