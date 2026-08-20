export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  status: string;
  organization_id: string | null;
}

export interface UserEditPayload {
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  status: string;
  organization_id: string | null;
}

export interface UserAddPayload extends UserEditPayload {
  password: string;
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const USER_ROLES = [
  'super_admin',
  'admin',
  'coach',
  'player',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['active', 'inactive', 'pending'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export function formatUserRole(role: string): string {
  return role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
