import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';

export async function getPlayerRoleSelection(): Promise<unknown> {
  return apiRequest<unknown>(endpoints.playerRoleSelection);
}
