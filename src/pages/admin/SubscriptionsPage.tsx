import { useCallback, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
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
  mapSubscriptionPlanFormToCreateRequest,
  mapSubscriptionPlanFormToUpdateRequest,
  SubscriptionPlanForm,
  type SubscriptionPlanFormValues,
} from "@/components/features/super-admin/SubscriptionPlanForm";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import {
  useCreateSubscriptionPlan,
  useDeleteSubscriptionPlan,
  useUpdateSubscriptionPlan,
} from "@/hooks/useSubscriptionPlanMutations";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  PlanStatus,
  SubscriptionPlan,
  SubscriptionPlanRole,
} from "@/types/api";

const ROLE_OPTIONS: { value: SubscriptionPlanRole; label: string }[] = [
  { value: "org_admin", label: "Organization admin" },
  { value: "coach", label: "Coach" },
];

const STATUS_FILTER_OPTIONS: { value: PlanStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

function formatBillingFrequency(value: string): string {
  return value === "yearly" ? "Yearly" : "Monthly";
}

function formatPrice(amount: string, currency: string): string {
  const num = Number(amount);
  if (Number.isNaN(num)) return `${currency} ${amount}`;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(num);
}

function parseRole(value: string | null): SubscriptionPlanRole {
  return value === "coach" ? "coach" : "org_admin";
}

export function SubscriptionsPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const role = parseRole(searchParams.get("role"));
  const statusFilter = searchParams.get("status") ?? "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.max(10, Number(searchParams.get("page_size")) || 10);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (debouncedSearch === urlSearch) return;
    updateParams({
      search: debouncedSearch || null,
      page: "1",
    });
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, isLoading, isError, error, refetch } = useSubscriptionPlans({
    role,
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? (statusFilter as PlanStatus) : undefined,
  });

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();

  if (!isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  const openCreateForm = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };

  const handleRoleChange = (value: SubscriptionPlanRole) => {
    updateParams({ role: value, page: "1" });
  };

  const handleStatusFilterChange = (value: string) => {
    updateParams({ status: value, page: "1" });
  };

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    {
      id: "price",
      header: "Price",
      cell: (row) => formatPrice(row.price_amount, row.currency),
      className: "tabular-nums",
    },
    {
      id: "duration",
      header: "Duration",
      cell: (row) => formatBillingFrequency(row.billing_frequency),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
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
              className="h-8 w-8"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingPlan(row);
                setFormOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
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

  const handleFormSubmit = async (values: SubscriptionPlanFormValues) => {
    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          planId: editingPlan.id,
          role,
          body: mapSubscriptionPlanFormToUpdateRequest(values),
        });
      } else {
        await createMutation.mutateAsync(
          mapSubscriptionPlanFormToCreateRequest(values, role),
        );
      }
      setFormOpen(false);
      setEditingPlan(null);
    } catch {
      // Errors surfaced via mutation toast handlers
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ planId: deleteTarget.id, role });
      setDeleteTarget(null);
    } catch {
      // Errors surfaced via mutation toast handlers
    }
  };

  const isActivePlan =
    deleteTarget?.is_active === true || deleteTarget?.status === "active";

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  const addPlanButton = (
    <Button className="min-h-11" onClick={openCreateForm}>
      <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
      Add plan
    </Button>
  );

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Subscriptions"
        description="Manage subscription plans for organization admins and coaches."
        action={
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger
              className="h-9 w-[180px] bg-background"
              aria-label="Filter plans by role"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

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
        searchPlaceholder="Search plans…"
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel="Status"
        filterOptions={STATUS_FILTER_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }))}
        filterValue={statusFilter}
        onFilterChange={handleStatusFilterChange}
        serverSide
        emptyTitle="No subscription plans"
        emptyDescription="Create a plan for this role to get started."
        primaryAction={addPlanButton}
        emptyAction={addPlanButton}
        pagination={{
          page,
          pageSize,
          total: data?.pagination.total ?? 0,
        }}
        onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
        onPageSizeChange={(size) =>
          updateParams({ page_size: String(size), page: "1" })
        }
      />

      <SubscriptionPlanForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPlan(null);
        }}
        role={role}
        plan={editingPlan}
        isLoading={isFormLoading}
        onSubmit={(values) => void handleFormSubmit(values)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove subscription plan?"
        description={
          isActivePlan
            ? `This plan is active. Removing "${deleteTarget?.name}" may affect organizations. This action cannot be undone.`
            : `This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`
        }
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
