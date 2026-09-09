import * as React from 'react';
import { Columns3, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
import { SortableTableHead } from '@/components/features/admin/SortableTableHead';
import { UserDetailModal } from '@/components/features/admin/users/UserDetailModal';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useAuth } from '@/lib/auth/useAuth';
import { useDeleteUser } from '@/hooks/useUsers';
import { captureReturnFocus, setReturnFocus } from '@/lib/utils/captureReturnFocus';
import { cycleSort, sortByColumn, type SortState } from '@/lib/utils/sort';
import { humanizeEnum } from '@/lib/utils/format';
import type { SuperAdminUser } from '@/types/user';

type SortColumn = 'name' | 'email' | 'role';

type ColumnKey = SortColumn | 'roles' | 'is_self';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, defaultVisible: true, alwaysVisible: true },
  { key: 'email', label: 'Email', sortable: true, defaultVisible: true },
  { key: 'role', label: 'Role', sortable: true, defaultVisible: true },
  { key: 'roles', label: 'Roles', sortable: false, defaultVisible: false },
  { key: 'is_self', label: 'Current account', sortable: false, defaultVisible: false },
];

const ALL_ROLES_VALUE = 'all';

const ROLE_FILTER_OPTIONS = [
  { value: ALL_ROLES_VALUE, label: 'All roles' },
  { value: 'Coach', label: 'Coach' },
  { value: 'Player', label: 'Player' },
];

function filterUsers(items: SuperAdminUser[], search: string, roleFilter: string): SuperAdminUser[] {
  let result = items;

  if (roleFilter !== ALL_ROLES_VALUE) {
    result = result.filter((item) => item.role.toLowerCase() === roleFilter.toLowerCase());
  }

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter((item) => {
      const haystack = [
        item.name,
        item.email,
        item.role,
        item.first_name,
        item.last_name,
        ...(item.roles ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return result;
}

interface UsersTableProps {
  items: SuperAdminUser[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onEdit: (user: SuperAdminUser) => void;
  emptyAction?: React.ReactNode;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasLoadedData: boolean;
  returnFocusRef: React.MutableRefObject<HTMLElement | null>;
}

export function UsersTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onEdit,
  emptyAction,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hasLoadedData,
  returnFocusRef,
}: UsersTableProps) {
  const { user: currentUser } = useAuth();
  const deleteMutation = useDeleteUser();
  const rowTriggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [deleteTarget, setDeleteTarget] = React.useState<SuperAdminUser | null>(null);
  const [viewTarget, setViewTarget] = React.useState<SuperAdminUser | null>(null);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState(ALL_ROLES_VALUE);
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
    () => filterUsers(items, debouncedSearch, roleFilter),
    [items, debouncedSearch, roleFilter],
  );

  const sortedItems = React.useMemo(
    () => sortByColumn(filteredItems, sort.column, sort.direction),
    [filteredItems, sort],
  );

  const isSelf = (row: SuperAdminUser) => row.is_self || row.id === currentUser?.id;

  const handleSort = (column: string) => {
    setSort((current) => cycleSort(current, column as SortColumn));
  };

  const toggleColumn = (key: ColumnKey, checked: boolean) => {
    const config = COLUMNS.find((col) => col.key === key);
    if (config?.alwaysVisible) return;
    setVisibleColumns((prev) => ({ ...prev, [key]: checked }));
  };

  const runRowMenuAction = (userId: string, action: () => void) => {
    setReturnFocus(returnFocusRef, rowTriggerRefs.current.get(userId) ?? null);
    action();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('User removed successfully.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to remove user. Please try again.'));
    }
  };

  const renderCell = (row: SuperAdminUser, key: ColumnKey) => {
    switch (key) {
      case 'name':
        return <span className="font-medium">{row.name}</span>;
      case 'email':
        return row.email;
      case 'role':
        return humanizeEnum(row.role);
      case 'roles':
        return row.roles?.length ? (
          <span className="flex flex-wrap gap-1">
            {row.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {humanizeEnum(role)}
              </Badge>
            ))}
          </span>
        ) : (
          '—'
        );
      case 'is_self':
        return isSelf(row) ? 'Yes' : 'No';
      default:
        return '—';
    }
  };

  const visibleColumnConfigs = COLUMNS.filter((col) => visibleColumns[col.key]);
  const isDatasetEmpty = !isLoading && !isError && hasLoadedData && totalItems === 0;
  const isFilteredEmpty =
    !isLoading && !isError && hasLoadedData && totalItems > 0 && sortedItems.length === 0;

  return (
    <>
      <AdminDataTable
        aria-label="Users"
        isLoading={isLoading}
        isError={isError}
        isEmpty={isDatasetEmpty || isFilteredEmpty}
        errorMessage={errorMessage}
        onRetry={onRetry}
        emptyTitle={isFilteredEmpty ? 'No matching users on this page' : 'No users yet'}
        emptyDescription={
          isFilteredEmpty
            ? 'Try adjusting your search or role filter on the current page.'
            : 'Add your first user to get started.'
        }
        emptyAction={isDatasetEmpty ? emptyAction : undefined}
        toolbar={
          <div className="flex flex-col gap-3">
            <p className="font-lato text-body-sm text-figma-accent">
              Search, filter, and sort apply to the current page only.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search current page…"
                aria-label="Search users on current page"
                className="h-11 max-w-full sm:max-w-[280px]"
              />
              <Select
                aria-label="Filter by role on current page"
                className="h-11 w-full sm:w-[180px]"
                options={ROLE_FILTER_OPTIONS}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
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
          </div>
        }
        footer={
          totalItems > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              disabled={isLoading}
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
        {sortedItems.map((row) => (
          <TableRow key={row.id}>
            {visibleColumnConfigs.map((col) => (
              <TableCell key={col.key}>{renderCell(row, col.key)}</TableCell>
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
                        rowTriggerRefs.current.set(row.id, element);
                      } else {
                        rowTriggerRefs.current.delete(row.id);
                      }
                    }}
                    onFocus={(event) => captureReturnFocus(returnFocusRef, event)}
                    onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => runRowMenuAction(row.id, () => setViewTarget(row))}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => runRowMenuAction(row.id, () => onEdit(row))}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={isSelf(row)}
                    title={isSelf(row) ? 'You cannot remove your own account' : undefined}
                    onSelect={() => {
                      if (!isSelf(row)) {
                        runRowMenuAction(row.id, () => setDeleteTarget(row));
                      }
                    }}
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

      <UserDetailModal
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        user={viewTarget}
        returnFocusRef={returnFocusRef}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        returnFocusRef={returnFocusRef}
        title="Remove user?"
        description={`This will permanently remove "${deleteTarget?.name ?? 'this user'}". This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
