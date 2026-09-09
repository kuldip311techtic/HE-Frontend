import * as React from 'react';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { AdminDataTable } from '@/components/features/admin/AdminDataTable';
import { ConfirmDeleteDialog } from '@/components/features/admin/ConfirmDeleteDialog';
import { SortableTableHead } from '@/components/features/admin/SortableTableHead';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useAuth } from '@/lib/auth/useAuth';
import { useDeleteUser } from '@/hooks/useUsers';
import { cycleSort, sortByColumn, type SortState } from '@/lib/utils/sort';
import { humanizeEnum } from '@/lib/utils/format';
import type { SuperAdminUser } from '@/types/user';

type SortColumn = 'name' | 'email' | 'role';

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
      const haystack = [item.name, item.email, item.role, item.first_name, item.last_name]
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
  onAdd: () => void;
  onEdit: (user: SuperAdminUser) => void;
  emptyAction?: React.ReactNode;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasLoadedData: boolean;
}

export function UsersTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onAdd,
  onEdit,
  emptyAction,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hasLoadedData,
}: UsersTableProps) {
  const { user: currentUser } = useAuth();
  const deleteMutation = useDeleteUser();
  const [deleteTarget, setDeleteTarget] = React.useState<SuperAdminUser | null>(null);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState(ALL_ROLES_VALUE);
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: null,
    direction: 'asc',
  });

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
        emptyTitle={isFilteredEmpty ? 'No matching users' : 'No users yet'}
        emptyDescription={
          isFilteredEmpty
            ? 'Try adjusting your search or role filter.'
            : 'Add your first user to get started.'
        }
        emptyAction={isDatasetEmpty ? emptyAction : undefined}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users…"
                aria-label="Search users"
                className="h-11 max-w-full border-[#0d1612] bg-[#0b1f12] sm:max-w-[280px]"
              />
              <Select
                aria-label="Filter by role"
                className="h-11 w-full sm:w-[180px]"
                options={ROLE_FILTER_OPTIONS}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              />
            </div>
            <Button type="button" variant="brand" onClick={onAdd} className="shrink-0">
              <Plus className="h-4 w-4" />
              Add user
            </Button>
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
              <SortableTableHead
                label="Name"
                column="name"
                activeColumn={sort.column}
                direction={sort.direction}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Email"
                column="email"
                activeColumn={sort.column}
                direction={sort.direction}
                onSort={handleSort}
              />
              <SortableTableHead
                label="Role"
                column="role"
                activeColumn={sort.column}
                direction={sort.direction}
                onSort={handleSort}
              />
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        }
      >
        {sortedItems.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{humanizeEnum(row.role)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="Open actions menu">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(row)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    disabled={isSelf(row)}
                    title={isSelf(row) ? 'You cannot remove your own account' : undefined}
                    onClick={() => !isSelf(row) && setDeleteTarget(row)}
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

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove user?"
        description={`This will permanently remove "${deleteTarget?.name ?? 'this user'}". This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
