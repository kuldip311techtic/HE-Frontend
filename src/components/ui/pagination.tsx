import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function pageItems(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push('ellipsis');
  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }
  if (end < totalPages - 1) items.push('ellipsis');
  items.push(totalPages);
  return items;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = pageItems(page, Math.max(totalPages, 1));
  const previousDisabled = page <= 1;
  const nextDisabled = page >= totalPages || totalPages <= 1;

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 min-h-12 min-w-12"
        disabled={previousDisabled}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Button>
      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant={item === page ? 'brand' : 'outline'}
            size="icon"
            className="h-12 w-12 min-h-12 min-w-12"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 min-h-12 min-w-12"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>
    </nav>
  );
}
