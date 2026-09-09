import * as React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/features/shared/ConfirmDialog';
import { DetailFields } from '@/components/features/shared/DetailFields';
import { SubscriptionPlanFormDialog } from '@/components/features/subscriptions/SubscriptionPlanFormDialog';
import { SubscriptionPlansTable } from '@/components/features/subscriptions/SubscriptionPlansTable';
import {
  useArchiveSubscriptionPlan,
  useSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from '@/hooks/useSubscriptionPlans';
import { useListQuery } from '@/hooks/useListQuery';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import {
  formatBoolean,
  formatDateTime,
  formatMoney,
  formatNumber,
  humanize,
} from '@/lib/utils/format';
import type { PaginationMeta } from '@/types/api';
import type {
  BillingFrequency,
  PlanStatus,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from '@/types/subscription';

function toPagination(
  meta: PaginationMeta | undefined,
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  if (meta) return meta;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

function listErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 503) {
    return 'Subscriptions are temporarily unavailable.';
  }
  return getApiErrorMessage(error, 'Unable to load subscription plans. Please try again.');
}

export function SubscriptionsPage() {
  const list = useListQuery({ extraKeys: ['role', 'status', 'billing_frequency', 'is_active'] });
  const role = (list.extras.role as SubscriptionPlanRole | undefined) ?? 'org_admin';
  const status = (list.extras.status as PlanStatus | undefined) ?? 'active';
  const billingFrequency = list.extras.billing_frequency as BillingFrequency | undefined;
  const isActiveFilter =
    list.extras.is_active === 'true' ? true : list.extras.is_active === 'false' ? false : undefined;

  const query = useSubscriptionPlans({
    page: list.page,
    page_size: list.pageSize,
    search: list.search || undefined,
    role,
    status,
    billing_frequency: billingFrequency,
    is_active: isActiveFilter,
  });

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SubscriptionPlanItem | null>(null);
  const [viewing, setViewing] = React.useState<SubscriptionPlanItem | null>(null);
  const [archiving, setArchiving] = React.useState<SubscriptionPlanItem | null>(null);
  const [replacementPlanId, setReplacementPlanId] = React.useState('');
  const [toggling, setToggling] = React.useState<SubscriptionPlanItem | null>(null);

  const replacementsQuery = useSubscriptionPlans(
    { role: archiving?.role ?? role, status: 'active', page: 1, page_size: 50 },
    Boolean(archiving),
  );
  const archiveMutation = useArchiveSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();

  const items = query.data?.items ?? [];
  const counts = query.data?.counts;
  const pagination = toPagination(query.data?.pagination, list.page, list.pageSize, items.length);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleArchive = async () => {
    if (!archiving) return;
    try {
      const response = await archiveMutation.mutateAsync({
        planId: archiving.id,
        role: archiving.role,
        replacementPlanId: replacementPlanId || undefined,
      });
      toast.success(response.message || 'Subscription plan archived successfully.');
      setArchiving(null);
      setReplacementPlanId('');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to archive this plan. Please try again.'));
    }
  };

  const handleToggle = async () => {
    if (!toggling) return;
    try {
      await updateMutation.mutateAsync({
        planId: toggling.id,
        role: toggling.role,
        payload: { is_active: !toggling.is_active },
      });
      toast.success(
        toggling.is_active ? 'Plan deactivated successfully.' : 'Plan activated successfully.',
      );
      setToggling(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update plan status. Please try again.'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Subscription plans"
        description="Manage org admin and coach subscription plans. Archiving keeps existing subscribers until period end."
        actions={
          <Button type="button" variant="brand" onClick={openCreate}>
            Add plan
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2">
        {(['org_admin', 'coach'] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={role === value ? 'brand' : 'outline'}
            onClick={() => list.setExtra('role', value)}
          >
            {value === 'org_admin' ? 'Organization Admin' : 'Coach'}
          </Button>
        ))}
        {(['active', 'archived'] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant={status === value ? 'brand' : 'outline'}
            onClick={() => list.setExtra('status', value)}
          >
            {humanize(value)}
            {counts ? ` (${value === 'active' ? counts.active : counts.archived})` : ''}
          </Button>
        ))}
      </div>
      <SubscriptionPlansTable
        items={items}
        loading={query.isLoading}
        error={query.isError ? listErrorMessage(query.error) : null}
        onRetry={() => void query.refetch()}
        pagination={pagination}
        onPageChange={list.setPage}
        onPageSizeChange={list.setPageSize}
        emptyAction={
          <Button type="button" variant="brand" onClick={openCreate}>
            Add plan
          </Button>
        }
        leadingToolbar={
          <>
            <Input
              value={list.searchInput}
              onChange={(event) => list.setSearchInput(event.target.value)}
              placeholder="Search plans"
              aria-label="Search subscription plans"
              className="md:max-w-sm"
            />
            <Select
              value={list.extras.billing_frequency ?? ''}
              onChange={(event) => list.setExtra('billing_frequency', event.target.value || undefined)}
              aria-label="Filter by billing frequency"
              className="md:w-44"
            >
              <option value="">All frequencies</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
            <Select
              value={list.extras.is_active ?? ''}
              onChange={(event) => list.setExtra('is_active', event.target.value || undefined)}
              aria-label="Filter by active state"
              className="md:w-40"
            >
              <option value="">All active states</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </>
        }
        trailingToolbar={
          <Button type="button" variant="brand" onClick={openCreate}>
            Add plan
          </Button>
        }
        onView={setViewing}
        onEdit={(row) => {
          if (row.status === 'archived') return;
          setEditing(row);
          setFormOpen(true);
        }}
        onArchive={(row) => {
          setReplacementPlanId('');
          setArchiving(row);
        }}
        onToggleActive={setToggling}
      />
      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        plan={editing}
        defaultRole={role}
      />
      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        title={viewing?.name ?? 'Subscription plan'}
        description="Plan details from the live API."
        className="max-w-3xl"
        footer={
          <Button type="button" variant="outline" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing ? (
          <DetailFields
            sections={[
              {
                title: 'Plan',
                fields: [
                  { label: 'Name', value: viewing.name },
                  { label: 'Role', value: humanize(viewing.role) },
                  { label: 'Status', value: humanize(viewing.status) },
                  { label: 'Active', value: formatBoolean(viewing.is_active) },
                  { label: 'Description', value: viewing.description || '—' },
                  { label: 'Features', value: viewing.features.join(', ') || '—' },
                ],
              },
              {
                title: 'Billing',
                fields: [
                  { label: 'Billing frequency', value: humanize(viewing.billing_frequency) },
                  { label: 'Price', value: formatMoney(viewing.price_amount, viewing.currency) },
                  { label: 'Include offline sync', value: formatBoolean(viewing.include_offline_sync) },
                ],
              },
              {
                title: 'Limits',
                fields: [
                  { label: 'Teams limit', value: humanize(viewing.teams_limit_type) },
                  { label: 'Teams count', value: formatNumber(viewing.teams_count) },
                  { label: 'Coaches limit', value: humanize(viewing.coaches_limit_type) },
                  { label: 'Coaches count', value: formatNumber(viewing.coaches_count) },
                  { label: 'Players limit', value: humanize(viewing.players_limit_type) },
                  { label: 'Players count', value: formatNumber(viewing.players_count) },
                  {
                    label: 'Historical records duration',
                    value: humanize(viewing.historical_records_duration),
                  },
                ],
              },
              {
                title: 'Stripe',
                fields: [
                  { label: 'Stripe product id', value: viewing.stripe_product_id },
                  { label: 'Stripe price id', value: viewing.stripe_price_id },
                  { label: 'Stripe status', value: humanize(viewing.stripe_status) },
                ],
              },
              {
                title: 'Lifecycle',
                fields: [
                  { label: 'Archived at', value: formatDateTime(viewing.archived_at) },
                  { label: 'Replacement plan id', value: viewing.replacement_plan_id || '—' },
                  { label: 'Created at', value: formatDateTime(viewing.created_at) },
                  { label: 'Updated at', value: formatDateTime(viewing.updated_at) },
                ],
              },
            ]}
          />
        ) : null}
      </Dialog>
      <ConfirmDialog
        open={Boolean(archiving)}
        onOpenChange={(open) => {
          if (!open) {
            setArchiving(null);
            setReplacementPlanId('');
          }
        }}
        title="Archive this plan?"
        description={
          archiving?.status === 'active' || archiving?.is_active
            ? 'This plan is currently active. Existing subscribers keep the plan until period end. This archives the plan rather than permanently deleting it.'
            : 'Existing subscribers keep the plan until period end. This archives the plan rather than permanently deleting it.'
        }
        confirmLabel="Archive"
        loadingLabel="Archiving…"
        isLoading={archiveMutation.isPending}
        onConfirm={() => {
          void handleArchive();
        }}
      >
        {archiving?.status === 'active' || archiving?.is_active ? (
          <p role="alert" className="text-body-sm text-destructive">
            Warning: this plan is currently active.
          </p>
        ) : null}
        <label className="flex flex-col gap-[10px] text-body-sm text-foreground">
          Replacement plan (optional)
          <Select
            value={replacementPlanId}
            onChange={(event) => setReplacementPlanId(event.target.value)}
            aria-label="Replacement plan"
          >
            <option value="">None</option>
            {(replacementsQuery.data?.items ?? [])
              .filter((plan) => plan.id !== archiving?.id)
              .map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
          </Select>
        </label>
      </ConfirmDialog>
      <ConfirmDialog
        open={Boolean(toggling)}
        onOpenChange={(open) => {
          if (!open) setToggling(null);
        }}
        title={toggling?.is_active ? 'Deactivate plan?' : 'Activate plan?'}
        description={
          toggling?.is_active
            ? 'This will set is_active to false for the selected plan. The change is saved only after you confirm.'
            : 'This will set is_active to true for the selected plan. The change is saved only after you confirm.'
        }
        confirmLabel={toggling?.is_active ? 'Deactivate' : 'Activate'}
        loadingLabel={toggling?.is_active ? 'Deactivating…' : 'Activating…'}
        variant="brand"
        isLoading={updateMutation.isPending}
        onConfirm={() => {
          void handleToggle();
        }}
      />
    </div>
  );
}
