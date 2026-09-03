import type { SessionDetailResponse } from '@/types/sessions';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath, contractPathWithParams } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.sessionDetail;

/** GET /sessions/{session_id} */
export async function fetchSessionDetail(sessionId: string): Promise<SessionDetailResponse> {
  const resolvedPath = contractPathWithParams(contractPath, { session_id: sessionId });
  const { data } = await apiClient.request<SessionDetailResponse>({
    method,
    url: contractPathToClientPath(resolvedPath),
  });
  return data;
}
