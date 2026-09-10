import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import type { PaginationMeta } from '@/types/api';
import { PAGE_SIZE_OPTIONS } from '@/lib/format';

interface ResourcePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function visiblePages(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  const pages: number[] = [];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  if (!pages.includes(1)) pages.unshift(1);
  if (!pages.includes(total)) pages.push(total);
  return [...new Set(pages)].sort((a, b) => a - b);
}

export function ResourcePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: ResourcePaginationProps) {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.page_size + 1;
  const end = Math.min(pagination.page * pagination.page_size, pagination.total);
  const pages = visiblePages(pagination.page, Math.max(pagination.total_pages, 1));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {start}–{end} of {pagination.total}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Page Size</span>
          <NativeSelect
            aria-label="Page Size"
            className="h-9 w-[88px]"
            value={String(pagination.page_size)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Previous Page"
          disabled={!pagination.has_prev}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          return (
            <span key={page} className="flex items-center gap-2">
              {previous && page - previous > 1 ? (
                <span className="text-sm text-muted-foreground" aria-hidden="true">
                  …
                </span>
              ) : null}
              <Button
                type="button"
                variant={page === pagination.page ? 'default' : 'outline'}
                size="sm"
                aria-label={`Page ${page}`}
                aria-current={page === pagination.page ? 'page' : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </span>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Next Page"
          disabled={!pagination.has_next}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
