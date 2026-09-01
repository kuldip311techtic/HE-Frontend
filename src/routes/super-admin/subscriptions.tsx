import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { useAddSubscriptionPlan } from "@/hooks/useAddSubscriptionPlan";
import { useEditSubscriptionPlan } from "@/hooks/useEditSubscriptionPlan";
import { useRemoveSubscriptionPlan } from "@/hooks/useRemoveSubscriptionPlan";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import {
  getSubscriptionName,
  isSubscriptionActive,
} from "@/lib/subscription-helpers";
import type { Subscription, SubscriptionFormValues } from "@/types/subscription";

const DEFAULT_PAGE_SIZE = 10;

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] =
    useState<Subscription | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSubscriptionPlans();

  const addSubscriptionMutation = useAddSubscriptionPlan();
  const editSubscriptionMutation = useEditSubscriptionPlan();
  const removeSubscriptionMutation = useRemoveSubscriptionPlan();

  const allSubscriptions = useMemo(
    () => data?.items ?? [],
    [data?.items],
  );
  const total = data?.total ?? allSubscriptions.length;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  const paginatedSubscriptions = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return allSubscriptions.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [allSubscriptions, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const handleCreateSubmit = (values: SubscriptionFormValues) => {
    addSubscriptionMutation.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setPage(1);
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
        values,
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

    removeSubscriptionMutation.mutate(deletingSubscription.id, {
      onSuccess: () => {
        setDeletingSubscription(null);
      },
    });
  };

  const deletingIsActive =
    deletingSubscription !== null && isSubscriptionActive(deletingSubscription);

  return (
    <div className="w-full">
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
          {!isLoading && allSubscriptions.length === 0 ? (
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
                subscriptions={paginatedSubscriptions}
                onEdit={setEditingSubscription}
                onDelete={setDeletingSubscription}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && total > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} ({total} plan
                    {total === 1 ? "" : "s"} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={!hasPrev || isFetching}
                      aria-label="Previous page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={!hasNext || isFetching}
                      aria-label="Next page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Next
                    </Button>
                  </div>
                </div>
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
        isLoading={removeSubscriptionMutation.isPending}
      />

      {deletingIsActive && deletingSubscription !== null && (
        <Notification
          variant="warning"
          message={`${getSubscriptionName(deletingSubscription)} is an active subscription plan.`}
          className="sr-only"
        />
      )}
    </div>
  );
}
