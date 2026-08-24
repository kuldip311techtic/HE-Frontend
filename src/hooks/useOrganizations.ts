import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api/client';
import { queryKeys } from '../lib/api/queryKeys';
import {
  ORGANIZATIONS_API_PATH,
  type PaginatedOrganizations,
} from '../types/organization';

const DEFAULT_PAGE_SIZE = 10;

async function fetchOrganizations(
  page: number,
  pageSize: number,
): Promise<PaginatedOrganizations> {
  const { data } = await apiClient.get<PaginatedOrganizations>(
    ORGANIZATIONS_API_PATH,
    {
      params: { page, page_size: pageSize },
    },
  );

  return data;
}

export function useOrganizations(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const query = useQuery({
    queryKey: queryKeys.organizations.list(page, pageSize),
    queryFn: () => fetchOrganizations(page, pageSize),
  });

  return {
    organizations: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? pageSize,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
