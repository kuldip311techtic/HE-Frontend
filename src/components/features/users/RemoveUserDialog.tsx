import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { displayUserName, type UserItem } from '@/types/users';

interface RemoveUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
  onConfirm: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RemoveUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading = false,
  errorMessage = null,
}: RemoveUserDialogProps) {
  const name = user ? displayUserName(user) : 'this user';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove user?"
      description={`This will permanently remove "${name}" and revoke their platform access. This action cannot be undone.`}
      confirmLabel="Remove"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      errorMessage={errorMessage}
      dialogClassName="admin-form-dialog"
    />
  );
}
