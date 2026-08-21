import apiRequest from './client';
import type { LoginRequest, LoginResponse } from '../../types/api';

const LOGIN_ENDPOINT = '/auth/login';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>(LOGIN_ENDPOINT, {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });

  if (!response.success) {
    throw new Error(response.message || 'Incorrect email or password.');
  }

  return response;
}

export { LOGIN_ENDPOINT };
