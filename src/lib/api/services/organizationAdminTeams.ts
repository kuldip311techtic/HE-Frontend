import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';

export async function getOrganizationAdminTeam(teamId: string): Promise<unknown> {
  return apiRequest<unknown>(endpoints.organizationAdminTeam, {
    pathParams: { team_id: teamId },
  });
}
