export type UserRole = "Coach" | "Player";

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  role: string;
  roles: string[];
  role_code?: string;
  is_super_admin?: boolean;
  is_active: boolean;
  is_self?: boolean;
  org_id?: string | null;
  description?: string | null;
  last_sign_in_at?: string | null;
  created_at: string | null;
  updated_at?: string;
}

export interface UserPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface UserListData {
  items: User[];
  pagination: UserPagination;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  description: string;
  data: UserListData;
}

export interface UserListOpenApiResponse {
  items: User[];
  pagination: UserPagination;
  roles?: Array<{ value: string; label: string; description?: string }>;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
}

export interface UserMutationResponse {
  success: boolean;
  message: string;
  description: string;
  data: User;
}

export interface UserListParams {
  page?: number;
  page_size?: number;
}

export interface UserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}
