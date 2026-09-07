import type { PaginationMeta } from '@/types/api';
import { unwrapListResponse } from './endpoints';

export interface PaginatedListResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export function normalizePagination(
  partial: Partial<PaginationMeta> | undefined,
  fallbackPage: number,
  fallbackPageSize: number,
): PaginationMeta {
  const page = partial?.page ?? fallbackPage;
  const page_size = partial?.page_size ?? fallbackPageSize;
  const total = partial?.total ?? 0;
  const total_pages =
    partial?.total_pages ?? (page_size > 0 ? Math.ceil(total / page_size) : 0);
  const has_next = partial?.has_next ?? page < total_pages;
  const has_prev = partial?.has_prev ?? page > 1;

  return { page, page_size, total, total_pages, has_next, has_prev };
}

export function normalizePaginatedListResponse<T>(
  body: unknown,
  listUnwrapKey: string | null,
  fallbackPage: number,
  fallbackPageSize: number,
): PaginatedListResponse<T> {
  const unwrapped = unwrapListResponse<PaginatedListResponse<T> | T[]>(body, listUnwrapKey);

  if (Array.isArray(unwrapped)) {
    return {
      items: unwrapped,
      pagination: normalizePagination(
        {
          page: fallbackPage,
          page_size: fallbackPageSize,
          total: unwrapped.length,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
        fallbackPage,
        fallbackPageSize,
      ),
    };
  }

  if (
    unwrapped &&
    typeof unwrapped === 'object' &&
    'items' in unwrapped &&
    Array.isArray((unwrapped as PaginatedListResponse<T>).items)
  ) {
    const response = unwrapped as PaginatedListResponse<T>;
    return {
      items: response.items,
      pagination: normalizePagination(response.pagination, fallbackPage, fallbackPageSize),
    };
  }

  return {
    items: [],
    pagination: normalizePagination(undefined, fallbackPage, fallbackPageSize),
  };
}
