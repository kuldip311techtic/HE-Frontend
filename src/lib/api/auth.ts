import type { LoginRequest, LoginResponse } from '@/types/auth';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.authLogin;

/** POST /api/super-admin/login (JAW-9607) */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.request<LoginResponse>({
    method,
    url: contractPathToClientPath(contractPath),
    data: credentials,
  });
  return data;
}
