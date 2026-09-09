import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  label: string;
  direction: SortDirection;
  onToggle: () => void;
  className?: string;
}

export function SortableHeader({ label, direction, onToggle, className }: SortableHeaderProps) {
  const ariaSort =
    direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none';

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 text-left font-outfit text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand',
        className,
      )}
      onClick={onToggle}
      aria-sort={ariaSort}
    >
      <span>{label}</span>
      {direction === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      ) : direction === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
      )}
    </button>
  );
}

export function cycleSortDirection(current: SortDirection): SortDirection {
  if (current === null) return 'asc';
  if (current === 'asc') return 'desc';
  return null;
}
