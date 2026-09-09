export type SortDirection = 'asc' | 'desc';

export interface SortState<T extends string = string> {
  column: T | null;
  direction: SortDirection;
}

export function cycleSort<T extends string>(
  current: SortState<T>,
  column: T,
): SortState<T> {
  if (current.column !== column) {
    return { column, direction: 'asc' };
  }
  if (current.direction === 'asc') {
    return { column, direction: 'desc' };
  }
  return { column: null, direction: 'asc' };
}

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
}

export function sortByColumn<T>(
  items: T[],
  column: keyof T | null,
  direction: SortDirection,
): T[] {
  if (!column) return items;

  const sorted = [...items].sort((a, b) => {
    const result = compareValues(a[column], b[column]);
    return direction === 'asc' ? result : -result;
  });

  return sorted;
}
