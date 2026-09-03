import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ArchivePlanDialog } from '@/components/features/subscriptions/ArchivePlanDialog';
import { SubscriptionPlanForm } from '@/components/features/subscriptions/SubscriptionPlanForm';
import { SubscriptionPlansTable } from '@/components/features/subscriptions/SubscriptionPlansTable';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { TablePagination } from '@/components/ui/pagination';
import { useSubscriptionPlanMutations } from '@/hooks/useSubscriptionPlanMutations';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getApiErrorMessage } from '@/lib/utils/errors';
import type {
  BillingFrequency,
  PlanStatus,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscriptions';

const ROLE_TABS: { value: SubscriptionPlanRole; label: string }[] = [
  { value: 'org_admin', label: 'Organization plans' },
  { value: 'coach', label: 'Coach plans' },
];

export function AdminSubscriptionsPage() {
  const { isHydrating } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const role = (searchParams.get('role') as SubscriptionPlanRole) || 'org_admin';
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;
  const pageSize = Number.parseInt(searchParams.get('page_size') ?? '10', 10) || 10;
  const search = searchParams.get('search') ?? '';
  const status = (searchParams.get('status') as PlanStatus | '') || '';
  const billingFrequency = (searchParams.get('billing_frequency') as BillingFrequency | '') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const listParams = useMemo(
    () => ({
      role,
      page,
      page_size: pageSize,
      search: search || null,
      status: status || null,
      billing_frequency: billingFrequency || null,
    }),
    [role, page, pageSize, search, status, billingFrequency],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useSubscriptionPlans(listParams);
  const { create, update, archive } = useSubscriptionPlanMutations(role);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const handleRoleChange = (nextRole: SubscriptionPlanRole) => {
    updateParams({ role: nextRole, page: '1' });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim() || null, page: '1' });
  };

  const handleAddPlan = () => {
    setFormMode('create');
    setSelectedPlan(null);
    setFormOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlanItem) => {
    setFormMode('edit');
    setSelectedPlan(plan);
    setFormOpen(true);
  };

  const handleArchivePlan = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setArchiveError(null);
    setArchiveOpen(true);
  };

  const handleFormSubmit = async (
    payload: SubscriptionPlanCreateRequest | SubscriptionPlanUpdateRequest,
  ) => {
    if (formMode === 'create') {
      await create.mutateAsync(payload as SubscriptionPlanCreateRequest);
    } else if (selectedPlan) {
      await update.mutateAsync({ planId: selectedPlan.id, payload });
    }
  };

  const handleConfirmArchive = async () => {
    if (!selectedPlan) return;
    setArchiveError(null);
    try {
      await archive.mutateAsync(selectedPlan.id);
      setArchiveOpen(false);
      setSelectedPlan(null);
    } catch (err) {
      setArchiveError(
        getApiErrorMessage(err, 'Unable to archive subscription plan. Please try again.'),
      );
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading subscriptions…" fullPage />;
  }

  const plans = data?.items ?? [];
  const pagination = data?.pagination;
  const isFormSubmitting = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-body-42 text-foreground">Manage Subscriptions</h2>
          <p className="mt-1 font-outfit text-body-sm text-muted-foreground">
            View, add, edit, and archive subscription plans for organizations and coaches.
          </p>
        </div>
        <Button type="button" onClick={handleAddPlan} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add plan
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Plan role">
        {ROLE_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={role === tab.value}
            variant={role === tab.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleRoleChange(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search plans…"
            aria-label="Search subscription plans"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(event) =>
              updateParams({ status: event.target.value || null, page: '1' })
            }
            aria-label="Filter by status"
            className="h-10 rounded-lg border border-border bg-input px-3 font-outfit text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={billingFrequency}
            onChange={(event) =>
              updateParams({ billing_frequency: event.target.value || null, page: '1' })
            }
            aria-label="Filter by duration"
            className="h-10 rounded-lg border border-border bg-input px-3 font-outfit text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All durations</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {isError ? (
        <EmptyState
          title="Unable to load subscription plans"
          description={getApiErrorMessage(
            error,
            'Unable to load subscription plans. Please try again.',
          )}
          action={
            <Button onClick={() => refetch()} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          }
        />
      ) : null}

      {!isError && isLoading ? (
        <SubscriptionPlansTable plans={[]} isLoading onEdit={() => {}} onArchive={() => {}} />
      ) : null}

      {!isError && !isLoading && plans.length === 0 ? (
        <EmptyState
          title="No subscription plans yet"
          description="Create your first subscription plan to offer it to organizations."
          action={
            <Button type="button" onClick={handleAddPlan}>
              Add plan
            </Button>
          }
        />
      ) : null}

      {!isError && !isLoading && plans.length > 0 ? (
        <div className="space-y-4">
          <SubscriptionPlansTable
            plans={plans}
            onEdit={handleEditPlan}
            onArchive={handleArchivePlan}
          />
          {pagination ? (
            <TablePagination
              pagination={pagination}
              onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
              onPageSizeChange={(nextSize) =>
                updateParams({ page_size: String(nextSize), page: '1' })
              }
            />
          ) : null}
        </div>
      ) : null}

      <SubscriptionPlanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        role={role}
        plan={selectedPlan}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
      />

      <ArchivePlanDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        plan={selectedPlan}
        onConfirm={handleConfirmArchive}
        isLoading={archive.isPending}
        errorMessage={archiveError}
      />
    </div>
  );
}
