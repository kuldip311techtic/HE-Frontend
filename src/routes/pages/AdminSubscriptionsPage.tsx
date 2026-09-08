import '@/theme/admin-subscriptions.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ArchivePlanDialog } from '@/components/features/subscriptions/ArchivePlanDialog';
import { SubscriptionPlanForm } from '@/components/features/subscriptions/SubscriptionPlanForm';
import { SubscriptionPlansTable } from '@/components/features/subscriptions/SubscriptionPlansTable';
import { SubscriptionPlanViewDialog } from '@/components/features/subscriptions/SubscriptionPlanViewDialog';
import { TogglePlanActiveDialog } from '@/components/features/subscriptions/TogglePlanActiveDialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { TablePagination } from '@/components/ui/pagination';
import { useSubscriptionPlanMutations } from '@/hooks/useSubscriptionPlanMutations';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from '@/lib/constants/search';
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
  const [viewOpen, setViewOpen] = useState(false);
  const [toggleActiveOpen, setToggleActiveOpen] = useState(false);
  const [toggleActiveTarget, setToggleActiveTarget] = useState(true);
  const [toggleActiveError, setToggleActiveError] = useState<string | null>(null);

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

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateParams({ search: trimmed || null, page: '1' });
    }, DEFAULT_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  const handleRoleChange = (nextRole: SubscriptionPlanRole) => {
    updateParams({ role: nextRole, page: '1' });
  };

  const handleAddPlan = () => {
    setFormMode('create');
    setSelectedPlan(null);
    setFormOpen(true);
  };

  const handleViewPlan = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setViewOpen(true);
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

  const handleToggleActive = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setToggleActiveTarget(!plan.is_active);
    setToggleActiveError(null);
    setToggleActiveOpen(true);
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

  const handleConfirmToggleActive = async () => {
    if (!selectedPlan) return;
    setToggleActiveError(null);
    try {
      await update.mutateAsync({
        planId: selectedPlan.id,
        payload: { is_active: toggleActiveTarget },
      });
      setToggleActiveOpen(false);
      setSelectedPlan(null);
    } catch (err) {
      setToggleActiveError(
        getApiErrorMessage(err, 'Unable to update plan status. Please try again.'),
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
    <div className="admin-manage-page admin-subscriptions-page">
      <div className="admin-manage-page__glow" aria-hidden="true" />
      <div className="admin-manage-page__inner">
        <header className="admin-manage-page__header">
          <h2 className="text-body-42">Manage Subscriptions</h2>
          <p className="text-body-sm">
            View, add, edit, and archive subscription plans for organizations and coaches.
          </p>
        </header>

        <div className="admin-subscriptions-page__role-tabs" role="tablist" aria-label="Plan role">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={role === tab.value}
              onClick={() => handleRoleChange(tab.value)}
              className={role === tab.value ? 'admin-primary-btn' : 'admin-outline-btn'}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-manage-page__toolbar">
          <div className="admin-manage-page__toolbar-filters">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search plans…"
              aria-label="Search subscription plans"
              className="admin-field-input w-full sm:max-w-md"
            />
            <select
              value={status}
              onChange={(event) =>
                updateParams({ status: event.target.value || null, page: '1' })
              }
              aria-label="Filter by status"
              className="admin-field-select sm:w-auto"
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
              className="admin-field-select sm:w-auto"
            >
              <option value="">All durations</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <Button type="button" onClick={handleAddPlan} className="admin-primary-btn shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add plan
          </Button>
        </div>

        {isError ? (
          <EmptyState
            title="Unable to load subscription plans"
            description={getApiErrorMessage(
              error,
              'Unable to load subscription plans. Please try again.',
            )}
            action={
              <Button
                onClick={() => refetch()}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-primary-btn"
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </Button>
            }
          />
        ) : null}

        {!isError && isLoading ? (
          <SubscriptionPlansTable
            plans={[]}
            isLoading
            onView={() => {}}
            onEdit={() => {}}
            onArchive={() => {}}
            onToggleActive={() => {}}
          />
        ) : null}

        {!isError && !isLoading && plans.length === 0 ? (
          <EmptyState
            title="No subscription plans yet"
            description="Create your first subscription plan to offer it to organizations."
            action={
              <Button type="button" onClick={handleAddPlan} className="admin-primary-btn">
                Add plan
              </Button>
            }
          />
        ) : null}

        {!isError && !isLoading && plans.length > 0 ? (
          <div className="flex flex-col gap-4">
            <SubscriptionPlansTable
              plans={plans}
              onView={handleViewPlan}
              onEdit={handleEditPlan}
              onArchive={handleArchivePlan}
              onToggleActive={handleToggleActive}
            />
            {pagination ? (
              <TablePagination
                pagination={pagination}
                appearance="admin"
                onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
                onPageSizeChange={(nextSize) =>
                  updateParams({ page_size: String(nextSize), page: '1' })
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <SubscriptionPlanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        role={role}
        plan={selectedPlan}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
      />

      <SubscriptionPlanViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        plan={selectedPlan}
      />

      <ArchivePlanDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        plan={selectedPlan}
        onConfirm={handleConfirmArchive}
        isLoading={archive.isPending}
        errorMessage={archiveError}
      />

      <TogglePlanActiveDialog
        open={toggleActiveOpen}
        onOpenChange={setToggleActiveOpen}
        plan={selectedPlan}
        nextActive={toggleActiveTarget}
        onConfirm={handleConfirmToggleActive}
        isLoading={update.isPending}
        errorMessage={toggleActiveError}
      />
    </div>
  );
}
