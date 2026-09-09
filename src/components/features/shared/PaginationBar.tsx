import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants';
import type { PaginationMeta } from '@/types/api';

interface PaginationBarProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PaginationBar({ pagination, onPageChange, onPageSizeChange }: PaginationBarProps) {
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.page_size + 1;
  const end = Math.min(pagination.page * pagination.page_size, pagination.total);

  return (
    <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body-sm text-muted-foreground">
        {start}–{end} of {pagination.total}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-body-sm text-muted-foreground">
          Rows
          <Select
            value={String(pagination.page_size)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            aria-label="Rows per page"
            className="h-11 w-[88px]"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </label>
        <Pagination
          page={pagination.page}
          totalPages={pagination.total_pages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
