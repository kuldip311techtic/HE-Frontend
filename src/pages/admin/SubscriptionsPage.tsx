import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  SubscriptionPlanFormDialog,
  type PlanFormValues,
} from "@/components/admin/SubscriptionPlanFormDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSubscriptionPlanMutations,
  useSubscriptionPlans,
} from "@/hooks/useSubscriptionPlans";
import {
  adminPrimaryActionClass,
  adminSearchInputClass,
  adminToolbarSelectClass,
} from "@/lib/adminFormStyles";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  PlanStatus,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from "@/types/api";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | PlanStatus;

export function SubscriptionsPage() {
  const [role, setRole] = useState<SubscriptionPlanRole>("org_admin");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlanItem | null>(
    null,
  );

  const { createMutation, updateMutation, deleteMutation } =
    useSubscriptionPlanMutations(role);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [role, statusFilter]);

  const { data, isLoading, error, refetch } = useSubscriptionPlans(role, {
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const columns: DataTableColumn<SubscriptionPlanItem>[] = [
    {
      id: "name",
      header: "Name",
      sortable: true,
      getSortValue: (row) => row.name,
      cell: (row) => (
        <div className="min-w-0">
          <span className="block truncate font-outfit text-[14px] font-medium leading-[17.64px] text-white">
            {row.name}
          </span>
          {row.description && (
            <span className="mt-[2px] block truncate font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
              {row.description}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      sortable: true,
      getSortValue: (row) => Number(row.price_amount),
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-white">
          {row.currency} {row.price_amount}
        </span>
      ),
    },
    {
      id: "billing_frequency",
      header: "Duration",
      sortable: true,
      getSortValue: (row) => row.billing_frequency,
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal capitalize leading-[17.64px] text-white">
          {row.billing_frequency}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      getSortValue: (row) => row.status,
      cell: (row) => {
        const isActive = row.status === "active" || row.is_active;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "rounded-[10px] px-[10px] py-[2px] font-outfit text-[14px] font-medium capitalize leading-[17.64px]",
              isActive
                ? "border-transparent bg-figma-brand text-figma-border"
                : "border-figma-border bg-figma-accent/40 text-figma-muted",
            )}
          >
            {row.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-[80px] text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-figma-muted hover:bg-figma-accent/30 hover:text-white"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-figma-border bg-figma-surface font-outfit"
          >
            <DropdownMenuItem
              className="text-white focus:bg-figma-accent/30 focus:text-white"
              onClick={() => {
                setEditingPlan(row);
                setDialogOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#ff6b6b] focus:bg-[#ff414114] focus:text-[#ff6b6b]"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleSubmit = (values: PlanFormValues) => {
    if (editingPlan) {
      updateMutation.mutate(
        {
          id: editingPlan.id,
          data: {
            name: values.name,
            billing_frequency: values.billing_frequency,
            price_amount: values.price_amount,
            description: values.description || null,
          },
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingPlan(null);
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          role,
          name: values.name,
          billing_frequency: values.billing_frequency,
          currency: "USD",
          price_amount: values.price_amount,
          description: values.description || null,
          teams_limit_type: "unlimited",
          players_limit_type: "unlimited",
          historical_records_duration: "unlimited",
          is_active: true,
        },
        {
          onSuccess: () => setDialogOpen(false),
        },
      );
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isActivePlan =
    deleteTarget?.status === "active" || deleteTarget?.is_active;

  const toolbarFilters = (
    <div className="flex w-full shrink-0 flex-col gap-[12px] sm:w-auto sm:flex-row sm:items-center">
      <Select
        value={role}
        onValueChange={(value) => setRole(value as SubscriptionPlanRole)}
      >
        <SelectTrigger
          className={cn(adminToolbarSelectClass, "w-full sm:w-[180px]")}
          aria-label="Plan audience role"
        >
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="border-figma-border bg-figma-surface font-outfit">
          <SelectItem value="org_admin">Organization Admin</SelectItem>
          <SelectItem value="coach">Coach</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as StatusFilter)}
      >
        <SelectTrigger
          className={cn(adminToolbarSelectClass, "w-full sm:w-[140px]")}
          aria-label="Filter by status"
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="border-figma-border bg-figma-surface font-outfit">
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Subscriptions"
        description="Manage subscription plans for organization admins and coaches."
        className="gap-[12px]"
        action={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add plan
          </Button>
        }
      />

      {data?.counts && (
        <div className="flex flex-wrap items-center gap-[12px]">
          <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-figma-muted">
            Active:{" "}
            <span className="font-semibold text-figma-bright">
              {data.counts.active}
            </span>
          </span>
          <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-figma-muted">
            Archived:{" "}
            <span className="font-semibold text-white">
              {data.counts.archived}
            </span>
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        onRetry={() => void refetch()}
        searchPlaceholder="Search plans…"
        searchValue={search}
        onSearchChange={setSearch}
        searchInputClassName={adminSearchInputClass}
        toolbarFilters={toolbarFilters}
        serverPagination
        emptyTitle="No subscription plans yet"
        emptyDescription="Create a plan to offer subscriptions on the platform."
        emptyAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add plan
          </Button>
        }
        primaryAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add plan
          </Button>
        }
        pagination={{
          page,
          pageSize,
          total: data?.pagination.total ?? 0,
        }}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <SubscriptionPlanFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingPlan(null);
        }}
        role={role}
        plan={editingPlan}
        isLoading={isSaving}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove subscription plan?"
        description={
          isActivePlan
            ? `This plan is active. Removing "${deleteTarget?.name}" may affect subscribers. This action cannot be undone.`
            : `This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`
        }
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(
            { id: deleteTarget.id },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
      />
    </div>
  );
}
