import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
  { value: '50', label: '50 / page' },
];

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  disabled?: boolean;
}

function getVisiblePages(page: number, totalPages: number): number[] {
  const safeTotal = Math.max(1, totalPages);
  if (safeTotal <= 5) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(page - 2, safeTotal - 4));
  const end = Math.min(safeTotal, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  disabled = false,
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems);
  const visiblePages = getVisiblePages(page, safeTotal);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="font-lato text-body-sm text-[#445154]">
          {totalItems === 0 ? '0 results' : `${start}–${end} of ${totalItems}`}
        </p>
        {onPageSizeChange ? (
          <Select
            aria-label="Rows per page"
            className="h-9 w-[120px] text-body-sm"
            options={PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled}
          />
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        {visiblePages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant={pageNumber === page ? 'brand' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            disabled={disabled}
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= safeTotal}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
