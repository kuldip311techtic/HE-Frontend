import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function buildPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let pageNum = currentPage - 1; pageNum <= currentPage + 1; pageNum += 1) {
    if (pageNum >= 1 && pageNum <= totalPages) {
      pages.add(pageNum);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  let previous = 0;
  for (const pageNum of sorted) {
    if (pageNum - previous > 1) {
      result.push('ellipsis');
    }
    result.push(pageNum);
    previous = pageNum;
  }
  return result;
}

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hidePageSize?: boolean;
  className?: string;
}

export function PaginationControls({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  hidePageSize = false,
  className,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground',
        className,
      )}
    >
      <p>
        {start}–{end} of {totalItems}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {!hidePageSize ? (
          <label className="flex items-center gap-2">
            <span className="sr-only">Page Size</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Page Size"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} / Page
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <nav aria-label="Pagination" className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1" aria-hidden="true">
                …
              </span>
            ) : (
              <Button
                key={pageNum}
                type="button"
                variant={pageNum === page ? 'default' : 'outline'}
                size="sm"
                className="min-w-9"
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === page ? 'page' : undefined}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ),
          )}
        </nav>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
