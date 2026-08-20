import { useEffect, useState } from 'react';
import UserForm from '../../components/features/users/UserForm';
import UserList from '../../components/features/users/UserList';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Toast from '../../components/ui/Toast';
import { useRemoveUser } from '../../hooks/useRemoveUser';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';

type FormMode = 'add' | 'edit' | null;

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

export default function ManageUsersPage() {
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { users, total, pageSize, isLoading, isError, error, refetch } =
    useUsers(page);

  const removeMutation = useRemoveUser();

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openAddForm = () => {
    setSelectedUser(null);
    setFormMode('add');
  };

  const openEditForm = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedUser(null);
  };

  const handleRemoveConfirm = async () => {
    if (!userToRemove) {
      return;
    }

    try {
      const response = await removeMutation.removeUser(userToRemove.id);
      setToast({
        message: response.message || 'User removed successfully.',
        variant: 'success',
      });
      setUserToRemove(null);

      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        void refetch();
      }
    } catch {
      setToast({
        message:
          removeMutation.errorMessage ??
          'Unable to remove user. Please try again.',
        variant: 'error',
      });
    }
  };

  const isUserActive = userToRemove?.status === 'active';
  const userDisplayName =
    userToRemove?.name ||
    (userToRemove
      ? `${userToRemove.first_name} ${userToRemove.last_name}`.trim()
      : '');

  return (
    <AdminLayout title="Manage Users">
      <div className="space-y-6">
        <Card
          title="Users"
          description="View, add, edit, and remove user accounts and role assignments across the Hoops Engine platform."
          action={
            <Button
              type="button"
              variant="accent"
              fullWidth={false}
              className="min-w-[140px]"
              onClick={openAddForm}
            >
              Add user
            </Button>
          }
        >
          <UserList
            users={users}
            total={total}
            page={page}
            pageSize={pageSize}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onPageChange={setPage}
            onEdit={openEditForm}
            onRemove={setUserToRemove}
          />
        </Card>
      </div>

      <UserForm
        mode={formMode === 'edit' ? 'edit' : 'add'}
        user={selectedUser ?? undefined}
        open={formMode !== null}
        onClose={closeForm}
        onSuccess={(message) => {
          setToast({ message, variant: 'success' });
          void refetch();
        }}
      />

      <ConfirmationDialog
        open={Boolean(userToRemove)}
        title="Remove user"
        message={
          userToRemove
            ? `Are you sure you want to remove ${userDisplayName || userToRemove.email}? This action cannot be undone.`
            : ''
        }
        warningMessage={
          isUserActive
            ? 'This user is currently active and may have access to the platform.'
            : undefined
        }
        confirmLabel="Remove"
        loading={removeMutation.isLoading}
        onConfirm={() => void handleRemoveConfirm()}
        onCancel={() => {
          if (!removeMutation.isLoading) {
            setUserToRemove(null);
            removeMutation.reset();
          }
        }}
      />

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
