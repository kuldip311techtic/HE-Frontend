import {
  apiRequest,
  setAuthToken,
  setAuthUser,
  clearAuthToken,
} from '@/services/api-client';
import type { LoginRequest, LoginResponse } from '@/types';

const LOGIN_PATH = '/api/super-admin/login';

export async function loginSuperAdmin(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(LOGIN_PATH, {
    method: 'POST',
    body: credentials,
    auth: false,
  });

  setAuthToken(response.token);
  setAuthUser(response.user);

  return response;
}

export function logoutSuperAdmin(): void {
  clearAuthToken();
}

export { LOGIN_PATH };
