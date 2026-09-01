import { getAuthToken } from '@/lib/auth-storage'
import { ApiError, type ApiErrorEnvelope } from '@/types/api'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api'

function resolveUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '')
  if (base.endsWith('/api') && path.startsWith('/api/')) {
    return `${base}${path.slice(4)}`
  }
  return `${base}${path}`
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data = (await response.json()) as ApiErrorEnvelope | { message?: string }
    if ('success' in data && data.success === false && 'error' in data) {
      return new ApiError(
        data.error.message,
        data.error.code,
        response.status,
        data.error.details,
      )
    }
    if ('message' in data && typeof data.message === 'string') {
      return new ApiError(data.message, 'UNKNOWN', response.status)
    }
  } catch {
    // fall through to generic error
  }
  return new ApiError(
    response.status === 401
      ? 'Invalid email or password. Please try again.'
      : `Request failed with status ${response.status}`,
    'HTTP_ERROR',
    response.status,
  )
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...rest } = options

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      ;(requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(resolveUrl(path), {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw await parseErrorResponse(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export type ListUnwrapKey = 'data' | 'items' | 'results'

export function unwrapListResponse<T>(
  body: unknown,
  listUnwrapKey: ListUnwrapKey,
): T {
  if (!body || typeof body !== 'object') {
    return body as T
  }

  const record = body as Record<string, unknown>
  if (listUnwrapKey in record) {
    return body as T
  }

  for (const envelopeKey of ['data', 'results'] as const) {
    const nested = record[envelopeKey]
    if (
      nested &&
      typeof nested === 'object' &&
      listUnwrapKey in (nested as Record<string, unknown>)
    ) {
      return nested as T
    }
  }

  return body as T
}

export { API_BASE_URL, resolveUrl }
