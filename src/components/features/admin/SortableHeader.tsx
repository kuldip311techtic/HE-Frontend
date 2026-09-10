import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import type { SortState } from '@/lib/sort';
import { cn } from '@/lib/utils';

interface SortableHeaderProps {
  label: string;
  columnKey: string;
  sort: SortState | null;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({ label, columnKey, sort, onSort, className }: SortableHeaderProps) {
  const isActive = sort?.key === columnKey;
  const ariaSort = !isActive ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending';

  return (
    <TableHead className={className} aria-sort={ariaSort}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1 rounded-md font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        onClick={() => onSort(columnKey)}
        aria-label={`Sort By ${label}`}
      >
        <span>{label}</span>
        {!isActive ? <ArrowUpDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" /> : null}
        {isActive && sort.direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
        {isActive && sort.direction === 'desc' ? (
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
      </button>
    </TableHead>
  );
}
