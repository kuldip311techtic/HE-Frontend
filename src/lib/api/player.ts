import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.playerRoleSelection;

/** GET /api/v1/player/role-selection */
export async function fetchPlayerRoleSelection(): Promise<unknown> {
  const { data } = await apiClient.request<unknown>({
    method,
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
