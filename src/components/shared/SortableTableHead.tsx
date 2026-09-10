import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableTableHeadProps {
  label: string;
  sortKey: string;
  activeSortKey: string | null;
  direction: SortDirection;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableTableHead({
  label,
  sortKey,
  activeSortKey,
  direction,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isActive = activeSortKey === sortKey;
  const ariaSort = !isActive || !direction ? 'none' : direction === 'asc' ? 'ascending' : 'descending';

  return (
    <TableHead scope="col" className={className} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        {label}
        {!isActive || !direction ? (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
        ) : direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </TableHead>
  );
}
