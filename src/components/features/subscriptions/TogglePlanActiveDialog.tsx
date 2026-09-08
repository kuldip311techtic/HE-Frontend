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

  const title = nextActive ? 'Activate subscription plan?' : 'Deactivate subscription plan?';

  const description = nextActive
    ? `This will activate "${planName}" and make it available for new subscriptions. You can deactivate it again later.`
    : `This will deactivate "${planName}" and prevent new subscriptions. Existing assignments may remain. You can activate it again later.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={nextActive ? 'Activate' : 'Deactivate'}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      isLoading={isLoading}
      appearance="admin-form"
      dialogClassName="admin-subscriptions-dialog"
      errorMessage={errorMessage}
    />
  );
}
