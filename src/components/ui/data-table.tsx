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

type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | null | undefined;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterLabel?: string;
  filterOptions?: { label: string; value: string }[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterFn?: (row: T, filterValue: string) => boolean;
  primaryAction?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  /** When true, data is already paginated/filtered by the server */
  serverSide?: boolean;
  /** Stable row key; defaults to row.id when present on the record */
  getRowId?: (row: T) => string | number;
  /** Highlights and handles click on table rows (e.g. master-detail layouts) */
  selectedRowId?: string | number | null;
  onRowClick?: (row: T) => void;
  className?: string;
}

function resolveRowKey<T>(
  row: T,
  index: number,
  getRowId?: (row: T) => string | number,
): string {
  if (getRowId) {
    return String(getRowId(row));
  }

  if (typeof row === "object" && row !== null && "id" in row) {
    const id = (row as { id: unknown }).id;
    if (id !== null && id !== undefined) {
      return String(id);
    }
  }

  return String(index);
}

function compareSortValues(
  a: string | number | boolean | null | undefined,
  b: string | number | boolean | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  error = null,
  onRetry,
  searchPlaceholder = "Search…",
  searchKeys = [],
  searchValue,
  onSearchChange,
  filterLabel = "Status",
  filterOptions,
  filterValue,
  onFilterChange,
  filterFn,
  primaryAction,
  emptyTitle = "No records found",
  emptyDescription,
  emptyAction,
  pagination,
  onPageChange,
  onPageSizeChange,
  serverSide = false,
  getRowId,
  selectedRowId,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("all");
  const [sortState, setSortState] = useState<{
    columnId: string;
    direction: SortDirection;
  } | null>(null);

  const search = searchValue ?? internalSearch;
  const filter = filterValue ?? internalFilter;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  const handleFilterChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    } else {
      setInternalFilter(value);
    }
  };

  const handleSort = (column: DataTableColumn<T>) => {
    if (serverSide || !column.sortable || !column.sortValue) return;

    setSortState((current) => {
      if (current?.columnId !== column.id) {
        return { columnId: column.id, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { columnId: column.id, direction: "desc" };
      }
      return null;
    });
  };

  const filteredRows = useMemo(() => {
    if (serverSide) return data;

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
  }, [data, filter, filterFn, search, searchKeys, serverSide]);

  const sortedRows = useMemo(() => {
    if (serverSide || !sortState) return filteredRows;

    const column = columns.find((item) => item.id === sortState.columnId);
    if (!column?.sortable || !column.sortValue) return filteredRows;

    const sorted = [...filteredRows].sort((rowA, rowB) =>
      compareSortValues(column.sortValue!(rowA), column.sortValue!(rowB)),
    );

    return sortState.direction === "desc" ? sorted.reverse() : sorted;
  }, [columns, filteredRows, serverSide, sortState]);

  const paginatedRows = useMemo(() => {
    if (!pagination || serverSide) return sortedRows;

    const start = (pagination.page - 1) * pagination.pageSize;
    return sortedRows.slice(start, start + pagination.pageSize);
  }, [sortedRows, pagination, serverSide]);

  const effectivePagination: PaginationState | undefined = pagination
    ? {
        ...pagination,
        total: serverSide ? pagination.total : sortedRows.length,
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
            className="h-9 bg-background pl-9"
            aria-label={searchPlaceholder}
          />
        </div>

        {filterOptions && filterOptions.length > 0 && (
          <Select value={filter} onValueChange={handleFilterChange}>
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
                const isSorted = sortState?.columnId === column.id;
                const isSortable = Boolean(
                  column.sortable && column.sortValue && !serverSide,
                );

                return (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "h-10 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                      column.className,
                    )}
                    aria-sort={
                      isSortable
                        ? isSorted
                          ? sortState.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cn(
                          "inline-flex min-h-9 items-center gap-1 rounded-sm",
                          "text-left uppercase tracking-wide text-muted-foreground",
                          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        )}
                      >
                        <span>{column.header}</span>
                        {isSorted ? (
                          sortState.direction === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown
                            className="h-3.5 w-3.5 shrink-0 opacity-50"
                            aria-hidden="true"
                          />
                        )}
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
              paginatedRows.map((row, index) => {
                const rowKey = resolveRowKey(row, index, getRowId);
                const isSelected =
                  selectedRowId != null && String(selectedRowId) === rowKey;

                return (
                  <TableRow
                    key={rowKey}
                    className={cn(
                      "h-11",
                      onRowClick && "cursor-pointer",
                      isSelected && "bg-primary/10 hover:bg-primary/10",
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    aria-selected={onRowClick ? isSelected : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn("px-3 py-2 text-sm", column.className)}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
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
