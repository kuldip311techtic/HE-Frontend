import { apiClient } from '@/lib/api/client';
import type { AuthUser } from '@/types/auth';
import type { LoginRequest, LoginResponse, UserPublic } from '@/types/api';

export const SUPER_ADMIN_ACCESS_DENIED_MESSAGE =
  'This account does not have Super Admin access.';

export async function loginWithEmail(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/v1/auth/login', credentials);
  return data;
}

export function isSuperAdminUser(user: UserPublic): boolean {
  return user.is_super_admin === true || user.role === 'super_admin';
}

export function mapUserPublicToAuthUser(user: UserPublic): AuthUser {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();

  return {
    id: user.id,
    email: user.email,
    name: fullName || user.email,
    role: 'super_admin',
    isSuperAdmin: true,
  };
}
