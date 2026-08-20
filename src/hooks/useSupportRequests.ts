import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { queryKeys } from '../lib/api/queryKeys';
import type { PaginatedSupportRequests } from '../types/supportRequest';

const DEFAULT_PAGE_SIZE = 10;

async function fetchSupportRequests(
  page: number,
  pageSize: number,
): Promise<PaginatedSupportRequests> {
  const { data } = await apiClient.get<PaginatedSupportRequests>(
    '/support-requests',
    {
      params: { page, page_size: pageSize },
    },
  );

  return data;
}

export function useSupportRequests(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const query = useQuery({
    queryKey: queryKeys.supportRequests.list(page, pageSize),
    queryFn: () => fetchSupportRequests(page, pageSize),
  });

  return {
    supportRequests: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? pageSize,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
