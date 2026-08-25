import { Plus } from 'lucide-react';
import { useState } from 'react';
import SubscriptionForm, {
  type SubscriptionFormValues,
} from '@/components/features/subscriptions/SubscriptionForm';
import SubscriptionPlansTable from '@/components/features/subscriptions/SubscriptionPlansTable';
import AdminLayout from '@/components/layout/AdminLayout';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from '@/hooks/useSubscriptionPlans';
import { getSubscriptionErrorMessage } from '@/services/subscriptions';
import { isActiveSubscriptionStatus } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types/subscription';

type FormMode = 'create' | 'edit';

export default function SubscriptionsPage() {
  const { data, isLoading, isError, error, refetch } = useSubscriptionPlans();
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(
    null,
  );

  const plans = data?.items ?? [];
  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedPlan(null);
    setFormOpen(true);
  };

  const openEditForm = (plan: SubscriptionPlan) => {
    setFormMode('edit');
    setSelectedPlan(plan);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (isFormSubmitting) {
      return;
    }

    setFormOpen(false);
    setSelectedPlan(null);
  };

  const handleFormSubmit = async (values: SubscriptionFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
      price: parseFloat(values.price),
      billing_cycle: values.billing_cycle,
      is_published: values.is_published,
    };

    if (formMode === 'create') {
      await createMutation.mutateAsync(payload);
    } else if (selectedPlan) {
      await updateMutation.mutateAsync({
        id: selectedPlan.id,
        payload,
      });
    }

    setFormOpen(false);
    setSelectedPlan(null);
  };

  const openDeleteDialog = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) {
      return;
    }

    await deleteMutation.mutateAsync(planToDelete.id);
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const listError = isError
    ? getSubscriptionErrorMessage(error)
    : null;

  return (
    <AdminLayout title="Subscriptions">
      <PageHeader
        title="Subscription Plans"
        description="Manage subscription offerings for organizations. Create, edit, and remove plans as needed."
        action={
          <Button
            type="button"
            onClick={openCreateForm}
            aria-label="Add new subscription plan"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Plan
          </Button>
        }
      />

      <SubscriptionPlansTable
        plans={plans}
        loading={isLoading}
        error={listError}
        onRetry={() => {
          void refetch();
        }}
        onEdit={openEditForm}
        onRemove={openDeleteDialog}
      />

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
          aria-describedby="subscription-form-description"
        >
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? 'Add New Subscription Plan'
                : 'Edit Subscription Plan'}
            </DialogTitle>
            <DialogDescription id="subscription-form-description">
              {formMode === 'create'
                ? 'Fill in the details below to create a new subscription plan.'
                : 'Update the subscription plan details below.'}
            </DialogDescription>
          </DialogHeader>

          <SubscriptionForm
            mode={formMode}
            initialPlan={selectedPlan}
            loading={isFormSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => !open && closeDeleteDialog()}
        title="Remove subscription plan"
        description={
          planToDelete
            ? `Are you sure you want to remove "${planToDelete.name}"? This action cannot be undone.`
            : 'Are you sure you want to remove this subscription plan?'
        }
        warning={
          planToDelete && isActiveSubscriptionStatus(planToDelete.status)
            ? 'Warning: This is an active subscription plan. Removing it may affect organizations currently subscribed to this plan.'
            : undefined
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isDeleting}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </AdminLayout>
  );
}
