import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { OrganizationItem } from '@/types/organizations';

interface RemoveOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: OrganizationItem | null;
  onConfirm: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RemoveOrganizationDialog({
  open,
  onOpenChange,
  organization,
  onConfirm,
  isLoading = false,
  errorMessage = null,
}: RemoveOrganizationDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove organization?"
      description={`This will permanently remove "${organization?.name ?? 'this organization'}" and its associated data. This action cannot be undone.`}
      confirmLabel="Remove"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      errorMessage={errorMessage}
    />
  );
}
