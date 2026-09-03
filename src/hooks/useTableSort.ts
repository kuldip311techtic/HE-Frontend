import { useCallback, useMemo, useState } from 'react';
import { getNextSortDirection, type SortDirection } from '@/components/ui/sortable-table-head';

export function useTableSort<T, K extends string>(
  rows: T[],
  compareFn: (a: T, b: T, sortKey: K) => number,
  defaultSortKey: K,
) {
  const [sortKey, setSortKey] = useState<K>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => compareFn(a, b, sortKey));
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [rows, sortKey, sortDirection, compareFn]);

  const handleSort = useCallback(
    (nextSortKey: K) => {
      setSortDirection(getNextSortDirection(sortKey, nextSortKey, sortDirection));
      setSortKey(nextSortKey);
    },
    [sortKey, sortDirection],
  );

  return { sortKey, sortDirection, sortedRows, handleSort };
}
