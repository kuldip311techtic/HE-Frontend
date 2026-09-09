import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { SortDirection } from '@/lib/utils/sort';

interface SortableTableHeadProps {
  label: string;
  column: string;
  activeColumn: string | null;
  direction: SortDirection;
  onSort: (column: string) => void;
  className?: string;
}

export function SortableTableHead({
  label,
  column,
  activeColumn,
  direction,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = activeColumn === column;
  const ariaSort = isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <th className={cn('h-12 px-4 text-left align-middle', className)} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1.5 font-lato text-body-sm font-medium text-figma-accent transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
        )}
      </button>
    </th>
  );
}
