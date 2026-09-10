import { useMemo, useState } from 'react';
import type { SortDirection } from '@/components/shared/SortableTableHead';
import { compareValues, cycleSort } from '@/lib/tableSort';

function sortValue<T extends object>(item: T, key: string): unknown {
  return (item as Record<string, unknown>)[key];
}

export function useSortablePage<T extends object>(
  items: T[],
  page: number,
  pageSize: number,
) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedItems = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return items;
    }
    return [...items].sort((a, b) =>
      compareValues(sortValue(a, sortKey), sortValue(b, sortKey), sortDirection),
    );
  }, [items, sortKey, sortDirection]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

  const handleSort = (key: string) => {
    const next = cycleSort(sortKey, sortDirection, key);
    setSortKey(next.key);
    setSortDirection(next.direction);
  };

  return {
    sortKey,
    sortDirection,
    handleSort,
    paginatedItems,
    totalItems: sortedItems.length,
  };
}
