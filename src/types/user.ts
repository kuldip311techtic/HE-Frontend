export type UserRole = "Coach" | "Player";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  role_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListData {
  items: User[];
  page: number;
  limit: number;
  total: number;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  description: string;
  data: UserListData;
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
  limit?: number;
}

export interface UserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}
