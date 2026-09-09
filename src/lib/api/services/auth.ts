import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { AuthLoginRequest, AuthLoginResponse } from '@/types/auth';

export async function loginRequest(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
  const { method, path } = endpoints.authLogin;
  const { data } = await apiClient.request<AuthLoginResponse>({
    method,
    url: path,
    data: payload,
  });
  return data;
}
