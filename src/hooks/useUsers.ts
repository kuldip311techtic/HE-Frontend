import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { API_PATHS, unwrapListItems, withQuery } from '@/lib/api/endpoints';
import { getSession, isDevBypassToken } from '@/lib/auth/session';
import type {
  AdminUserCreateRequest,
  AdminUserDeleteResponse,
  AdminUserItem,
  AdminUserListResponse,
  AdminUserMutationResponse,
  AdminUserUpdateRequest,
  PaginationMeta,
  RoleOption,
} from '@/types/api';

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

export function useUsers(page: number, pageSize: number, search: string, role: string) {
  const [items, setItems] = useState<AdminUserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);
  const [roles, setRoles] = useState<RoleOption[]>([]);
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
      const response = await api.get<AdminUserListResponse>(
        withQuery(API_PATHS.users, {
          page,
          page_size: pageSize,
          search: search || undefined,
          role: role || undefined,
        }),
      );
      setItems(unwrapListItems<AdminUserItem>(response));
      setPagination(response.pagination ?? { ...EMPTY_PAGINATION, page, page_size: pageSize });
      setRoles(response.roles ?? []);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, 'Unable to load users. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, role]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (body: AdminUserCreateRequest) => {
    const response = await api.post<AdminUserMutationResponse>(API_PATHS.users, body);
    await load();
    return response;
  }, [load]);

  const update = useCallback(
    async (user_id: string, body: AdminUserUpdateRequest) => {
      const response = await api.put<AdminUserMutationResponse>(
        '/api/v1/super-admin/users/{user_id}'.replace('{user_id}', user_id),
        body,
      );
      await load();
      return response;
    },
    [load],
  );

  const remove = useCallback(
    async (user_id: string) => {
      const response = await api.delete<AdminUserDeleteResponse>(
        '/api/v1/super-admin/users/{user_id}'.replace('{user_id}', user_id),
      );
      await load();
      return response;
    },
    [load],
  );

  return { items, pagination, roles, isLoading, error, reload: load, create, update, remove };
}
