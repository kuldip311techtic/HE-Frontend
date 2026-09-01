import { Plus } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PageHeader } from "@/components/PageHeader";
import { UserForm } from "@/components/users/UserForm";
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DEFAULT_PAGE_SIZE,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/hooks/useUsers";
import { getUserDisplayName } from "@/lib/user-helpers";
import { getStoredEmail } from "@/lib/utils";
import type { User, UserFormValues } from "@/types/user";

export default function ManageUsers() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const currentUserEmail = getStoredEmail();

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers({
    page,
    page_size: DEFAULT_PAGE_SIZE,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;
  const total = pagination?.total ?? users.length;
  const hasNext = pagination?.has_next ?? page < totalPages;
  const hasPrev = pagination?.has_prev ?? page > 1;

  const handleCreateSubmit = (values: UserFormValues) => {
    createUserMutation.mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
        },
      },
    );
  };

  const handleEditSubmit = (values: UserFormValues) => {
    if (!editingUser) {
      return;
    }

    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      role: values.role,
      ...(values.password ? { password: values.password } : {}),
    };

    updateUserMutation.mutate(
      { id: editingUser.id, payload },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) {
      return;
    }

    deleteUserMutation.mutate(deletingUser.id, {
      onSuccess: () => {
        setDeletingUser(null);
        if (users.length === 1 && page > 1) {
          setPage((current) => current - 1);
        }
      },
    });
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts."
        action={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="min-h-11 w-full sm:w-auto"
            aria-label="Add new user"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add user
          </Button>
        }
      />

      {isError ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ErrorMessage
              message={error?.message ?? "Failed to load users."}
            />
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!isLoading && users.length === 0 ? (
            <EmptyState
              title="No users yet"
              description="Get started by adding your first coach or player account."
              action={
                <Button onClick={() => setIsCreateOpen(true)} className="min-h-11">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add user
                </Button>
              }
            />
          ) : (
            <>
              <UserList
                users={users}
                currentUserEmail={currentUserEmail}
                onEdit={setEditingUser}
                onDelete={setDeletingUser}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination?.page ?? page} of {totalPages} ({total}{" "}
                    total user{total === 1 ? "" : "s"})
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={!hasPrev || isFetching}
                      aria-label="Previous page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={!hasNext || isFetching}
                      aria-label="Next page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>
              Create a new coach or player account.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            mode="create"
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createUserMutation.isPending}
            error={createUserMutation.error}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update account details for{" "}
              {editingUser ? getUserDisplayName(editingUser) : "this user"}.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              mode="edit"
              user={editingUser}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingUser(null)}
              isLoading={updateUserMutation.isPending}
              error={updateUserMutation.error}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingUser(null);
          }
        }}
        title="Remove user"
        description={
          deletingUser
            ? `Are you sure you want to remove ${getUserDisplayName(deletingUser)}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
