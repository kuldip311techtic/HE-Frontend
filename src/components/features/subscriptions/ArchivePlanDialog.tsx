import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { isActiveSubscriptionPlan } from '@/lib/api/subscription-plans';
import type { SubscriptionPlanItem } from '@/types/api';

interface ArchivePlanDialogProps {
  plan: SubscriptionPlanItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ArchivePlanDialog({
  plan,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ArchivePlanDialogProps) {
  const isActive = plan ? isActiveSubscriptionPlan(plan) : false;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? 'Archive active subscription plan?' : 'Archive subscription plan?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive ? (
              <>
                This will archive <strong>{plan?.name}</strong> and deactivate its Stripe
                product/price. New customers will not be able to subscribe. Existing subscribers
                keep access until their billing period ends, then may be migrated to a replacement
                plan. This action cannot be undone.
              </>
            ) : (
              <>
                This will archive <strong>{plan?.name}</strong>. Archived plans are hidden from new
                subscriptions and cannot be restored from this panel.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Archiving…' : 'Archive plan'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
