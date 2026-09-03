import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { SubscriptionPlanForm } from "@/components/features/super-admin/SubscriptionPlanForm";
import type { SubscriptionPlanFormValues } from "@/components/features/super-admin/SubscriptionPlanForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from "@/hooks/useSubscriptionPlans";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan, SubscriptionPlanRole } from "@/types/api";

const FORM_ID = "subscription-plan-form";

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const ROLE_TABS: { value: SubscriptionPlanRole; label: string }[] = [
  { value: "org_admin", label: "Org Admin" },
  { value: "coach", label: "Coach" },
];

export function SubscriptionsPage() {
  const [activeRole, setActiveRole] = useState<SubscriptionPlanRole>("org_admin");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebouncedValue(search);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [removeTarget, setRemoveTarget] = useState<SubscriptionPlan | null>(null);

  const { data, isLoading, isError, error, refetch } = useSubscriptionPlans({
    role: activeRole,
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as "active" | "archived"),
  });

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, statusFilter, activeRole]);

  const openCreate = () => {
    setDialogMode("create");
    setSelectedPlan(null);
    setDialogOpen(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setDialogMode("edit");
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const buildCreatePayload = (values: SubscriptionPlanFormValues) => ({
    role: activeRole,
    name: values.name,
    billing_frequency: values.billing_frequency,
    currency: values.currency.toUpperCase(),
    price_amount: values.price_amount,
    teams_limit_type: "limited" as const,
    players_limit_type: "limited" as const,
    historical_records_duration: "3_months" as const,
    description: values.description || null,
    is_active: true,
  });

  const handleSubmit = async (values: SubscriptionPlanFormValues) => {
    try {
      if (dialogMode === "create") {
        await createMutation.mutateAsync(buildCreatePayload(values));
        toast.success("Subscription plan created successfully.");
      } else if (selectedPlan) {
        await updateMutation.mutateAsync({
          planId: selectedPlan.id,
          role: activeRole,
          data: {
            name: values.name,
            billing_frequency: values.billing_frequency,
            currency: values.currency.toUpperCase(),
            price_amount: values.price_amount,
            description: values.description || null,
          },
        });
        toast.success("Changes saved successfully.");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to save subscription plan. Please try again."),
      );
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      const result = await deleteMutation.mutateAsync({
        planId: removeTarget.id,
        role: activeRole,
      });
      toast.success(result.message || "Subscription plan removed successfully.");
      setRemoveTarget(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to remove subscription plan. Please try again."),
      );
    }
  };

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => <span className="text-body-13 text-foreground">{row.name}</span>,
    },
    {
      id: "price",
      header: "Price",
      cell: (row) => (
        <span className="tabular-nums text-body-21 text-foreground">
          {row.currency} {row.price_amount}
        </span>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      cell: (row) => (
        <span className="capitalize text-body-21 text-foreground">
          {row.billing_frequency}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "default" : "outline"} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      className: "w-[60px] text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setRemoveTarget(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const removeDescription =
    removeTarget?.status === "active"
      ? `This will remove the active plan "${removeTarget.name}". Organizations currently subscribed may lose access to plan features. This action archives the plan and cannot be easily undone.`
      : `This will remove "${removeTarget?.name}". Archived plans are no longer available for new subscriptions. This action cannot be undone.`;

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Subscriptions"
        description="View, add, edit, and remove subscription plans for organization admins and coaches."
      />

      <div
        className="flex flex-wrap gap-[10px]"
        role="tablist"
        aria-label="Subscription plan role"
      >
        {ROLE_TABS.map((tab) => (
          <Button
            key={tab.value}
            role="tab"
            aria-selected={activeRole === tab.value}
            variant={activeRole === tab.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveRole(tab.value)}
            className={cn(
              "min-h-9",
              activeRole === tab.value && "bg-primary text-primary-foreground",
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={
          isError
            ? getApiErrorMessage(
                error,
                "Unable to load subscription plans. Please try again.",
              )
            : null
        }
        onRetry={() => void refetch()}
        searchPlaceholder="Search subscription plans…"
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel="Status"
        filterOptions={[
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ]}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        serverSide
        primaryAction={
          <Button onClick={openCreate} className="min-h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add subscription plan
          </Button>
        }
        emptyTitle="No subscription plans"
        emptyDescription="Add a subscription plan for this role to get started."
        emptyAction={
          <Button onClick={openCreate} className="min-h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add subscription plan
          </Button>
        }
        pagination={{
          page,
          pageSize,
          total: data?.pagination.total ?? 0,
        }}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Add new subscription plan"
                : "Edit subscription plan"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? `Create a subscription plan for ${activeRole === "org_admin" ? "organization admins" : "coaches"}.`
                : "Update the subscription plan details below."}
            </DialogDescription>
          </DialogHeader>

          <SubscriptionPlanForm
            mode={dialogMode}
            role={activeRole}
            plan={selectedPlan}
            formId={FORM_ID}
            onSubmit={handleSubmit}
          />

          <DialogFooter className="gap-[10px] sm:gap-[10px]">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {dialogMode === "create"
                ? createMutation.isPending
                  ? "Creating…"
                  : "Save"
                : updateMutation.isPending
                  ? "Saving…"
                  : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title={
          removeTarget?.status === "active"
            ? "Remove active subscription plan?"
            : "Remove subscription plan?"
        }
        description={removeDescription}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleRemove}
      />
    </div>
  );
}
