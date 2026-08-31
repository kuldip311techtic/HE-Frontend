export interface ApiErrorEnvelope {
  code: string
  message: string
  details?: unknown[]
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly details?: unknown[]

  constructor(status: number, message: string, code?: string, details?: unknown[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  name: string
  email: string
  role: string
  roles: string[]
  is_self: boolean
}

export interface Pagination {
  page: number
  total: number
}

export interface UsersListResponse {
  items: User[]
  pagination: Pagination
}

export interface CreateUserRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  email?: string
  role?: string
}

export interface CreateUserResponse {
  message: string
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  roles: string[]
  is_active: boolean
  is_self: boolean
}

export interface SuperAdminDashboardResponse {
  total_organizations: number
  total_coaches: number
  total_players: number
  total_sessions: number
  active_subscriptions: number
  revenue_overview: number
  description: string | null
  link: string | null
  error: string | null
}
