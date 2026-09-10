export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export function nextSortState(current: SortState | null, key: string): SortState | null {
  if (!current || current.key !== key) {
    return { key, direction: 'asc' };
  }
  if (current.direction === 'asc') {
    return { key, direction: 'desc' };
  }
  return null;
}

export function compareValues(left: unknown, right: unknown): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right);
  }

  const leftText = String(left);
  const rightText = String(right);
  const leftTime = Date.parse(leftText);
  const rightTime = Date.parse(rightText);
  const looksLikeDate =
    /^\d{4}-\d{2}-\d{2}/.test(leftText) && /^\d{4}-\d{2}-\d{2}/.test(rightText);
  if (looksLikeDate && !Number.isNaN(leftTime) && !Number.isNaN(rightTime)) {
    return leftTime - rightTime;
  }

  return leftText.localeCompare(rightText, undefined, { numeric: true, sensitivity: 'base' });
}

export function sortCollection<T>(
  rows: T[],
  sort: SortState | null,
  getValue: (row: T, key: string) => unknown,
): T[] {
  if (!sort) return rows;
  const copy = [...rows];
  copy.sort((a, b) => {
    const result = compareValues(getValue(a, sort.key), getValue(b, sort.key));
    return sort.direction === 'asc' ? result : -result;
  });
  return copy;
}
