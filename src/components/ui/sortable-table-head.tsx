import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';

export type SortDirection = 'asc' | 'desc';

interface SortableTableHeadProps<K extends string> {
  label: string;
  sortKey: K;
  activeSortKey: K;
  direction: SortDirection;
  onSort: (sortKey: K) => void;
  className?: string;
}

export function SortableTableHead<K extends string>({
  label,
  sortKey,
  activeSortKey,
  direction,
  onSort,
  className,
}: SortableTableHeadProps<K>) {
  const isActive = activeSortKey === sortKey;
  const SortIcon = isActive ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;

  const sortValue = isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <TableHead className={className} aria-sort={sortValue}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1 font-outfit text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive && 'text-foreground',
        )}
        aria-label={`Sort by ${label}`}
      >
        {label}
        <SortIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>
    </TableHead>
  );
}

export function getNextSortDirection<K extends string>(
  activeSortKey: K,
  sortKey: K,
  currentDirection: SortDirection,
): SortDirection {
  if (activeSortKey !== sortKey) {
    return 'asc';
  }
  return currentDirection === 'asc' ? 'desc' : 'asc';
}
