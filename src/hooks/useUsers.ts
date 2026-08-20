import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { queryKeys } from '../lib/api/queryKeys';
import type { PaginatedUsers } from '../types/user';

const DEFAULT_PAGE_SIZE = 10;

async function fetchUsers(
  page: number,
  pageSize: number,
): Promise<PaginatedUsers> {
  const { data } = await apiClient.get<PaginatedUsers>('/users', {
    params: { page, page_size: pageSize },
  });

  return data;
}

export function useUsers(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const query = useQuery({
    queryKey: queryKeys.users.list(page, pageSize),
    queryFn: () => fetchUsers(page, pageSize),
  });

  return {
    users: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? pageSize,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
