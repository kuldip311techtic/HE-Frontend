export interface ApiErrorDetail {
  field: string
  message: string
}

export interface ApiErrorEnvelope {
  success: false
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
  }
}

export class ApiError extends Error {
  readonly code: string
  readonly details?: ApiErrorDetail[]
  readonly status: number

  constructor(
    message: string,
    code: string,
    status: number,
    details?: ApiErrorDetail[],
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
