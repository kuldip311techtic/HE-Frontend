import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { API_PATHS, isIdentifiedItem, unwrapListItems, withQuery } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import type { PaginationMeta, SupportRequestItem, SupportRequestListResponse } from '@/types/api';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

export const SUPPORT_ACTIONS_UNAVAILABLE = 'Responding and closing are not available yet.';

function isSupportRequestItem(value: unknown): value is SupportRequestItem {
  return isIdentifiedItem(value) && typeof value.subject === 'string';
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
      setItems(unwrapListItems(response, isSupportRequestItem));
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

  return { items, pagination, isLoading, error, reload: load };
}
