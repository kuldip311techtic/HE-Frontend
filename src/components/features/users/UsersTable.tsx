import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { canEditManagedUserRole, canRemoveUser, getAdminUserRoleLabel } from '@/lib/api/users';
import type { AdminUserItem, RoleOption } from '@/types/api';

interface UsersTableProps {
  users: AdminUserItem[];
  roleOptions: RoleOption[];
  currentUserId?: string | null;
  onEdit: (user: AdminUserItem) => void;
  onRemove: (user: AdminUserItem) => void;
}

function UserRoleBadge({ role, roleOptions }: { role: string; roleOptions: RoleOption[] }) {
  const label = getAdminUserRoleLabel(role, roleOptions);

  return <Badge variant="secondary">{label}</Badge>;
}

export function UsersTable({
  users,
  roleOptions,
  currentUserId,
  onEdit,
  onRemove,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const removable = canRemoveUser(user, currentUserId);
            const editable = canEditManagedUserRole(user.role);

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} roleOptions={roleOptions} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {editable ? (
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                          Edit
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuLabel className="max-w-[220px] font-normal text-muted-foreground">
                          Editing is limited to coach and player accounts.
                        </DropdownMenuLabel>
                      )}
                      {removable ? (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onRemove(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                          Remove
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuLabel className="max-w-[220px] font-normal text-muted-foreground">
                          You cannot remove your own account.
                        </DropdownMenuLabel>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
