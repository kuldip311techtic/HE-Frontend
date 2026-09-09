import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';

export async function getSession(sessionId: string): Promise<unknown> {
  return apiRequest<unknown>(endpoints.sessionDetail, {
    pathParams: { session_id: sessionId },
  });
}
