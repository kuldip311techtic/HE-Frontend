import { useCallback, useMemo, useState } from 'react';
import { getNextSortDirection, type SortDirection } from '@/components/ui/sortable-table-head';

export function useTableSort<T, K extends string>(
  rows: T[],
  compareFn: (a: T, b: T, sortKey: K) => number,
) {
  const [sortKey, setSortKey] = useState<K | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  const sortedRows = useMemo(() => {
    if (sortKey === null || sortDirection === 'none') {
      return rows;
    }
    const sorted = [...rows].sort((a, b) => compareFn(a, b, sortKey));
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [rows, sortKey, sortDirection, compareFn]);

  const handleSort = useCallback(
    (nextSortKey: K) => {
      const nextDirection = getNextSortDirection(sortKey, nextSortKey, sortDirection);
      if (nextDirection === 'none') {
        setSortKey(null);
        setSortDirection('none');
        return;
      }
      setSortKey(nextSortKey);
      setSortDirection(nextDirection);
    },
    [sortKey, sortDirection],
  );

  return { sortKey, sortDirection, sortedRows, handleSort };
}
