import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SuperAdminLayout } from '@/components/SuperAdminLayout';
import { PageHeader } from '@/components/PageHeader';
import { UserList } from '@/components/UserList';
import {
  UserForm,
  mapCreateFormToRequest,
  mapEditFormToRequest,
  type CreateUserFormValues,
  type EditUserFormValues,
} from '@/components/UserForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DEFAULT_PAGE_SIZE,
  filterManageableRoles,
  getDefaultRoles,
  useUsers,
} from '@/hooks/useUsers';
import { formatUserDisplayName } from '@/lib/utils';
import type { SuperAdminUserRecord } from '@/types';

type DialogMode = 'create' | 'edit' | null;

export default function ManageUsers() {
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedUser, setSelectedUser] = useState<SuperAdminUserRecord | null>(null);
  const [userToDelete, setUserToDelete] = useState<SuperAdminUserRecord | null>(null);
  const [formError, setFormError] = useState<unknown>(null);

  const {
    users,
    pagination,
    roles,
    isLoading,
    isError,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsers({ page, pageSize: DEFAULT_PAGE_SIZE });

  const manageableRoles =
    roles.length > 0 ? filterManageableRoles(roles) : getDefaultRoles();

  function openCreateDialog() {
    setSelectedUser(null);
    setFormError(null);
    setDialogMode('create');
  }

  function openEditDialog(user: SuperAdminUserRecord) {
    setSelectedUser(user);
    setFormError(null);
    setDialogMode('edit');
  }

  function closeDialog() {
    setDialogMode(null);
    setSelectedUser(null);
    setFormError(null);
  }

  async function handleCreateSubmit(values: CreateUserFormValues | EditUserFormValues) {
    setFormError(null);
    try {
      await createUser(mapCreateFormToRequest(values as CreateUserFormValues));
      closeDialog();
    } catch (err) {
      setFormError(err);
      throw err;
    }
  }

  async function handleEditSubmit(values: CreateUserFormValues | EditUserFormValues) {
    if (!selectedUser) return;
    setFormError(null);
    try {
      await updateUser({
        userId: selectedUser.id,
        payload: mapEditFormToRequest(values as EditUserFormValues),
      });
      closeDialog();
    } catch (err) {
      setFormError(err);
      throw err;
    }
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch {
      // toast handled in hook
    }
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Manage Users"
          description="View, add, edit, and remove coach and player accounts."
          action={
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add user
            </Button>
          }
        />

        <Card>
          <CardContent className="pt-6">
            <UserList
              users={users}
              pagination={pagination}
              isLoading={isLoading}
              isError={isError}
              errorMessage={error?.message}
              onRetry={() => void refetch()}
              onEdit={openEditDialog}
              onDelete={setUserToDelete}
              onPageChange={setPage}
              onAddUser={openCreateDialog}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Add user' : 'Edit user'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create'
                ? 'Create a new coach or player account.'
                : 'Update account details for this user.'}
            </DialogDescription>
          </DialogHeader>
          {dialogMode === 'create' ? (
            <UserForm
              mode="create"
              roles={manageableRoles}
              onSubmit={handleCreateSubmit}
              onCancel={closeDialog}
              isSubmitting={isCreating}
              submitError={formError}
            />
          ) : null}
          {dialogMode === 'edit' && selectedUser ? (
            <UserForm
              mode="edit"
              roles={manageableRoles}
              initialUser={selectedUser}
              onSubmit={handleEditSubmit}
              onCancel={closeDialog}
              isSubmitting={isUpdating}
              submitError={formError}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={userToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null);
        }}
        title="Remove user"
        description={
          userToDelete
            ? `Are you sure you want to remove ${formatUserDisplayName(userToDelete)}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove user"
        onConfirm={() => void handleConfirmDelete()}
        isLoading={isDeleting}
      />
    </SuperAdminLayout>
  );
}
