import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PageHeader } from "@/components/PageHeader";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  SubscriptionForm,
  type SubscriptionFormValues,
} from "@/components/SubscriptionForm";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { ApiClientError } from "@/services/api-client";
import { getAuthToken } from "@/services/api-client";
import { isActiveStatus } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types/super-admin";

const PAGE_SIZE = 10;

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const {
    subscriptions,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    isMutating,
  } = useSubscriptions();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<SubscriptionPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.duration.toLowerCase().includes(query) ||
        s.status.toLowerCase().includes(query)
    );
  }, [subscriptions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openCreate = () => {
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (subscription: SubscriptionPlan) => {
    setFormMode("edit");
    setSelected(subscription);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: SubscriptionFormValues) => {
    try {
      if (formMode === "create") {
        await create({
          name: values.name,
          price: values.price,
          duration: values.duration,
          description: values.description,
          status: values.status,
        });
        toast.success("Subscription plan created successfully.");
      } else if (selected) {
        await update(selected.id, {
          name: values.name,
          price: values.price,
          duration: values.duration,
          description: values.description ?? null,
          status: values.status,
        });
        toast.success("Subscription plan updated successfully.");
      }
      setFormOpen(false);
      setSelected(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save subscription plan.";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Subscription plan removed successfully.");
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove subscription plan.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isActiveDelete =
    deleteTarget !== null && isActiveStatus(deleteTarget.status);

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Subscription Plans"
        description="Manage subscription offerings for organizations"
        action={
          <Button onClick={openCreate} aria-label="Add new subscription plan">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Plan
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search plans…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search subscription plans"
          />
        </div>
        <Button
          onClick={openCreate}
          className="sm:hidden"
          aria-label="Add new subscription plan"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Plan
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {!error && !isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No subscription plans"
          description={
            search
              ? "No plans match your search. Try a different term."
              : "Get started by adding your first subscription plan."
          }
          action={
            !search ? (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Plan
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <SubscriptionTable
            subscriptions={paginated}
            isLoading={isLoading}
            onEdit={openEdit}
            onRemove={setDeleteTarget}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? "Add New Subscription Plan"
                : "Edit Subscription Plan"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Fill in the details to create a new subscription plan."
                : "Update the subscription plan details below."}
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            mode={formMode}
            initialData={selected ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={isMutating}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove subscription plan"
        description={
          isActiveDelete ? (
            <span className="space-y-2">
              <span className="block font-medium text-warning">
                Warning: This is an active subscription plan.
              </span>
              <span className="block">
                Removing &ldquo;{deleteTarget?.name}&rdquo; may affect
                organizations currently subscribed to this plan. This action
                cannot be undone.
              </span>
            </span>
          ) : (
            `Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`
          )
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </SuperAdminLayout>
  );
}
