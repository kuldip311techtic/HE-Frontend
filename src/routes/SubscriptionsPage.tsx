import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/features/admin/DataTable';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import {
  SubscriptionPlanFormDialog,
  type SubscriptionPlanFormValues,
} from '@/components/features/admin/SubscriptionPlanFormDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useListQueryState } from '@/hooks/useListQueryState';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getApiErrorMessage } from '@/lib/api';
import { displayText, formatDateTime, formatMoneyAmount } from '@/lib/format';
import { sortCollection, type SortState } from '@/lib/sort';
import { titleCase } from '@/lib/utils';
import type {
  LimitType,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from '@/types/api';

function formatPlanLimit(type: LimitType | null | undefined, count: number | null | undefined): string {
  if (type === 'unlimited') return 'Unlimited';
  if (count === null || count === undefined) return '—';
  return String(count);
}

function formatPlanFeatures(features: string[] | null | undefined): string {
  if (!features?.length) return '—';
  return features.join(', ');
}

function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}

const COLUMNS: DataTableColumn<SubscriptionPlanItem>[] = [
  { key: 'name', label: 'Name', alwaysVisible: true, className: 'font-medium', render: (row) => displayText(row.name) },
  {
    key: 'price_amount',
    label: 'Price',
    className: 'text-right',
    headerClassName: 'text-right',
    render: (row) => formatMoneyAmount(row.price_amount, row.currency),
  },
  {
    key: 'billing_frequency',
    label: 'Duration',
    render: (row) => titleCase(row.billing_frequency),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>{titleCase(row.status)}</Badge>
    ),
  },
  {
    key: 'role',
    label: 'Audience',
    render: (row) => (row.role === 'org_admin' ? 'Organization Admin' : 'Coach'),
  },
  {
    key: 'teams_count',
    label: 'Teams',
    render: (row) => formatPlanLimit(row.teams_limit_type, row.teams_count),
  },
  {
    key: 'players_count',
    label: 'Players',
    render: (row) => formatPlanLimit(row.players_limit_type, row.players_count),
  },
  {
    key: 'coaches_count',
    label: 'Coaches',
    render: (row) => formatPlanLimit(row.coaches_limit_type, row.coaches_count),
  },
  {
    key: 'historical_records_duration',
    label: 'Historical Records',
    render: (row) => titleCase(row.historical_records_duration),
  },
  {
    key: 'include_offline_sync',
    label: 'Offline Sync',
    render: (row) => formatYesNo(row.include_offline_sync),
  },
  {
    key: 'is_active',
    label: 'Is Active',
    render: (row) => formatYesNo(row.is_active),
  },
  {
    key: 'features',
    label: 'Features',
    className: 'max-w-[240px] truncate',
    render: (row) => formatPlanFeatures(row.features),
  },
  {
    key: 'description',
    label: 'Description',
    className: 'max-w-[240px] truncate',
    render: (row) => displayText(row.description),
  },
  { key: 'created_at', label: 'Created At', render: (row) => formatDateTime(row.created_at) },
  { key: 'updated_at', label: 'Updated At', render: (row) => formatDateTime(row.updated_at) },
];

const DEFAULT_VISIBLE_COLUMNS = ['name', 'price_amount', 'billing_frequency', 'status'];

function planValue(row: SubscriptionPlanItem, key: string): unknown {
  return row[key as keyof SubscriptionPlanItem];
}

