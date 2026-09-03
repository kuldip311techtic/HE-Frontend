import { apiClient } from '@/lib/api/client';
import type {
  AdminUserCreateRequest,
  AdminUserDeleteResponse,
  AdminUserItem,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserRole,
  AdminUserUpdateRequest,
  RoleOption,
} from '@/types/api';

export const MANAGE_USER_CREATE_ROLES: AdminUserRole[] = ['coach', 'player'];

export async function fetchAdminUsers(params: AdminUserListParams): Promise<AdminUserListResponse> {
  const { data } = await apiClient.get<AdminUserListResponse>('/v1/super-admin/users', { params });
  return data;
}

export async function createAdminUser(body: AdminUserCreateRequest): Promise<AdminUserItem> {
  const { data } = await apiClient.post<AdminUserItem>('/v1/super-admin/users', body);
  return data;
}

export async function updateAdminUser(
  userId: string,
  body: AdminUserUpdateRequest,
): Promise<AdminUserItem> {
  const { data } = await apiClient.put<AdminUserItem>(`/v1/super-admin/users/${userId}`, body);
  return data;
}

export async function deleteAdminUser(userId: string): Promise<AdminUserDeleteResponse> {
  const { data } = await apiClient.delete<AdminUserDeleteResponse>(
    `/v1/super-admin/users/${userId}`,
  );
  return data;
}

export function getAdminUserRoleLabel(role: string, roleOptions: RoleOption[] = []): string {
  const match = roleOptions.find((option) => option.value === role);
  if (match) {
    return match.label;
  }

  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'org_admin':
      return 'Organization Admin';
    case 'coach':
      return 'Coach';
    case 'player':
      return 'Player';
    default:
      return role;
  }
}

export function filterCreateRoleOptions(roleOptions: RoleOption[]): RoleOption[] {
  const filtered = roleOptions.filter((option) =>
    MANAGE_USER_CREATE_ROLES.includes(option.value as AdminUserRole),
  );

  if (filtered.length > 0) {
    return filtered;
  }

  return [
    { value: 'coach', label: 'Coach', description: 'Coach account' },
    { value: 'player', label: 'Player', description: 'Player account' },
  ];
}

export function canRemoveUser(user: AdminUserItem, currentUserId?: string | null): boolean {
  if (user.is_self) {
    return false;
  }

  if (currentUserId && user.id === currentUserId) {
    return false;
  }

  return true;
}
