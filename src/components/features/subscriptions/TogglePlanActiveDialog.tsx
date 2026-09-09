import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface TogglePlanActiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlanItem | null;
  nextActive: boolean;
  onConfirm: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function TogglePlanActiveDialog({
  open,
  onOpenChange,
  plan,
  nextActive,
  onConfirm,
  isLoading = false,
  errorMessage = null,
}: TogglePlanActiveDialogProps) {
  const planName = plan?.name ?? 'this plan';
  const description = nextActive
    ? 'This will activate "' +
      planName +
      '" and make it available for new subscriptions.'
    : 'This will deactivate "' +
      planName +
      '". Existing subscriptions may remain, but new assignments could be prevented.';

  const confirmLabel = isLoading
    ? nextActive
      ? 'Activating…'
      : 'Deactivating…'
    : nextActive
      ? 'Activate'
      : 'Deactivate';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={nextActive ? 'Activate subscription plan?' : 'Deactivate subscription plan?'}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      appearance="admin-form"
      errorMessage={errorMessage}
    />
  );
}
