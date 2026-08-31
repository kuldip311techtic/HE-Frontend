import { ApiError, type ApiErrorEnvelope } from '@/types/api'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3300/api'

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '')
  if (path.startsWith('/api/') && base.endsWith('/api')) {
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
    const data = (await response.json()) as ApiErrorEnvelope
    return new ApiError(
      response.status,
      data.message || 'An unexpected error occurred',
      data.code,
      data.details,
    )
  } catch {
    return new ApiError(
      response.status,
      response.statusText || 'An unexpected error occurred',
    )
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...rest } = options

  const headers = new Headers(customHeaders)

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = localStorage.getItem('super_admin_token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers,
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
