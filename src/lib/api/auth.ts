import apiClient from '@/lib/api/client';
import type { LoginRequest, LoginResponse } from '@/types/api';

const LOGIN_ENDPOINT = '/v1/super_admin/login';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    LOGIN_ENDPOINT,
    credentials,
  );

  if (!data.success) {
    throw new Error(data.message || 'Incorrect email or password.');
  }

  return data;
}

export { LOGIN_ENDPOINT };
