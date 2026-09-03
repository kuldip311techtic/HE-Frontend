import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPathTemplate } = CONTRACT_ROUTES.sessionDetail;

/** GET /api/v1/sessions/{session_id} */
export async function fetchSessionById(sessionId: string): Promise<unknown> {
  const contractPath = contractPathTemplate.replace('{session_id}', sessionId);
  const { data } = await apiClient.request<unknown>({
    method,
    url: contractPathToClientPath(contractPath),
  });
  return data;
}
