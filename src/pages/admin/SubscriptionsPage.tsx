import * as React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubscriptionsTable } from '@/components/features/admin/subscriptions/SubscriptionsTable';
import { SubscriptionFormDialog } from '@/components/features/admin/subscriptions/SubscriptionFormDialog';
import { SubscriptionDetailModal } from '@/components/features/admin/subscriptions/SubscriptionDetailModal';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useSubscriptionsList } from '@/hooks/useSubscriptions';
import { captureReturnFocus } from '@/lib/utils/captureReturnFocus';
import type { SubscriptionPlan } from '@/types/subscription';

export function SubscriptionsPage() {
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const { data, isLoading, isError, error, refetch } = useSubscriptionsList();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<SubscriptionPlan | null>(null);
  const [viewTarget, setViewTarget] = React.useState<SubscriptionPlan | null>(null);

  const items = data?.items ?? [];

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (subscription: SubscriptionPlan) => {
    setEditTarget(subscription);
    setFormOpen(true);
  };

  const handleView = (subscription: SubscriptionPlan) => {
    setViewTarget(subscription);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage subscription plans and billing cycles."
        actions={
          <Button
            type="button"
            variant="brand"
            onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Add subscription plan
          </Button>
        }
      />
      <Card>
        <CardContent className="px-6 py-4">
          <SubscriptionsTable
            items={items}
            isLoading={isLoading}
            isError={isError}
            errorMessage={isError ? getApiErrorMessage(error) : undefined}
            onRetry={() => void refetch()}
            onEdit={handleEdit}
            onView={handleView}
            returnFocusRef={returnFocusRef}
            emptyAction={
              <Button
                type="button"
                variant="brand"
                onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4" />
                Add subscription plan
              </Button>
            }
          />
        </CardContent>
      </Card>
      <SubscriptionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        subscription={editTarget}
        returnFocusRef={returnFocusRef}
      />
      <SubscriptionDetailModal
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        subscription={viewTarget}
        returnFocusRef={returnFocusRef}
      />
    </div>
  );
}