function parseCount(type: LimitType, raw: string): number | null {
  if (type === 'unlimited') return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function SubscriptionsPage() {
  const { page, pageSize, role, status, setQuery } = useListQueryState();
  const audience: SubscriptionPlanRole = role === 'coach' ? 'coach' : 'org_admin';
  const { items, pagination, isLoading, error, reload, create, update, remove } = useSubscriptionPlans(
    audience,
    page,
    pageSize,
    status,
  );

  const [sort, setSort] = useState<SortState | null>(null);
  const { visibleKeys, toggleColumn } = useColumnVisibility(COLUMNS, DEFAULT_VISIBLE_COLUMNS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlanItem | null>(null);
  const [viewing, setViewing] = useState<SubscriptionPlanItem | null>(null);
  const [removing, setRemoving] = useState<SubscriptionPlanItem | null>(null);
  const [replacementPlanId, setReplacementPlanId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (role === 'org_admin' || role === 'coach') return;
    setQuery({ role: audience });
  }, [role, audience, setQuery]);

  const sortedItems = useMemo(() => sortCollection(items, sort, planValue), [items, sort]);
  const replacementOptions = items
    .filter((plan) => plan.id !== removing?.id && plan.status === 'active')
    .map((plan) => ({ value: plan.id, label: plan.name }));

  const handleSave = async (values: SubscriptionPlanFormValues) => {
    setIsSaving(true);
    setFormError(null);
    const features = values.features
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const body: SubscriptionPlanCreateRequest = {
      role: values.role,
      name: values.name,
      billing_frequency: values.billing_frequency,
      currency: values.currency.trim().toUpperCase(),
      price_amount: Number(values.price_amount),
      teams_limit_type: values.teams_limit_type,
      teams_count: parseCount(values.teams_limit_type, values.teams_count),
      coaches_limit_type: values.coaches_limit_type,
      coaches_count: parseCount(values.coaches_limit_type, values.coaches_count),
      players_limit_type: values.players_limit_type,
      players_count: parseCount(values.players_limit_type, values.players_count),
      historical_records_duration: values.historical_records_duration,
      is_active: values.is_active === 'true',
      include_offline_sync: values.include_offline_sync === 'true',
      description: values.description.trim() || null,
      features,
    };
    try {
      if (editing) {
        const response = await update(
          editing.id,
          {
            name: body.name,
            billing_frequency: body.billing_frequency,
            currency: body.currency,
            price_amount: body.price_amount,
            teams_limit_type: body.teams_limit_type,
            teams_count: body.teams_count,
            coaches_limit_type: body.coaches_limit_type,
            coaches_count: body.coaches_count,
            players_limit_type: body.players_limit_type,
            players_count: body.players_count,
            historical_records_duration: body.historical_records_duration,
            is_active: body.is_active,
            include_offline_sync: body.include_offline_sync,
            description: body.description,
            features: body.features,
          },
          editing.role,
        );
        toast.success(response.message || 'Subscription Plan Updated Successfully.');
      } else {
        const response = await create(body);
        toast.success(response.message || 'Subscription Plan Created Successfully.');
        if (body.role !== audience) {
          setQuery({ role: body.role, page: 1 });
        }
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to save plan. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!removing) return;
    setIsDeleting(true);
    try {
      const response = await remove(removing.id, removing.role, replacementPlanId || undefined);
      toast.success(response.message || 'Subscription Plan Removed Successfully.');
      setRemoving(null);
      setReplacementPlanId('');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove plan. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="Manage subscription plans for organization admins and coaches." />

      <DataTable
        columns={COLUMNS}
        rows={sortedItems}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        visibleKeys={visibleKeys}
        onToggleColumn={toggleColumn}
        filters={
          <>
            <NativeSelect
              aria-label="Audience"
              className="lg:w-56"
              value={audience}
              onChange={(event) => setQuery({ role: event.target.value, page: 1 })}
              options={[
                { value: 'org_admin', label: 'Organization Admin' },
                { value: 'coach', label: 'Coach' },
              ]}
            />
            <NativeSelect
              aria-label="Status"
              className="lg:w-44"
              value={status}
              onChange={(event) => setQuery({ status: event.target.value, page: 1 })}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </>
        }
        primaryAction={
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormError(null);
              setFormOpen(true);
            }}
          >
            Add Plan
          </Button>
        }
        pagination={pagination}
        onPageChange={(nextPage) => setQuery({ page: nextPage, role: audience })}
        onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize, role: audience })}
        isLoading={isLoading}
        loadingLabel="Loading Subscriptions…"
        error={error}
        onRetry={() => void reload()}
        emptyIcon={<CreditCard className="h-6 w-6" aria-hidden="true" />}
        emptyTitle="No Subscription Plans Yet"
        emptyDescription="Use Add Plan in the toolbar to create the first plan."
        renderRowActions={(row) => (
          <RowActionsMenu
            label={`${displayText(row.name)} Actions`}
            actions={[
              { label: 'View', onSelect: () => setViewing(row) },
              {
                label: 'Edit',
                onSelect: () => {
                  setEditing(row);
                  setFormError(null);
                  setFormOpen(true);
                },
              },
              {
                label: 'Remove',
                destructive: true,
                onSelect: () => {
                  setReplacementPlanId('');
                  setRemoving(row);
                },
              },
            ]}
          />
        )}
      />

      <SubscriptionPlanFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        plan={editing}
        defaultRole={audience}
        isSubmitting={isSaving}
        error={formError}
        onSubmit={handleSave}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription Plan</DialogTitle>
            <DialogDescription>Read-only details for this subscription plan.</DialogDescription>
          </DialogHeader>
          {viewing ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{displayText(viewing.name)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Audience</dt>
                <dd>{viewing.role === 'org_admin' ? 'Organization Admin' : 'Coach'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd>{formatMoneyAmount(viewing.price_amount, viewing.currency)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd>{titleCase(viewing.billing_frequency)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>{titleCase(viewing.status)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Is Active</dt>
                <dd>{formatYesNo(viewing.is_active)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Teams</dt>
                <dd>{formatPlanLimit(viewing.teams_limit_type, viewing.teams_count)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Players</dt>
                <dd>{formatPlanLimit(viewing.players_limit_type, viewing.players_count)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Coaches</dt>
                <dd>{formatPlanLimit(viewing.coaches_limit_type, viewing.coaches_count)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Historical Records</dt>
                <dd>{titleCase(viewing.historical_records_duration)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Offline Sync</dt>
                <dd>{formatYesNo(viewing.include_offline_sync)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Features</dt>
                <dd>{formatPlanFeatures(viewing.features)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd>{displayText(viewing.description)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Updated At</dt>
                <dd>{formatDateTime(viewing.updated_at)}</dd>
              </div>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove Subscription Plan?"
        description={
          removing?.status === 'active'
            ? 'This plan is active. Archiving may affect existing subscribers. This action cannot be undone.'
            : 'This will remove the subscription plan. This action cannot be undone.'
        }
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleRemove()}
      >
        {replacementOptions.length > 0 ? (
          <label className="grid gap-2 text-sm">
            <span>Replacement Plan</span>
            <NativeSelect
              aria-label="Replacement Plan"
              value={replacementPlanId}
              onChange={(event) => setReplacementPlanId(event.target.value)}
              options={[{ value: '', label: 'No Replacement' }, ...replacementOptions]}
            />
          </label>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
