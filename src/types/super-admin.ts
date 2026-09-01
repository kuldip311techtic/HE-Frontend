export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  access_token?: string
  message?: string
}

export interface SuperAdminUser {
  id: string
  first_name: string | null
  last_name: string | null
  name: string
  email: string
  role: string
  roles: string[]
  description: string | null
  org_id: string | null
  is_super_admin: boolean
  is_active: boolean
  is_self: boolean
  last_sign_in_at: string | null
  created_at: string | null
}

export interface ListUsersParams {
  page?: number
  page_size?: number
}

export interface UserRoleOption {
  value: string
  label: string
  description: string
}

export interface ListUsersResponse {
  items: SuperAdminUser[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
  roles?: UserRoleOption[]
}

export interface CreateUserRequest {
  first_name: string
  last_name: string
  name?: string | null
  email: string
  password: string
  role: string
  org_id?: string | null
}

export interface UpdateUserRequest {
  first_name?: string | null
  last_name?: string | null
  name?: string | null
  email?: string | null
  password?: string | null
  role?: string | null
  org_id?: string | null
}

export interface UserMutationResponse extends SuperAdminUser {
  message: string
}

export interface DeleteUserResponse {
  message: string
}

export interface SuperAdminDashboardResponse {
  total_organizations: number
  total_coaches: number
  total_players: number
  total_sessions: number
  active_subscriptions: number
  revenue_overview: number
}
