import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorMessage } from "@/components/ui/feedback";
import { TablePagination, type PaginationState } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filterLabel?: string;
  filterOptions?: { label: string; value: string }[];
  filterFn?: (row: T, filterValue: string) => boolean;
  primaryAction?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  error = null,
  onRetry,
  searchPlaceholder = "Search…",
  searchKeys = [],
  filterLabel = "Status",
  filterOptions,
  filterFn,
  primaryAction,
  emptyTitle = "No records found",
  emptyDescription,
  emptyAction,
  pagination,
  onPageChange,
  onPageSizeChange,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRows = useMemo(() => {
    let rows = data;

    if (search.trim() && searchKeys.length > 0) {
      const query = search.trim().toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key];
          return String(value ?? "")
            .toLowerCase()
            .includes(query);
        }),
      );
    }

    if (filter !== "all" && filterFn) {
      rows = rows.filter((row) => filterFn(row, filter));
    }

    return rows;
  }, [data, filter, filterFn, search, searchKeys]);

  const paginatedRows = useMemo(() => {
    if (!pagination) return filteredRows;

    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredRows.slice(start, start + pagination.pageSize);
  }, [filteredRows, pagination]);

  const effectivePagination: PaginationState | undefined = pagination
    ? { ...pagination, total: filteredRows.length }
    : undefined;

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
        <div className="relative min-w-0 flex-1 md:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 bg-background pl-9"
            aria-label={searchPlaceholder}
          />
        </div>

        {filterOptions && filterOptions.length > 0 && (
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-full shrink-0 bg-background md:w-[160px]">
              <SelectValue placeholder={filterLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filterLabel.toLowerCase()}</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {primaryAction && (
          <div className="flex shrink-0 md:ml-auto">{primaryAction}</div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "h-10 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className="px-3 py-2">
                      <Skeleton className="h-4 w-full max-w-[12rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && error && (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-3 py-6">
                  <ErrorMessage message={error} onRetry={onRetry} />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !error && paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-3 py-2">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    className="py-8"
                  />
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !error &&
              paginatedRows.map((row, index) => (
                <TableRow key={index} className="h-11">
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn("px-3 py-2 text-sm", column.className)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {effectivePagination &&
          onPageChange &&
          onPageSizeChange && (
            <div className="border-t border-border px-3 py-2">
              <TablePagination
                pagination={effectivePagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          )}
      </div>
    </div>
  );
}
