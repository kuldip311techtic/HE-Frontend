import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { getSession } from '@/lib/api/services/sessions';

export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.session(sessionId ?? ''),
    queryFn: () => getSession(sessionId as string),
    enabled: Boolean(sessionId),
    retry: false,
  });
}
