import type { PaginationMeta } from '@/types/api';

export type UserRole = 'Coach' | 'Player';

const USER_ROLES: UserRole[] = ['Coach', 'Player'];

export function parseUserRole(value: string | undefined | null): UserRole {
  if (value === 'Coach' || value === 'Player') {
    return value;
  }
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'coach') return 'Coach';
  if (normalized === 'player') return 'Player';
  return 'Coach';
}

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  role: UserRole | string;
  roles?: string[];
  is_self?: boolean;
  is_active?: boolean;
  created_at?: string | null;
}

export interface UserListResponse {
  items: UserItem[];
  pagination: PaginationMeta;
}

export interface UserListParams {
  page?: number;
  page_size?: number;
  search?: string | null;
  role?: UserRole | string | null;
}

export interface UserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserMutationResponse extends UserItem {
  message: string;
}

export interface UserDeleteResponse {
  message: string;
}

export function displayUserName(
  user: Pick<UserItem, 'first_name' | 'last_name' | 'name'>,
): string {
  if (user.name?.trim()) {
    return user.name.trim();
  }
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || '—';
}

export function isOwnUserAccount(
  user: Pick<UserItem, 'id' | 'is_self'>,
  currentUserId?: string | null,
): boolean {
  if (user.is_self === true) {
    return true;
  }
  return currentUserId != null && user.id === currentUserId;
}
