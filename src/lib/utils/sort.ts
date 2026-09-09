export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: string | null;
  direction: SortDirection | null;
}

function isIsoDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
}

function toComparable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(String).join(', ');
  return value;
}

export function compareValues(left: unknown, right: unknown, direction: SortDirection): number {
  const mul = direction === 'asc' ? 1 : -1;
  const a = toComparable(left);
  const b = toComparable(right);
  const aNull = a === null || a === undefined || a === '';
  const bNull = b === null || b === undefined || b === '';
  if (aNull && bNull) return 0;
  if (aNull) return 1;
  if (bNull) return -1;

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return (Number(a) - Number(b)) * mul;
  }

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * mul;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    const aNum = Number(a);
    const bNum = Number(b);
    if (a.trim() !== '' && b.trim() !== '' && Number.isFinite(aNum) && Number.isFinite(bNum)) {
      return (aNum - bNum) * mul;
    }
    if (isIsoDateString(a) && isIsoDateString(b)) {
      return (Date.parse(a) - Date.parse(b)) * mul;
    }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) * mul;
  }

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * mul;
}

export function cycleSort(current: SortState, column: string): SortState {
  if (current.column !== column) {
    return { column, direction: 'asc' };
  }
  if (current.direction === 'asc') {
    return { column, direction: 'desc' };
  }
  return { column: null, direction: null };
}
