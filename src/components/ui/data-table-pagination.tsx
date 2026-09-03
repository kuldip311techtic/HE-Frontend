import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/api';

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

interface DataTablePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

function getPageRange(pagination: PaginationMeta): string {
  if (pagination.total === 0) {
    return '0–0 of 0';
  }

  const start = (pagination.page - 1) * pagination.page_size + 1;
  const end = Math.min(pagination.page * pagination.page_size, pagination.total);
  return `${start}–${end} of ${pagination.total}`;
}

function getVisiblePages(pagination: PaginationMeta): number[] {
  const { page, total_pages } = pagination;
  const pages: number[] = [];
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(total_pages, start + windowSize - 1);

  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1);
  }

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return pages;
}

export function DataTablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  className,
}: DataTablePaginationProps) {
  const visiblePages = getVisiblePages(pagination);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      aria-live="polite"
    >
      <p className="text-body-sm text-muted-foreground">{getPageRange(pagination)}</p>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={String(pagination.page_size)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[110px]" aria-label="Rows per page">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.has_prev}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          {visiblePages.map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === pagination.page ? 'default' : 'outline'}
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === pagination.page ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.has_next}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
