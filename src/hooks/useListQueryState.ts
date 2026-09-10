import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/lib/format';

function parsePageSize(raw: string | null): number {
  const value = Number(raw);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value) ? value : DEFAULT_PAGE_SIZE;
}

function parsePage(raw: string | null): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

export function useListQueryState() {
  const [params, setParams] = useSearchParams();

  const page = parsePage(params.get('page'));
  const pageSize = parsePageSize(params.get('page_size'));
  const search = params.get('search') ?? '';
  const role = params.get('role') ?? '';
  const status = params.get('status') ?? '';

  const setQuery = useCallback(
    (patch: {
      page?: number;
      page_size?: number;
      search?: string;
      role?: string;
      status?: string;
    }) => {
      const next = new URLSearchParams(params);
      const apply = (key: string, value: string | number | undefined) => {
        if (value === undefined) return;
        const text = String(value);
        if (text === '' || (key === 'page' && text === '1') || (key === 'page_size' && text === String(DEFAULT_PAGE_SIZE))) {
          next.delete(key);
          return;
        }
        next.set(key, text);
      };
      apply('page', patch.page);
      apply('page_size', patch.page_size);
      apply('search', patch.search);
      apply('role', patch.role);
      apply('status', patch.status);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  return useMemo(
    () => ({
      page,
      pageSize,
      search,
      role,
      status,
      setQuery,
    }),
    [page, pageSize, search, role, status, setQuery],
  );
}
