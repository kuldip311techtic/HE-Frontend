import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ArchivePlanDialog } from '@/components/features/subscriptions/ArchivePlanDialog';
import {
  SubscriptionPlanFormDialog,
  type SubscriptionPlanFormValues,
} from '@/components/features/subscriptions/SubscriptionPlanFormDialog';
import { SubscriptionPlansTable } from '@/components/features/subscriptions/SubscriptionPlansTable';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useArchiveSubscriptionPlan,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
} from '@/hooks/useSubscriptionPlanMutations';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { buildDefaultCreatePayload, getSubscriptionRoleLabel } from '@/lib/api/subscription-plans';
import { getApiErrorMessage } from '@/lib/api/get-api-error-message';
import { cn } from '@/lib/utils';
import type { PlanStatus, SubscriptionPlanItem, SubscriptionPlanRole } from '@/types/api';

const ROLE_TABS: SubscriptionPlanRole[] = ['org_admin', 'coach'];

function parseRole(value: string | null): SubscriptionPlanRole {
  return value === 'coach' ? 'coach' : 'org_admin';
}

function parseStatus(value: string | null): PlanStatus | undefined {
  if (value === 'active' || value === 'archived') {
    return value;
  }
  return undefined;
}

export function SubscriptionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const role = parseRole(searchParams.get('role'));
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.max(10, Number(searchParams.get('page_size') ?? '20') || 20);
  const status = parseStatus(searchParams.get('status'));
  const searchInput = searchParams.get('search') ?? '';
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useSubscriptionPlans({
    role,
    page,
    pageSize,
    search: debouncedSearch,
    status,
  });

  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const archiveMutation = useArchiveSubscriptionPlan();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const handleRoleChange = (nextRole: SubscriptionPlanRole) => {
    updateSearchParams({ role: nextRole, page: '1' });
  };

  const handleSearchChange = (value: string) => {
    updateSearchParams({ search: value || null, page: '1' });
  };

  const handleStatusChange = (value: string) => {
    updateSearchParams({
      status: value === 'all' ? null : value,
      page: '1',
    });
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams({ page: String(nextPage) });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    updateSearchParams({ page_size: String(nextPageSize), page: '1' });
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setSubmitError(null);
    setFormOpen(true);
  };

  const handleArchive = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setArchiveOpen(true);
  };

  const handleFormSubmit = async (values: SubscriptionPlanFormValues) => {
    setSubmitError(null);

    try {
      if (selectedPlan) {
        await updateMutation.mutateAsync({
          planId: selectedPlan.id,
          role,
          body: {
            name: values.name,
            price_amount: values.price_amount,
            description: values.description || null,
            historical_records_duration: values.historical_records_duration,
            include_offline_sync: values.include_offline_sync,
          },
        });
        toast.success('Subscription plan updated successfully.');
      } else {
        const defaults = buildDefaultCreatePayload(role);
        await createMutation.mutateAsync({
          role,
          name: values.name,
          billing_frequency: values.billing_frequency,
          currency: defaults.currency,
          price_amount: values.price_amount,
          teams_limit_type: defaults.teams_limit_type,
          teams_count: defaults.teams_count,
          coaches_limit_type: defaults.coaches_limit_type,
          coaches_count: defaults.coaches_count,
          players_limit_type: defaults.players_limit_type,
          players_count: defaults.players_count,
          historical_records_duration: values.historical_records_duration,
          is_active: defaults.is_active,
          include_offline_sync: values.include_offline_sync,
          description: values.description || null,
          features: defaults.features,
        });
        toast.success('Subscription plan created successfully.');
      }

      setFormOpen(false);
      setSelectedPlan(null);
    } catch (mutationError) {
      setSubmitError(getApiErrorMessage(mutationError));
    }
  };

  const handleArchiveConfirm = async () => {
    if (!selectedPlan) {
      return;
    }

    try {
      await archiveMutation.mutateAsync({
        planId: selectedPlan.id,
        role,
      });
      toast.success('Subscription plan archived successfully.');
      setArchiveOpen(false);
      setSelectedPlan(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError));
    }
  };

  const emptyDescription = useMemo(() => {
    if (debouncedSearch) {
      return 'No subscription plans match your search. Try a different term or clear filters.';
    }
    if (status) {
      return `No ${status} plans for ${getSubscriptionRoleLabel(role).toLowerCase()}.`;
    }
    return `No plans for ${getSubscriptionRoleLabel(role).toLowerCase()} yet.`;
  }, [debouncedSearch, role, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-outfit text-body-25">Subscriptions</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Manage subscription plans for organization admins and coaches.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add plan
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {ROLE_TABS.map((tabRole) => (
          <button
            key={tabRole}
            type="button"
            onClick={() => handleRoleChange(tabRole)}
            className={cn(
              'rounded-md px-4 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              role === tabRole
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
            aria-current={role === tabRole ? 'page' : undefined}
          >
            {getSubscriptionRoleLabel(tabRole)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search plans…"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-10 max-w-sm"
            aria-label="Search subscription plans"
          />
          <Select value={status ?? 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-full sm:w-[180px]" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data?.counts ? (
          <p className="text-body-sm text-muted-foreground">
            {data.counts.active} active · {data.counts.archived} archived
          </p>
        ) : null}
      </div>

      {isLoading ? <LoadingState message="Loading subscription plans…" /> : null}

      {isError ? (
        <EmptyState
          title="Unable to load subscription plans"
          description={getApiErrorMessage(error)}
          action={
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data ? (
        data.items.length > 0 ? (
          <div className="space-y-4">
            <SubscriptionPlansTable
              plans={data.items}
              onEdit={handleEdit}
              onArchive={handleArchive}
            />
            <DataTablePagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        ) : (
          <EmptyState
            title="No subscription plans"
            description={emptyDescription}
            action={
              <Button type="button" onClick={handleAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add plan
              </Button>
            }
          />
        )
      ) : null}

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={role}
        plan={selectedPlan}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <ArchivePlanDialog
        plan={selectedPlan}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onConfirm={() => void handleArchiveConfirm()}
        isLoading={archiveMutation.isPending}
      />
    </div>
  );
}
