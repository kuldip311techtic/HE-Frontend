import type { SortDirection } from '@/components/shared/SortableTableHead';

export function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const factor = direction === 'asc' ? 1 : -1;

  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * factor;
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true }) * factor;
}

export function cycleSort(
  currentKey: string | null,
  currentDirection: SortDirection,
  nextKey: string,
): { key: string | null; direction: SortDirection } {
  if (currentKey !== nextKey) {
    return { key: nextKey, direction: 'asc' };
  }
  if (currentDirection === 'asc') {
    return { key: nextKey, direction: 'desc' };
  }
  if (currentDirection === 'desc') {
    return { key: null, direction: null };
  }
  return { key: nextKey, direction: 'asc' };
}
