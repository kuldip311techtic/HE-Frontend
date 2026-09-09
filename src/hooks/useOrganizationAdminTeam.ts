import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { getOrganizationAdminTeam } from '@/lib/api/services/organizationAdminTeams';

export function useOrganizationAdminTeam(teamId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organizationAdminTeam(teamId ?? ''),
    queryFn: () => getOrganizationAdminTeam(teamId as string),
    enabled: Boolean(teamId),
    retry: false,
  });
}
