import { useCallback, useMemo, useState } from 'react';
import { getNextSortDirection, type SortDirection } from '@/components/ui/sortable-table-head';

interface UseTableSortOptions {
  /**
   * When false, sorting is disabled. Pass false for server-paginated lists where
   * total records exceed the loaded page; pair with a table banner and disabled
   * sort headers (see UsersTable / SupportRequestsTable).
   */
  enabled?: boolean;
}

/**
 * Client-side table sort for in-memory row arrays. For server-paginated data where
 * total exceeds the current page, pass `{ enabled: false }`, disable SortableTableHead
 * controls, and show banner copy such as "Column sorting is unavailable while
 * results are paginated." (AdminUsersPage / AdminSupportPage pattern).
 */
export function useTableSort<T, K extends string>(
  rows: T[],
  compareFn: (a: T, b: T, sortKey: K) => number,
  options: UseTableSortOptions = {},
) {
  const { enabled = true } = options;
  const [sortKey, setSortKey] = useState<K | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  const sortedRows = useMemo(() => {
    if (!enabled || sortKey === null || sortDirection === 'none') {
      return rows;
    }
    const sorted = [...rows].sort((a, b) => compareFn(a, b, sortKey));
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [rows, sortKey, sortDirection, compareFn, enabled]);

  const handleSort = useCallback(
    (nextSortKey: K) => {
      if (!enabled) {
        return;
      }
      const nextDirection = getNextSortDirection(sortKey, nextSortKey, sortDirection);
      if (nextDirection === 'none') {
        setSortKey(null);
        setSortDirection('none');
        return;
      }
      setSortKey(nextSortKey);
      setSortDirection(nextDirection);
    },
    [sortKey, sortDirection, enabled],
  );

  return { sortKey, sortDirection, sortedRows, handleSort, sortEnabled: enabled };
}
