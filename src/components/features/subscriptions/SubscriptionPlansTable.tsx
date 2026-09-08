import { type ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { DataTableColumnVisibility } from '@/components/shared/DataTableColumnVisibility';
import { DataTablePageSortNote } from '@/components/shared/DataTablePageSortNote';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableSort } from '@/hooks/useTableSort';
import { useColumnVisibility, type DataTableColumnDef } from '@/hooks/useColumnVisibility';
import { cn } from '@/lib/utils/cn';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  isLoading?: boolean;
  onView: (plan: SubscriptionPlanItem) => void;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
  onToggleActive: (plan: SubscriptionPlanItem) => void;
}

type PlanColumnId =
  | 'id'
  | 'role'
  | 'name'
  | 'billing_frequency'
  | 'currency'
  | 'price_amount'
  | 'stripe_product_id'
  | 'stripe_price_id'
  | 'teams_limit_type'
  | 'teams_count'
  | 'coaches_limit_type'
  | 'coaches_count'
  | 'players_limit_type'
  | 'players_count'
  | 'historical_records_duration'
  | 'is_active'
  | 'include_offline_sync'
  | 'status'
  | 'archived_at'
  | 'replacement_plan_id'
  | 'stripe_status'
  | 'description'
  | 'features'
  | 'created_at'
  | 'updated_at';

type PlanSortKey = PlanColumnId;

type ColumnDef = DataTableColumnDef<PlanColumnId>;

const COLUMN_DEFS: ColumnDef[] = [
  { id: 'id', label: 'Id', defaultVisible: false, sortable: false },
  { id: 'role', label: 'Role', defaultVisible: false },
  { id: 'name', label: 'Name', defaultVisible: true, alwaysVisible: true },
  { id: 'billing_frequency', label: 'Billing Frequency', defaultVisible: true },
  { id: 'currency', label: 'Currency', defaultVisible: false },
  { id: 'price_amount', label: 'Price Amount', defaultVisible: true },
  { id: 'stripe_product_id', label: 'Stripe Product Id', defaultVisible: false },
  { id: 'stripe_price_id', label: 'Stripe Price Id', defaultVisible: false },
  { id: 'teams_limit_type', label: 'Teams Limit Type', defaultVisible: false },
  { id: 'teams_count', label: 'Teams Count', defaultVisible: false },
  { id: 'coaches_limit_type', label: 'Coaches Limit Type', defaultVisible: false },
  { id: 'coaches_count', label: 'Coaches Count', defaultVisible: false },
  { id: 'players_limit_type', label: 'Players Limit Type', defaultVisible: false },
  { id: 'players_count', label: 'Players Count', defaultVisible: false },
  {
    id: 'historical_records_duration',
    label: 'Historical Records Duration',
    defaultVisible: false,
  },
  { id: 'is_active', label: 'Is Active', defaultVisible: true },
  { id: 'include_offline_sync', label: 'Include Offline Sync', defaultVisible: false },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'archived_at', label: 'Archived At', defaultVisible: false },
  { id: 'replacement_plan_id', label: 'Replacement Plan Id', defaultVisible: false },
  { id: 'stripe_status', label: 'Stripe Status', defaultVisible: false },
  { id: 'description', label: 'Description', defaultVisible: false },
  { id: 'features', label: 'Features', defaultVisible: false },
  { id: 'created_at', label: 'Created At', defaultVisible: false },
  { id: 'updated_at', label: 'Updated At', defaultVisible: false },
];

function formatPrice(amount: string, currency: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return amount;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numeric);
  } catch {
    return amount;
  }
}

