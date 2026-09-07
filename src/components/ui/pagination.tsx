import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/api';
import { cn } from '@/lib/utils/cn';

interface TablePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  appearance?: 'default' | 'admin';
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

export function TablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
  appearance = 'default',
}: TablePaginationProps) {
  const { page, page_size, total, total_pages, has_prev, has_next } = pagination;
  const rangeStart = total === 0 ? 0 : (page - 1) * page_size + 1;
  const rangeEnd = Math.min(page * page_size, total);
  const pages = getPageNumbers(page, total_pages);
  const isAdmin = appearance === 'admin';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between',
        isAdmin && 'border-[var(--figma-hex-border)]',
        className,
      )}
    >
      <p className="font-outfit text-body-sm text-muted-foreground">
        {total === 0 ? '0 results' : `${rangeStart}–${rangeEnd} of ${total}`}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-outfit text-body-sm text-muted-foreground">
          Rows
          <select
            value={page_size}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className={cn(
              isAdmin
                ? 'admin-field-select h-9 px-2'
                : 'h-9 rounded-lg border border-border bg-input px-2 font-outfit text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!has_prev}
            onClick={() => onPageChange(page - 1)}
            className={isAdmin ? 'admin-outline-btn' : undefined}
          >
            Previous
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
                variant={item === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
                className={
                  isAdmin ? (item === page ? 'admin-primary-btn' : 'admin-outline-btn') : undefined
                }
              >
                {item}
              </Button>
            ),
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!has_next}
            onClick={() => onPageChange(page + 1)}
            className={isAdmin ? 'admin-outline-btn' : undefined}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
