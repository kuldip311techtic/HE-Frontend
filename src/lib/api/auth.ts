import type { LoginRequest, LoginResponse } from '@/types/auth';
import { apiClient } from './client';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/v1/auth/login', credentials);
  return data;
}