function formatDuration(frequency: string): string {
  if (frequency === 'monthly') return 'Monthly';
  if (frequency === 'yearly') return 'Yearly';
  return frequency;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatFeatures(features: string[]): string {
  if (features.length === 0) return '—';
  return features.join(', ');
}

function compareNullableString(a: string | null, b: string | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function compareNullableNumber(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

function comparePlans(
  a: SubscriptionPlanItem,
  b: SubscriptionPlanItem,
  sortKey: PlanSortKey,
): number {
  switch (sortKey) {
    case 'role':
      return a.role.localeCompare(b.role);
    case 'name':
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    case 'billing_frequency':
      return a.billing_frequency.localeCompare(b.billing_frequency);
    case 'currency':
      return a.currency.localeCompare(b.currency);
    case 'price_amount': {
      const priceA = Number.parseFloat(a.price_amount);
      const priceB = Number.parseFloat(b.price_amount);
      if (Number.isNaN(priceA) || Number.isNaN(priceB)) {
        return a.price_amount.localeCompare(b.price_amount);
      }
      return priceA - priceB;
    }
    case 'stripe_product_id':
      return a.stripe_product_id.localeCompare(b.stripe_product_id);
    case 'stripe_price_id':
      return a.stripe_price_id.localeCompare(b.stripe_price_id);
    case 'teams_limit_type':
      return a.teams_limit_type.localeCompare(b.teams_limit_type);
    case 'teams_count':
      return compareNullableNumber(a.teams_count, b.teams_count);
    case 'coaches_limit_type':
      return compareNullableString(a.coaches_limit_type, b.coaches_limit_type);
    case 'coaches_count':
      return compareNullableNumber(a.coaches_count, b.coaches_count);
    case 'players_limit_type':
      return a.players_limit_type.localeCompare(b.players_limit_type);
    case 'players_count':
      return compareNullableNumber(a.players_count, b.players_count);
    case 'historical_records_duration':
      return a.historical_records_duration.localeCompare(b.historical_records_duration);
    case 'is_active':
      return Number(a.is_active) - Number(b.is_active);
    case 'include_offline_sync':
      return Number(a.include_offline_sync) - Number(b.include_offline_sync);
    case 'status':
      return a.status.localeCompare(b.status);
    case 'archived_at':
      return compareNullableString(a.archived_at, b.archived_at);
    case 'replacement_plan_id':
      return compareNullableString(a.replacement_plan_id, b.replacement_plan_id);
    case 'stripe_status':
      return compareNullableString(a.stripe_status, b.stripe_status);
    case 'description':
      return compareNullableString(a.description, b.description);
    case 'features':
      return formatFeatures(a.features).localeCompare(formatFeatures(b.features));
    case 'created_at':
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    case 'updated_at':
      return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    default:
      return 0;
  }
}

function PlanStatusBadge({ plan }: { plan: SubscriptionPlanItem }) {
  if (plan.status === 'archived') {
    return <Badge variant="outline">Archived</Badge>;
  }
  if (plan.is_active) {
    return <Badge variant="default">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
}

function renderCell(plan: SubscriptionPlanItem, columnId: PlanColumnId): ReactNode {
  switch (columnId) {
    case 'id':
      return plan.id;
    case 'role':
      return plan.role === 'org_admin' ? 'Organization admin' : 'Coach';
    case 'name':
      return plan.name;
    case 'billing_frequency':
      return formatDuration(plan.billing_frequency);
    case 'currency':
      return plan.currency;
    case 'price_amount':
      return formatPrice(plan.price_amount, plan.currency);
    case 'stripe_product_id':
      return plan.stripe_product_id;
    case 'stripe_price_id':
      return plan.stripe_price_id;
    case 'teams_limit_type':
      return plan.teams_limit_type;
    case 'teams_count':
      return plan.teams_count ?? '—';
    case 'coaches_limit_type':
      return plan.coaches_limit_type ?? '—';
    case 'coaches_count':
      return plan.coaches_count ?? '—';
    case 'players_limit_type':
      return plan.players_limit_type;
    case 'players_count':
      return plan.players_count ?? '—';
    case 'historical_records_duration':
      return plan.historical_records_duration.replace(/_/g, ' ');
    case 'is_active':
      return plan.is_active ? 'Yes' : 'No';
    case 'include_offline_sync':
      return plan.include_offline_sync ? 'Yes' : 'No';
    case 'status':
      return <PlanStatusBadge plan={plan} />;
    case 'archived_at':
      return formatDate(plan.archived_at);
    case 'replacement_plan_id':
      return plan.replacement_plan_id ?? '—';
    case 'stripe_status':
      return plan.stripe_status ?? '—';
    case 'description':
      return plan.description ?? '—';
    case 'features':
      return formatFeatures(plan.features);
    case 'created_at':
      return formatDate(plan.created_at);
    case 'updated_at':
      return formatDate(plan.updated_at);
    default:
      return '—';
  }
}

export function SubscriptionPlansTable({
  plans,
  isLoading = false,
  onView,
  onEdit,
  onArchive,
  onToggleActive,
}: SubscriptionPlansTableProps) {
  const { visibleColumns, visibleColumnDefs, toggleColumn } =
    useColumnVisibility<PlanColumnId>(COLUMN_DEFS);

  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    SubscriptionPlanItem,
    PlanSortKey
  >(plans, comparePlans);

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`plan-skeleton-${index}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DataTableColumnVisibility
        columns={COLUMN_DEFS}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        menuClassName="admin-subscriptions-columns-menu"
      />

      <div className="admin-manage-table overflow-x-auto">
        <DataTablePageSortNote className="admin-subscriptions-sort-note" />
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnDefs.map((col) =>
                col.sortable === false ? (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ) : (
                  <SortableTableHead
                    key={col.id}
                    label={col.label}
                    sortKey={col.id}
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                ),
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((plan) => {
              const isArchived = plan.status === 'archived';

              return (
                <TableRow key={plan.id}>
                  {visibleColumnDefs.map((col) => {
                    const cellContent = renderCell(plan, col.id);
                    const cellTitle = typeof cellContent === 'string' ? cellContent : undefined;

                    return (
                    <TableCell
                      key={col.id}
                      className={cn(col.id === 'name' && 'font-medium', 'max-w-xs truncate')}
                      title={cellTitle}
                    >
                      {col.id === 'is_active' && !isArchived ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={plan.is_active}
                          aria-label={
                            plan.is_active
                              ? `Deactivate ${plan.name}`
                              : `Activate ${plan.name}`
                          }
                          onClick={() => onToggleActive(plan)}
                          className={cn(
                            'admin-subscriptions-toggle relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            plan.is_active ? 'bg-primary' : 'bg-muted',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 translate-y-0 rounded-full bg-background shadow transition-transform',
                              plan.is_active ? 'translate-x-5' : 'translate-x-0.5',
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        cellContent
                      )}
                    </TableCell>
                    );
                  })}
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onView(plan)}
                        aria-label={`View ${plan.name}`}
                        title={`View ${plan.name}`}
                        className="admin-outline-btn"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">View</span>
                      </Button>
                      {!isArchived ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(plan)}
                            aria-label={`Edit ${plan.name}`}
                            className="admin-outline-btn"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onArchive(plan)}
                            aria-label={`Archive ${plan.name}`}
                            className="admin-danger-btn"
                          >
                            Remove
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
