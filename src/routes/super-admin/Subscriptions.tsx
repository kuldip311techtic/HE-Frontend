import { Plus } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Notification } from "@/components/Notification";
import { PageHeader } from "@/components/PageHeader";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { SubscriptionTable } from "@/components/subscriptions/SubscriptionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddSubscription } from "@/hooks/useAddSubscription";
import { useDeleteSubscription } from "@/hooks/useDeleteSubscription";
import { useEditSubscription } from "@/hooks/useEditSubscription";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import {
  getSubscriptionName,
  isSubscriptionActive,
} from "@/lib/subscription-helpers";
import type { Subscription, SubscriptionFormValues } from "@/types/subscription";

function formValuesToPayload(values: SubscriptionFormValues) {
  return {
    name: values.name,
    price: Number(values.price),
    duration: values.duration,
    description: values.description,
  };
}

export default function Subscriptions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] =
    useState<Subscription | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSubscriptions();

  const addSubscriptionMutation = useAddSubscription();
  const editSubscriptionMutation = useEditSubscription();
  const deleteSubscriptionMutation = useDeleteSubscription();

  const subscriptions = data?.items ?? [];
  const total = data?.total ?? subscriptions.length;

  const handleCreateSubmit = (values: SubscriptionFormValues) => {
    addSubscriptionMutation.mutate(formValuesToPayload(values), {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const handleEditSubmit = (values: SubscriptionFormValues) => {
    if (!editingSubscription) {
      return;
    }

    editSubscriptionMutation.mutate(
      {
        id: editingSubscription.id,
        payload: formValuesToPayload(values),
      },
      {
        onSuccess: () => {
          setEditingSubscription(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingSubscription) {
      return;
    }

    deleteSubscriptionMutation.mutate(deletingSubscription.id, {
      onSuccess: () => {
        setDeletingSubscription(null);
      },
    });
  };

  const deletingIsActive =
    deletingSubscription !== null && isSubscriptionActive(deletingSubscription);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Subscription Plans"
        description="View, add, edit, and remove subscription plans for organizations."
        action={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="min-h-11 w-full sm:w-auto"
            aria-label="Add new subscription plan"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add plan
          </Button>
        }
      />

      {isError ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Notification
              variant="error"
              message={error?.message ?? "Failed to load subscription plans."}
            />
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!isLoading && subscriptions.length === 0 ? (
            <EmptyState
              title="No subscription plans yet"
              description="Get started by adding your first subscription plan."
              action={
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="min-h-11"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add plan
                </Button>
              }
            />
          ) : (
            <>
              <SubscriptionTable
                subscriptions={subscriptions}
                onEdit={setEditingSubscription}
                onDelete={setDeletingSubscription}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && total > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {total} plan{total === 1 ? "" : "s"} total
                </p>
              )}
            </>
          )}
        </>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add subscription plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan with pricing and duration details.
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            mode="create"
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={addSubscriptionMutation.isPending}
            error={addSubscriptionMutation.error}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingSubscription !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSubscription(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit subscription plan</DialogTitle>
            <DialogDescription>
              Update details for{" "}
              {editingSubscription
                ? getSubscriptionName(editingSubscription)
                : "this plan"}
              .
            </DialogDescription>
          </DialogHeader>
          {editingSubscription && (
            <SubscriptionForm
              mode="edit"
              subscription={editingSubscription}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingSubscription(null)}
              isLoading={editSubscriptionMutation.isPending}
              error={editSubscriptionMutation.error}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingSubscription !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingSubscription(null);
          }
        }}
        title="Remove subscription plan"
        description={
          deletingSubscription
            ? deletingIsActive
              ? `Warning: ${getSubscriptionName(deletingSubscription)} is currently active and may be in use by organizations. Removing it may affect existing subscriptions. Are you sure you want to proceed? This action cannot be undone.`
              : `Are you sure you want to remove ${getSubscriptionName(deletingSubscription)}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSubscriptionMutation.isPending}
      />

      {deletingIsActive && deletingSubscription !== null && (
        <div className="sr-only" role="status" aria-live="polite">
          Warning: attempting to remove an active subscription plan.
        </div>
      )}
    </div>
  );
}
