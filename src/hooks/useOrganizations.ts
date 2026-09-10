import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { API_PATHS, unwrapListItems, withQuery } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import type {
  OrganizationCreateRequest,
  OrganizationDeleteResponse,
  OrganizationItem,
  OrganizationListResponse,
  OrganizationMutationResponse,
  OrganizationUpdateRequest,
  PaginationMeta,
} from '@/types/api';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

export function useOrganizations(page: number, pageSize: number, search: string) {
  const [items, setItems] = useState<OrganizationItem[]>([]);
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
      const response = await api.get<OrganizationListResponse>(
        withQuery(API_PATHS.organizations, {
          page,
          page_size: pageSize,
          search: search || undefined,
        }),
      );
      setItems(unwrapListItems<OrganizationItem>(response));
      setPagination(response.pagination ?? { ...EMPTY_PAGINATION, page, page_size: pageSize });
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, 'Unable to load organizations. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (body: OrganizationCreateRequest) => {
    const response = await api.post<OrganizationMutationResponse>(API_PATHS.organizations, body);
    await load();
    return response;
  }, [load]);

  const update = useCallback(
    async (organization_id: string, body: OrganizationUpdateRequest) => {
      const response = await api.put<OrganizationMutationResponse>(
        '/api/v1/super-admin/organizations/{organization_id}'.replace('{organization_id}', organization_id),
        body,
      );
      await load();
      return response;
    },
    [load],
  );

  const remove = useCallback(
    async (organization_id: string) => {
      const response = await api.delete<OrganizationDeleteResponse>(
        '/api/v1/super-admin/organizations/{organization_id}'.replace('{organization_id}', organization_id),
      );
      await load();
      return response;
    },
    [load],
  );

  return { items, pagination, isLoading, error, reload: load, create, update, remove };
}
