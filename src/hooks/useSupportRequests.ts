import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, getApiErrorMessage } from '@/lib/api';
import { API_PATHS, unwrapListItems, withQuery } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import type {
  PaginationMeta,
  SupportRequestItem,
  SupportRequestListResponse,
  SupportRequestMutationResponse,
  SupportRequestRespondRequest,
} from '@/types/api';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

export const SUPPORT_ACTIONS_UNAVAILABLE = 'Responding and closing are not available yet.';

function rethrowSupportAction(err: unknown): never {
  if (err instanceof ApiError && (err.status === 404 || err.status === 405 || err.status === 501)) {
    throw new Error(SUPPORT_ACTIONS_UNAVAILABLE);
  }
  throw err;
}

export function useSupportRequests(page: number, pageSize: number, search: string) {
  const [items, setItems] = useState<SupportRequestItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (isDevBypassToken(getSession()?.token)) {
      setItems([]);
      setPagination({ ...EMPTY_PAGINATION, page, page_size: pageSize });
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.get<SupportRequestListResponse>(
        withQuery(API_PATHS.supportRequests, {
          page,
          page_size: pageSize,
          search: search || undefined,
        }),
      );
      setItems(unwrapListItems<SupportRequestItem>(response));
      setPagination(response.pagination ?? { ...EMPTY_PAGINATION, page, page_size: pageSize });
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, 'Unable to load support requests. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const respond = useCallback(async (body: SupportRequestRespondRequest) => {
    try {
      const response = await api.post<SupportRequestMutationResponse>(
        '/api/super-admin/support-requests',
        body,
      );
      await load();
      return response;
    } catch (err) {
      rethrowSupportAction(err);
    }
  }, [load]);

  const close = useCallback(async (id: string) => {
    try {
      const response = await api.put<SupportRequestMutationResponse>(
        '/api/super-admin/support-requests/{id}'.replace('{id}', id),
      );
      await load();
      return response;
    } catch (err) {
      rethrowSupportAction(err);
    }
  }, [load]);

  return { items, pagination, isLoading, error, reload: load, respond, close };
}
