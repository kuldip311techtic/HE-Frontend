import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface ArchivePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlanItem | null;
  onConfirm: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function ArchivePlanDialog({
  open,
  onOpenChange,
  plan,
  onConfirm,
  isLoading = false,
  errorMessage = null,
}: ArchivePlanDialogProps) {
  const isActive = plan?.is_active === true;

  const description = isActive
    ? `This will archive "${plan?.name ?? 'this plan'}". This plan is currently active and may be assigned to organizations. Archiving will prevent new subscriptions but existing assignments may remain. This action cannot be undone.`
    : `This will archive "${plan?.name ?? 'this plan'}" and remove it from active subscription offerings. This action cannot be undone.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Archive subscription plan?"
      description={description}
      confirmLabel="Archive"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      errorMessage={errorMessage}
    />
  );
}
