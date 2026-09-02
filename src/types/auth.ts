export type UserRole =
  | 'super_admin'
  | 'organization_admin'
  | 'admin'
  | 'coach'
  | 'player';

export const ADMIN_ROLES: UserRole[] = [
  'super_admin',
  'organization_admin',
  'admin',
];

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: UserRole;
  roles?: UserRole[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface PaginationMeta {
  page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorBody {
  message?: string;
  detail?: string;
  error?: string | null;
  errors?: Record<string, string[]>;
}
