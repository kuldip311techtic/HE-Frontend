import * as React from 'react';
import { Columns3, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { AdminDataTable } from '@/components/features/admin/AdminDataTable';
import { ConfirmDeleteDialog } from '@/components/features/admin/ConfirmDeleteDialog';
import { OrganizationDetailModal } from '@/components/features/admin/organizations/OrganizationDetailModal';
import { SortableTableHead } from '@/components/features/admin/SortableTableHead';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useDeleteOrganization } from '@/hooks/useOrganizations';
import { captureReturnFocus, setReturnFocus } from '@/lib/utils/captureReturnFocus';
import { cycleSort, sortByColumn, type SortState } from '@/lib/utils/sort';
import type { Organization } from '@/types/organization';

type SortColumn = 'name' | 'contact_email' | 'phone_number' | 'address';

type ColumnKey = SortColumn | 'id' | 'join_code';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Id', sortable: false, defaultVisible: false },
  { key: 'name', label: 'Name', sortable: true, defaultVisible: true, alwaysVisible: true },
  { key: 'contact_email', label: 'Contact email', sortable: true, defaultVisible: true },
  { key: 'phone_number', label: 'Phone', sortable: true, defaultVisible: true },
  { key: 'address', label: 'Address', sortable: true, defaultVisible: false },
  { key: 'join_code', label: 'Join code', sortable: false, defaultVisible: false },
];

function filterOrganizations(items: Organization[], search: string): Organization[] {
  const query = search.trim().toLowerCase();
  if (!query) return items;

  return items.filter((item) => {
    const haystack = [
      item.name,
      item.contact_email,
      item.phone_number ?? '',
      item.address ?? '',
      item.join_code ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });
}

interface OrganizationsTableProps {
  items: Organization[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onEdit: (organization: Organization) => void;
  emptyAction?: React.ReactNode;
  hasLoadedData: boolean;
  returnFocusRef: React.MutableRefObject<HTMLElement | null>;
}

export function OrganizationsTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onEdit,
  emptyAction,
  hasLoadedData,
  returnFocusRef,
}: OrganizationsTableProps) {
  const deleteMutation = useDeleteOrganization();
  const rowTriggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [deleteTarget, setDeleteTarget] = React.useState<Organization | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Organization | null>(null);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: null,
    direction: 'asc',
  });
  const [visibleColumns, setVisibleColumns] = React.useState<Record<ColumnKey, boolean>>(() =>
    Object.fromEntries(COLUMNS.map((col) => [col.key, col.defaultVisible])) as Record<
      ColumnKey,
      boolean
    >,
  );

  const filteredItems = React.useMemo(
    () => filterOrganizations(items, debouncedSearch),
    [items, debouncedSearch],
  );

  const sortedItems = React.useMemo(
    () => sortByColumn(filteredItems, sort.column, sort.direction),
    [filteredItems, sort],
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, sort.column, sort.direction]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

  const handleSort = (column: string) => {
    setSort((current) => cycleSort(current, column as SortColumn));
  };

  const toggleColumn = (key: ColumnKey, checked: boolean) => {
    const config = COLUMNS.find((col) => col.key === key);
    if (config?.alwaysVisible) return;
    setVisibleColumns((prev) => ({ ...prev, [key]: checked }));
  };

  const runRowMenuAction = (organizationId: string, action: () => void) => {
    setReturnFocus(returnFocusRef, rowTriggerRefs.current.get(organizationId) ?? null);
    action();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Organization removed successfully.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to remove organization. Please try again.'));
    }
  };

  const renderCell = (row: Organization, key: ColumnKey) => {
    switch (key) {
      case 'id':
        return row.id;
      case 'name':
        return <span className="font-medium">{row.name}</span>;
      case 'contact_email':
        return row.contact_email;
      case 'phone_number':
        return row.phone_number || '—';
      case 'address':
        return row.address || '—';
      case 'join_code':
        return row.join_code || '—';
      default:
        return '—';
    }
  };

  const visibleColumnConfigs = COLUMNS.filter((col) => visibleColumns[col.key]);
  const isDatasetEmpty = !isLoading && !isError && hasLoadedData && items.length === 0;
  const isFilteredEmpty =
    !isLoading && !isError && hasLoadedData && items.length > 0 && filteredItems.length === 0;

  return (
    <>
      <AdminDataTable
        aria-label="Organizations"
        isLoading={isLoading}
        isError={isError}
        isEmpty={isDatasetEmpty || isFilteredEmpty}
        errorMessage={errorMessage}
        onRetry={onRetry}
        emptyTitle={isFilteredEmpty ? 'No matching organizations' : 'No organizations yet'}
        emptyDescription={
          isFilteredEmpty
            ? 'Try adjusting your search.'
            : 'Add your first organization to get started.'
        }
        emptyAction={isDatasetEmpty ? emptyAction : undefined}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organizations…"
              aria-label="Search organizations"
              className="h-11 max-w-full sm:max-w-[280px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="h-11">
                  <Columns3 className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLUMNS.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key]}
                    disabled={col.alwaysVisible}
                    onCheckedChange={(checked) => toggleColumn(col.key, checked === true)}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        footer={
          hasLoadedData || isError ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={sortedItems.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              disabled={isLoading || isError}
            />
          ) : null
        }
        header={
          <TableHeader>
            <TableRow>
              {visibleColumnConfigs.map((col) =>
                col.sortable ? (
                  <SortableTableHead
                    key={col.key}
                    label={col.label}
                    column={col.key}
                    activeColumn={sort.column}
                    direction={sort.direction}
                    onSort={handleSort}
                  />
                ) : (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ),
              )}
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        }
      >
        {paginatedItems.map((org) => (
          <TableRow key={org.id}>
            {visibleColumnConfigs.map((col) => (
              <TableCell key={col.key}>{renderCell(org, col.key)}</TableCell>
            ))}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Open actions menu"
                    ref={(element) => {
                      if (element) {
                        rowTriggerRefs.current.set(org.id, element);
                      } else {
                        rowTriggerRefs.current.delete(org.id);
                      }
                    }}
                    onFocus={(event) => captureReturnFocus(returnFocusRef, event)}
                    onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => runRowMenuAction(org.id, () => setViewTarget(org))}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => runRowMenuAction(org.id, () => onEdit(org))}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => runRowMenuAction(org.id, () => setDeleteTarget(org))}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </AdminDataTable>

      <OrganizationDetailModal
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        organization={viewTarget}
        returnFocusRef={returnFocusRef}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        returnFocusRef={returnFocusRef}
        title="Remove organization?"
        description={`This will permanently remove "${deleteTarget?.name ?? 'this organization'}". This action cannot be undone.`}
        confirmLabel="Remove"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
