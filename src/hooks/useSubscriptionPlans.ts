import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { unwrapListItems, withQuery } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import { isRecord } from '@/lib/isRecord';
import type {
  PaginationMeta,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanDeleteResponse,
  SubscriptionPlanItem,
  SubscriptionPlanMutationResponse,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/api';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

function paginationFromPayload(payload: unknown, page: number, pageSize: number, itemCount: number): PaginationMeta {
  if (isRecord(payload) && isRecord(payload.pagination)) {
    const meta = payload.pagination;
    return {
      page: typeof meta.page === 'number' ? meta.page : page,
      page_size: typeof meta.page_size === 'number' ? meta.page_size : pageSize,
      total: typeof meta.total === 'number' ? meta.total : itemCount,
      total_pages: typeof meta.total_pages === 'number' ? meta.total_pages : 1,
      has_next: Boolean(meta.has_next),
      has_prev: Boolean(meta.has_prev),
    };
  }
  return { ...EMPTY_PAGINATION, page, page_size: pageSize, total: itemCount };
}

export function useSubscriptionPlans(
  role: SubscriptionPlanRole,
  page: number,
  pageSize: number,
  status: string,
) {
  const [items, setItems] = useState<SubscriptionPlanItem[]>([]);
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
      const response = await api.get<unknown>(
        withQuery('/api/super-admin/subscriptions', {
          role,
          page,
          page_size: pageSize,
          status: status || undefined,
        }),
      );
      const nextItems = unwrapListItems<SubscriptionPlanItem>(response);
      setItems(nextItems);
      setPagination(paginationFromPayload(response, page, pageSize, nextItems.length));
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, 'Unable to load subscription plans. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [role, page, pageSize, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (body: SubscriptionPlanCreateRequest) => {
      const response = await api.post<SubscriptionPlanMutationResponse>(
        '/api/super-admin/subscriptions',
        body,
      );
      await load();
      return response;
    },
    [load],
  );

  const update = useCallback(
    async (id: string, body: SubscriptionPlanUpdateRequest, planRole: SubscriptionPlanRole) => {
      const response = await api.put<SubscriptionPlanMutationResponse>(
        withQuery('/api/super-admin/subscriptions/{id}'.replace('{id}', id), { role: planRole }),
        body,
      );
      await load();
      return response;
    },
    [load],
  );

  const remove = useCallback(
    async (id: string, planRole: SubscriptionPlanRole, replacementPlanId?: string) => {
      const response = await api.delete<SubscriptionPlanDeleteResponse>(
        withQuery('/api/super-admin/subscriptions/{id}'.replace('{id}', id), {
          role: planRole,
          replacement_plan_id: replacementPlanId,
        }),
      );
      await load();
      return response;
    },
    [load],
  );

  return { items, pagination, isLoading, error, reload: load, create, update, remove };
}
