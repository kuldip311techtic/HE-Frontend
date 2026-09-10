import { apiRequest } from '@/lib/api/request';
import { endpoints } from '@/lib/api/endpoints';
import type { AuthLoginRequest, AuthLoginResponse } from '@/types/auth';

export async function loginRequest(payload: AuthLoginRequest): Promise<AuthLoginResponse> {
  return apiRequest<AuthLoginResponse>(endpoints.authLogin, {
    data: {
      email: payload.email,
      password: payload.password,
    },
  });
}
