import type { PaginationMeta } from '@/types/api';
import type { UserRole } from '@/types/auth';

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export interface AdminUserItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  role: UserRole;
  roles: string[];
  description?: string | null;
  org_id: string | null;
  is_super_admin: boolean;
  is_active: boolean;
  is_self: boolean;
  last_sign_in_at: string | null;
  created_at: string | null;
}

export interface AdminUserListResponse {
  items: AdminUserItem[];
  pagination: PaginationMeta;
  roles: RoleOption[];
}

export interface AdminUserCreateRequest {
  first_name: string;
  last_name: string;
  name?: string | null;
  email: string;
  password: string;
  role: UserRole;
  org_id?: string | null;
}

export interface AdminUserUpdateRequest {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: UserRole | null;
  org_id?: string | null;
}

export interface AdminUserMutationResponse extends AdminUserItem {
  message: string;
}

export interface AdminUserDeleteResponse {
  message: string;
}

export interface AdminUserListParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: UserRole;
}
