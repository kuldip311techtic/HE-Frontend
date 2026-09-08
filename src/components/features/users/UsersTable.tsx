import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableSort } from '@/hooks/useTableSort';
import { displayUserName, isOwnUserAccount, type UserItem } from '@/types/users';

interface UsersTableProps {
  users: UserItem[];
  isLoading?: boolean;
  currentUserId?: string | null;
  onEdit: (user: UserItem) => void;
  onRemove: (user: UserItem) => void;
}

type UserSortKey = 'name' | 'email' | 'role';

function compareUsers(a: UserItem, b: UserItem, sortKey: UserSortKey): number {
  switch (sortKey) {
    case 'name':
      return displayUserName(a).localeCompare(displayUserName(b), undefined, {
        sensitivity: 'base',
      });
    case 'email':
      return a.email.localeCompare(b.email, undefined, { sensitivity: 'base' });
    case 'role':
      return a.role.localeCompare(b.role, undefined, { sensitivity: 'base' });
    default:
      return 0;
  }
}

export function UsersTable({
  users,
  isLoading = false,
  currentUserId = null,
  onEdit,
  onRemove,
}: UsersTableProps) {
  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    UserItem,
    UserSortKey
  >(users, compareUsers);

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`user-skeleton-${index}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-table overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label="Name"
              sortKey="name"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Email"
              sortKey="email"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Role"
              sortKey="role"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((user) => {
            const name = displayUserName(user);
            const isOwnAccount = isOwnUserAccount(user, currentUserId);

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-sidebar-accent/15 text-sidebar-accent">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${name}`}
                      className="admin-outline-btn"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove(user)}
                      disabled={isOwnAccount}
                      aria-label={
                        isOwnAccount ? `Remove ${name} (disabled — your account)` : `Remove ${name}`
                      }
                      title={isOwnAccount ? 'You cannot remove your own account.' : undefined}
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
