import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubscriptionPlanItem } from '@/types/subscriptions';
import {
  formatPlanDate,
  formatPlanPrice,
  getPlanCellDisplayValue,
  humanizeEnum,
  PLAN_TABLE_COLUMNS,
  type PlanColumnId,
} from '@/components/features/subscriptions/subscription-plan-table-utils';

interface SubscriptionPlanViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlanItem | null;
}

export function SubscriptionPlanViewDialog({
  open,
  onOpenChange,
  plan,
}: SubscriptionPlanViewDialogProps) {
  const isOpen = open && plan !== null;
  const detailFields: PlanColumnId[] = PLAN_TABLE_COLUMNS.map((column) => column.id);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      titleId="plan-view-title"
      descriptionId="plan-view-description"
      className="admin-form-dialog admin-form-dialog--view"
    >
      {plan ? (
        <>
          <DialogHeader className="admin-form-dialog__header border-0 px-6 py-5">
            <DialogTitle id="plan-view-title" className="admin-form-dialog__title border-0">
              {plan.name}
            </DialogTitle>
            <DialogDescription id="plan-view-description" className="admin-form-dialog__description">
              Subscription plan details
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="admin-form-dialog__content max-h-[60vh] overflow-y-auto border-0 py-5">
            <dl className="grid gap-3 sm:grid-cols-2">
              {detailFields.map((field) => {
                const label =
                  PLAN_TABLE_COLUMNS.find((column) => column.id === field)?.label ?? field;
                const value =
                  field === 'price_amount'
                    ? formatPlanPrice(plan.price_amount, plan.currency)
                    : getPlanCellDisplayValue(plan, field);

                return (
                  <div key={field} className="min-w-0">
                    <dt className="font-lato text-body-5 text-figma-accent">{label}</dt>
                    <dd className="mt-0.5 break-words font-outfit text-body-sm text-white">
                      {field === 'status' ? humanizeEnum(plan.status) : value}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {plan.archived_at ? (
              <p className="mt-4 font-outfit text-body-sm text-muted-foreground">
                Archived {formatPlanDate(plan.archived_at)}
              </p>
            ) : null}
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}
