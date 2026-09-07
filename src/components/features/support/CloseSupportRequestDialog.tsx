import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {
  displaySupportRequestUser,
  type SupportRequestItem,
} from '@/types/support-requests';

interface CloseSupportRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequestItem | null;
  onConfirm: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function CloseSupportRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isLoading = false,
  errorMessage = null,
}: CloseSupportRequestDialogProps) {
  const userLabel = request ? displaySupportRequestUser(request) : 'this user';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Close support request?"
      description={`This will mark the support request from "${userLabel}" as closed. The user will no longer receive further responses on this inquiry.`}
      confirmLabel="Close request"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      errorMessage={errorMessage}
      appearance="admin-form"
    />
  );
}
