import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PAGE_SIZE, DEFAULT_SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { parsePositiveInt } from '@/lib/utils/params';
import { useDebounce } from '@/hooks/useDebounce';

interface UseListQueryOptions {
  extraKeys?: string[];
}

const EMPTY_EXTRA_KEYS: string[] = [];

export function useListQuery(options: UseListQueryOptions = {}) {
  const extraKeySignature = (options.extraKeys ?? EMPTY_EXTRA_KEYS).join('|');
  const extraKeys = React.useMemo(
    () => extraKeySignature.split('|').filter(Boolean),
    [extraKeySignature],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(searchParams.get('page_size'), DEFAULT_PAGE_SIZE);
  const urlSearch = searchParams.get('search') ?? '';
  const [searchInput, setSearchInput] = React.useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, DEFAULT_SEARCH_DEBOUNCE_MS);

  React.useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const extras = React.useMemo(() => {
    const result: Record<string, string> = {};
    for (const key of extraKeys) {
      const value = searchParams.get(key);
      if (value) result[key] = value;
    }
    return result;
  }, [extraKeys, searchParams]);

  const updateParams = React.useCallback(
    (patch: Record<string, string | number | undefined>, resetPage = false) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      if (resetPage) {
        next.set('page', '1');
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  React.useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    updateParams({ search: debouncedSearch || undefined }, true);
  }, [debouncedSearch, urlSearch, updateParams]);

  const setPage = React.useCallback(
    (nextPage: number) => updateParams({ page: nextPage }),
    [updateParams],
  );

  const setPageSize = React.useCallback(
    (nextSize: number) => updateParams({ page_size: nextSize, page: 1 }),
    [updateParams],
  );

  const setExtra = React.useCallback(
    (key: string, value: string | undefined) => updateParams({ [key]: value }, true),
    [updateParams],
  );

  return {
    page,
    pageSize,
    searchInput,
    setSearchInput,
    search: debouncedSearch,
    extras,
    setPage,
    setPageSize,
    setExtra,
  };
}
