import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
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

export type SortDirection = "asc" | "desc";

export interface DataTableSortState {
  columnId: string;
  direction: SortDirection;
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  getSortValue?: (row: T) => string | number | null | undefined;
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
  serverPagination?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  toolbarFilters?: ReactNode;
  searchInputClassName?: string;
  sort?: DataTableSortState | null;
  onSortChange?: (sort: DataTableSortState | null) => void;
  className?: string;
}

function compareSortValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  direction: SortDirection,
): number {
  const factor = direction === "asc" ? 1 : -1;

  if (a == null && b == null) return 0;
  if (a == null) return 1 * factor;
  if (b == null) return -1 * factor;

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * factor;
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  }) * factor;
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
  serverPagination = false,
  searchValue,
  onSearchChange,
  toolbarFilters,
  searchInputClassName,
  sort: controlledSort,
  onSortChange,
  className,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [internalSort, setInternalSort] = useState<DataTableSortState | null>(
    null,
  );
  const search = searchValue ?? internalSearch;
  const sort = controlledSort !== undefined ? controlledSort : internalSort;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  const handleSortToggle = (column: DataTableColumn<T>) => {
    if (!column.sortable || !column.getSortValue) return;

    const nextSort: DataTableSortState | null =
      sort?.columnId === column.id
        ? sort.direction === "asc"
          ? { columnId: column.id, direction: "desc" }
          : null
        : { columnId: column.id, direction: "asc" };

    if (onSortChange) {
      onSortChange(nextSort);
    } else {
      setInternalSort(nextSort);
    }
  };

  const filteredRows = useMemo(() => {
    let rows = data;

    if (!serverPagination && search.trim() && searchKeys.length > 0) {
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
  }, [data, filter, filterFn, search, searchKeys, serverPagination]);

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;

    const column = columns.find((item) => item.id === sort.columnId);
    if (!column?.sortable || !column.getSortValue) return filteredRows;

    return [...filteredRows].sort((rowA, rowB) =>
      compareSortValues(
        column.getSortValue!(rowA),
        column.getSortValue!(rowB),
        sort.direction,
      ),
    );
  }, [columns, filteredRows, sort]);

  const paginatedRows = useMemo(() => {
    if (!pagination || serverPagination) return sortedRows;

    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedRows.slice(start, start + pagination.pageSize);
  }, [sortedRows, pagination, serverPagination]);

  const effectivePagination: PaginationState | undefined = pagination
    ? {
        ...pagination,
        total: serverPagination ? pagination.total : sortedRows.length,
      }
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
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn("h-9 bg-background pl-9", searchInputClassName)}
            aria-label={searchPlaceholder}
          />
        </div>

        {toolbarFilters}

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
              {columns.map((column) => {
                const isSorted = sort?.columnId === column.id;
                const SortIcon = isSorted
                  ? sort.direction === "asc"
                    ? ArrowUp
                    : ArrowDown
                  : ArrowUpDown;

                return (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "h-10 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                      column.className,
                    )}
                  >
                    {column.sortable && column.getSortValue ? (
                      <button
                        type="button"
                        onClick={() => handleSortToggle(column)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-sm",
                          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                        aria-label={`Sort by ${column.header}${
                          isSorted
                            ? `, ${sort.direction === "asc" ? "ascending" : "descending"}`
                            : ""
                        }`}
                      >
                        <span>{column.header}</span>
                        <SortIcon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isSorted ? "text-foreground" : "opacity-50",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
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
