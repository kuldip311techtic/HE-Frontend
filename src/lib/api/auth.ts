import type { LoginRequest, LoginResponse } from '@/types/auth';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath } from './endpoints';

const { method, path: contractPath } = CONTRACT_ROUTES.authLogin;

/** POST /api/v1/auth/login (live OpenAPI; JAW-9607 ticket alias /api/super-admin/login) */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.request<LoginResponse>({
    method,
    url: contractPathToClientPath(contractPath),
    data: credentials,
  });
  return data;
}
