import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { getPlayerRoleSelection } from '@/lib/api/services/player';

export function usePlayerRoleSelection(enabled = true) {
  return useQuery({
    queryKey: queryKeys.playerRoleSelection,
    queryFn: getPlayerRoleSelection,
    enabled,
    retry: false,
  });
}
