import type { PaginationMeta } from '@/types/pagination';

export interface SuperAdminUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  is_self: boolean;
  is_active?: boolean;
}

export interface SuperAdminUserListResponse {
  items: SuperAdminUser[];
  pagination: PaginationMeta;
}

export interface SuperAdminUserCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface SuperAdminUserUpdateRequest {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface SuperAdminUserMutationResponse {
  message: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  roles: string[];
  is_active: boolean;
  is_self: boolean;
}
