import { getAuthToken } from '@/lib/auth'

export interface ApiErrorDetail {
  field: string
  message: string
}

export interface ApiErrorEnvelope {
  success: boolean
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
  }
}

export class ApiError extends Error {
  code: string
  status: number
  details: ApiErrorDetail[]

  constructor(
    message: string,
    code: string,
    status: number,
    details: ApiErrorDetail[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  if (record.error === null) return false
  if (typeof record.error !== 'object' || record.error === null) return false
  const error = record.error as Record<string, unknown>
  return typeof error.message === 'string'
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api'
}

export function resolveApiPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = getApiBaseUrl().replace(/\/$/, '')

  if (
    normalized.startsWith('/api') &&
    (base.endsWith('/api') || base.endsWith('/api/'))
  ) {
    return normalized.slice(4) || '/'
  }

  return normalized
}

export function unwrapList<T>(
  payload: unknown,
  key: 'items' | 'data' | 'results',
): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (typeof payload !== 'object' || payload === null) return []

  const record = payload as Record<string, unknown>
  const nested = record[key]

  if (Array.isArray(nested)) return nested as T[]
  if (typeof nested === 'object' && nested !== null) {
    const nestedRecord = nested as Record<string, unknown>
    const inner = nestedRecord[key]
    if (Array.isArray(inner)) return inner as T[]
  }

  return []
}

async function parseErrorResponse(response: Response): Promise<{
  message: string
  code: string
  details: ApiErrorDetail[]
}> {
  try {
    const payload: unknown = await response.json()

    if (isApiErrorEnvelope(payload)) {
      return {
        message: payload.error.message,
        code: payload.error.code ?? 'UNKNOWN_ERROR',
        details: payload.error.details ?? [],
      }
    }

    if (typeof payload === 'object' && payload !== null) {
      const record = payload as Record<string, unknown>
      if (typeof record.message === 'string') {
        return {
          message: record.message,
          code: 'API_ERROR',
          details: [],
        }
      }
      if (typeof record.detail === 'string') {
        return {
          message: record.detail,
          code: 'API_ERROR',
          details: [],
        }
      }
    }
  } catch {
    // fall through to generic message
  }

  return {
    message: response.statusText || 'An unexpected error occurred',
    code: 'HTTP_ERROR',
    details: [],
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options
  const resolvedPath = resolveApiPath(path)

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${resolvedPath}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const { message, code, details } = await parseErrorResponse(response)
    throw new ApiError(message, code, response.status, details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return undefined as T
}
