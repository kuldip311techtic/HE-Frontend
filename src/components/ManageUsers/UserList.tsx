import { useState } from "react";
import { MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { UserForm } from "@/components/ManageUsers/UserForm";
import { useUsers } from "@/hooks/ManageUsers/useUsers";
import { useAddUser } from "@/hooks/ManageUsers/useAddUser";
import { useEditUser } from "@/hooks/ManageUsers/useEditUser";
import { useRemoveUser } from "@/hooks/ManageUsers/useRemoveUser";
import { formatDate, getDisplayName } from "@/lib/utils";
import type { User, UserFormValues, UserRoleOption } from "@/types/users";
import { ApiClientError } from "@/types/api";

const DEFAULT_ROLES: UserRoleOption[] = [
  { value: "coach", label: "Coach", description: "Coach role" },
  { value: "player", label: "Player", description: "Player role" },
];

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading users" role="status">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

interface UserListProps {
  onAddUser?: () => void;
}

export function UserList({ onAddUser }: UserListProps) {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<ApiClientError | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(page);
  const addUser = useAddUser();
  const editUserMutation = useEditUser();
  const removeUser = useRemoveUser();

  const users = data?.items ?? [];
  const pagination = data?.pagination;
  const roles = data?.roles?.length ? data.roles : DEFAULT_ROLES;

  const handleCreate = (values: UserFormValues) => {
    setFormError(null);
    addUser.mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: values.role,
        org_id: values.org_id || null,
      },
      {
        onSuccess: () => setCreateOpen(false),
        onError: (err) => {
          if (err instanceof ApiClientError) setFormError(err);
        },
      }
    );
  };

  const handleEdit = (values: UserFormValues) => {
    if (!editUser) return;
    setFormError(null);
    editUserMutation.mutate(
      {
        userId: editUser.id,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role,
          ...(values.password ? { password: values.password } : {}),
          org_id: values.org_id || null,
        },
      },
      {
        onSuccess: () => setEditUser(null),
        onError: (err) => {
          if (err instanceof ApiClientError) setFormError(err);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    removeUser.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
    });
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    const message =
      error instanceof ApiClientError
        ? error.message
        : "Failed to load users. Please try again.";
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 rounded-xl border border-destructive/50 bg-destructive/10 px-6 py-12 text-center"
      >
        <p className="text-sm text-destructive">{message}</p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          aria-label="Retry loading users"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <>
        <EmptyState
          title="No users yet"
          description="Get started by adding your first user to the platform."
          action={
            <Button onClick={() => (onAddUser ? onAddUser() : setCreateOpen(true))}>
              Add user
            </Button>
          }
        />
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add user</DialogTitle>
            </DialogHeader>
            <UserForm
              mode="create"
              roles={roles}
              loading={addUser.isPending}
              serverError={formError}
              onSubmit={handleCreate}
              onCancel={() => setCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <Table aria-label="Users table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last sign in</TableHead>
              <TableHead className="w-[70px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {getDisplayName(user.first_name, user.last_name, user.name)}
                  {user.is_self && (
                    <Badge variant="outline" className="ml-2">
                      You
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <StatusBadge active={user.is_active} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.last_sign_in_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Actions for ${user.email}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setFormError(null);
                          setEditUser(user);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {!user.is_self && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.total_pages} ({pagination.total}{" "}
            users)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.has_prev || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.has_next || isFetching}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
          </DialogHeader>
          <UserForm
            mode="create"
            roles={roles}
            loading={addUser.isPending}
            serverError={formError}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editUser)}
        onOpenChange={(open) => !open && setEditUser(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {editUser && (
            <UserForm
              mode="edit"
              user={editUser}
              roles={roles}
              loading={editUserMutation.isPending}
              serverError={formError}
              onSubmit={handleEdit}
              onCancel={() => setEditUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteUser)}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Remove user"
        description={
          deleteUser
            ? `Are you sure you want to remove ${getDisplayName(deleteUser.first_name, deleteUser.last_name, deleteUser.name)}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        destructive
        loading={removeUser.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

export { UserList as default };
