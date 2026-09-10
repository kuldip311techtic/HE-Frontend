import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnVisibilityMenu, type ColumnOption } from '@/components/features/admin/ColumnVisibilityMenu';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { ResourcePagination } from '@/components/features/admin/ResourcePagination';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { SortableHeader } from '@/components/features/admin/SortableHeader';
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
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getApiErrorMessage } from '@/lib/api';
import { displayText, formatDateTime, formatMoneyAmount } from '@/lib/format';
import { nextSortState, sortCollection, type SortState } from '@/lib/sort';
import { titleCase } from '@/lib/utils';
import type {
  LimitType,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from '@/types/api';

const COLUMN_OPTIONS: ColumnOption[] = [
  { key: 'name', label: 'Name', alwaysVisible: true },
  { key: 'price_amount', label: 'Price' },
  { key: 'billing_frequency', label: 'Duration' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Audience' },
  { key: 'currency', label: 'Currency' },
  { key: 'teams_count', label: 'Teams' },
  { key: 'players_count', label: 'Players' },
  { key: 'description', label: 'Description' },
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
  const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE_COLUMNS);
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
        const response = await update(editing.id, {
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
        }, editing.role);
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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <ColumnVisibilityMenu
            columns={COLUMN_OPTIONS}
            visibleKeys={visibleKeys}
            onToggle={(key) => {
              const column = COLUMN_OPTIONS.find((item) => item.key === key);
              if (column?.alwaysVisible) return;
              setVisibleKeys((current) =>
                current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
              );
            }}
          />
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
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading Subscriptions…" /> : null}
      {!isLoading && error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoading && !error && items.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" aria-hidden="true" />}
          title="No Subscription Plans Yet"
          description="Use Add Plan in the toolbar to create the first plan."
        />
      ) : null}
      {!isLoading && !error && items.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleKeys.includes('name') ? (
                  <SortableHeader label="Name" columnKey="name" sort={sort} onSort={(key) => setSort(nextSortState(sort, key))} />
                ) : null}
                {visibleKeys.includes('price_amount') ? (
                  <SortableHeader
                    label="Price"
                    columnKey="price_amount"
                    sort={sort}
                    className="text-right"
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                {visibleKeys.includes('billing_frequency') ? (
                  <SortableHeader
                    label="Duration"
                    columnKey="billing_frequency"
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                {visibleKeys.includes('status') ? (
                  <SortableHeader label="Status" columnKey="status" sort={sort} onSort={(key) => setSort(nextSortState(sort, key))} />
                ) : null}
                {visibleKeys.includes('role') ? (
                  <SortableHeader label="Audience" columnKey="role" sort={sort} onSort={(key) => setSort(nextSortState(sort, key))} />
                ) : null}
                {visibleKeys.includes('currency') ? (
                  <SortableHeader
                    label="Currency"
                    columnKey="currency"
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                {visibleKeys.includes('teams_count') ? (
                  <SortableHeader
                    label="Teams"
                    columnKey="teams_count"
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                {visibleKeys.includes('players_count') ? (
                  <SortableHeader
                    label="Players"
                    columnKey="players_count"
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                {visibleKeys.includes('description') ? (
                  <SortableHeader
                    label="Description"
                    columnKey="description"
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ) : null}
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((row) => (
                <TableRow key={row.id}>
                  {visibleKeys.includes('name') ? <TableCell className="font-medium">{displayText(row.name)}</TableCell> : null}
                  {visibleKeys.includes('price_amount') ? (
                    <TableCell className="text-right">
                      {formatMoneyAmount(
                        row.price_amount,
                        visibleKeys.includes('currency') ? undefined : row.currency,
                      )}
                    </TableCell>
                  ) : null}
                  {visibleKeys.includes('billing_frequency') ? (
                    <TableCell>{titleCase(row.billing_frequency)}</TableCell>
                  ) : null}
                  {visibleKeys.includes('status') ? (
                    <TableCell>
                      <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
                        {titleCase(row.status)}
                      </Badge>
                    </TableCell>
                  ) : null}
                  {visibleKeys.includes('role') ? (
                    <TableCell>{row.role === 'org_admin' ? 'Organization Admin' : 'Coach'}</TableCell>
                  ) : null}
                  {visibleKeys.includes('currency') ? <TableCell>{displayText(row.currency)}</TableCell> : null}
                  {visibleKeys.includes('teams_count') ? (
                    <TableCell>{row.teams_limit_type === 'unlimited' ? 'Unlimited' : row.teams_count ?? '—'}</TableCell>
                  ) : null}
                  {visibleKeys.includes('players_count') ? (
                    <TableCell>{row.players_limit_type === 'unlimited' ? 'Unlimited' : row.players_count ?? '—'}</TableCell>
                  ) : null}
                  {visibleKeys.includes('description') ? (
                    <TableCell className="max-w-[240px] truncate">{displayText(row.description)}</TableCell>
                  ) : null}
                  <TableCell className="text-right">
                    <RowActionsMenu
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ResourcePagination
            pagination={pagination}
            onPageChange={(nextPage) => setQuery({ page: nextPage, role: audience })}
            onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize, role: audience })}
          />
        </>
      ) : null}

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
                <dt className="text-muted-foreground">Description</dt>
                <dd>{displayText(viewing.description)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
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
