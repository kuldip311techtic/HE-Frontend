import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { listSupportRequests } from '@/lib/api/services/supportRequests';
import type { SupportRequestListParams } from '@/types/support';

export function useSupportRequests(params: SupportRequestListParams) {
  return useQuery({
    queryKey: queryKeys.supportRequests(params),
    queryFn: () => listSupportRequests(params),
  });
}
