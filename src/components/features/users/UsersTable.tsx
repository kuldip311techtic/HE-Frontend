import { Badge } from '@/components/ui/badge';
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
import { RowActionsMenu } from '@/components/shared/RowActionsMenu';
import { useTableSort } from '@/hooks/useTableSort';
import {
  displayUserName,
  formatUserRoleLabel,
  isOwnUserAccount,
  type UserItem,
} from '@/types/users';

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
      return formatUserRoleLabel(a.role).localeCompare(formatUserRoleLabel(b.role), undefined, {
        sensitivity: 'base',
      });
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
  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<UserItem, UserSortKey>(
    users,
    compareUsers,
  );

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`user-skeleton-${index}`} className="h-12 w-full bg-[#13291b]" />
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
                <TableCell className="font-medium text-white">{name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-[#0d1612] bg-[#1bc94f1f] text-[#4bcd39]"
                  >
                    {formatUserRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <RowActionsMenu
                    appearance="admin"
                    ariaLabel={`Actions for ${name}`}
                    actions={[
                      {
                        id: 'edit',
                        label: 'Edit',
                        onSelect: () => onEdit(user),
                      },
                      {
                        id: 'remove',
                        label: 'Remove',
                        onSelect: () => onRemove(user),
                        destructive: true,
                        disabled: isOwnAccount,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
