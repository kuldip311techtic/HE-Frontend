import type { SubscriptionPlanItem } from '@/types/subscriptions';

export type PlanColumnId = keyof SubscriptionPlanItem;
export type PlanSortKey = Exclude<PlanColumnId, 'id'>;

export interface PlanColumnDef {
  id: PlanColumnId;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

export const PLAN_TABLE_COLUMNS: PlanColumnDef[] = [
  { id: 'id', label: 'Id', sortable: false, defaultVisible: false },
  { id: 'role', label: 'Role', sortable: true, defaultVisible: false },
  { id: 'name', label: 'Name', sortable: true, defaultVisible: true, alwaysVisible: true },
  { id: 'billing_frequency', label: 'Billing Frequency', sortable: true, defaultVisible: true },
  { id: 'currency', label: 'Currency', sortable: true, defaultVisible: true },
  { id: 'price_amount', label: 'Price Amount', sortable: true, defaultVisible: true },
  { id: 'stripe_product_id', label: 'Stripe Product Id', sortable: true, defaultVisible: false },
  { id: 'stripe_price_id', label: 'Stripe Price Id', sortable: true, defaultVisible: false },
  { id: 'teams_limit_type', label: 'Teams Limit Type', sortable: true, defaultVisible: false },
  { id: 'teams_count', label: 'Teams Count', sortable: true, defaultVisible: false },
  { id: 'coaches_limit_type', label: 'Coaches Limit Type', sortable: true, defaultVisible: false },
  { id: 'coaches_count', label: 'Coaches Count', sortable: true, defaultVisible: false },
  { id: 'players_limit_type', label: 'Players Limit Type', sortable: true, defaultVisible: false },
  { id: 'players_count', label: 'Players Count', sortable: true, defaultVisible: false },
  {
    id: 'historical_records_duration',
    label: 'Historical Records Duration',
    sortable: true,
    defaultVisible: false,
  },
  { id: 'is_active', label: 'Is Active', sortable: true, defaultVisible: true },
  { id: 'include_offline_sync', label: 'Include Offline Sync', sortable: true, defaultVisible: false },
  { id: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { id: 'archived_at', label: 'Archived At', sortable: true, defaultVisible: false },
  { id: 'replacement_plan_id', label: 'Replacement Plan Id', sortable: true, defaultVisible: false },
  { id: 'stripe_status', label: 'Stripe Status', sortable: true, defaultVisible: false },
  { id: 'description', label: 'Description', sortable: true, defaultVisible: false },
  { id: 'features', label: 'Features', sortable: true, defaultVisible: false },
  { id: 'created_at', label: 'Created At', sortable: true, defaultVisible: false },
  { id: 'updated_at', label: 'Updated At', sortable: true, defaultVisible: false },
];

export function getDefaultColumnVisibility(): Record<PlanColumnId, boolean> {
  return PLAN_TABLE_COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = column.defaultVisible;
      return acc;
    },
    {} as Record<PlanColumnId, boolean>,
  );
}

export function formatPlanPrice(amount: string, currency: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return amount;
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numeric);
  } catch {
    return amount;
  }
}

/** Table price column when currency is shown in its own column — no duplicated code/symbol. */
export function formatPlanPriceAmount(amount: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return amount;
  }
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatPlanDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function humanizeEnum(value: string | null | undefined): string {
  if (!value) return '—';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function compareNullable<T>(a: T | null | undefined, b: T | null | undefined, compare: (left: T, right: T) => number): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return compare(a, b);
}

function compareStringField(a: string | null | undefined, b: string | null | undefined): number {
  return compareNullable(a, b, (left, right) =>
    left.localeCompare(right, undefined, { sensitivity: 'base', numeric: true }),
  );
}

function compareNumberField(a: number | null | undefined, b: number | null | undefined): number {
  return compareNullable(a, b, (left, right) => left - right);
}

function compareBooleanField(a: boolean, b: boolean): number {
  return Number(a) - Number(b);
}

function compareDateField(a: string | null, b: string | null): number {
  return compareNullable(a, b, (left, right) => new Date(left).getTime() - new Date(right).getTime());
}

export function compareSubscriptionPlans(
  a: SubscriptionPlanItem,
  b: SubscriptionPlanItem,
  sortKey: PlanSortKey,
): number {
  switch (sortKey) {
    case 'role':
    case 'name':
    case 'billing_frequency':
    case 'currency':
    case 'price_amount':
    case 'stripe_product_id':
    case 'stripe_price_id':
    case 'teams_limit_type':
    case 'coaches_limit_type':
    case 'players_limit_type':
    case 'historical_records_duration':
    case 'status':
    case 'replacement_plan_id':
    case 'stripe_status':
    case 'description':
      return compareStringField(a[sortKey], b[sortKey]);
    case 'teams_count':
    case 'coaches_count':
    case 'players_count':
      return compareNumberField(a[sortKey], b[sortKey]);
    case 'is_active':
    case 'include_offline_sync':
      return compareBooleanField(a[sortKey], b[sortKey]);
    case 'archived_at':
    case 'created_at':
    case 'updated_at':
      return compareDateField(a[sortKey], b[sortKey]);
    case 'features':
      return compareStringField(a.features.join(', '), b.features.join(', '));
    default:
      return 0;
  }
}

export function getPlanCellDisplayValue(plan: SubscriptionPlanItem, columnId: PlanColumnId): string {
  switch (columnId) {
    case 'price_amount':
      return formatPlanPriceAmount(plan.price_amount);
    case 'billing_frequency':
    case 'role':
    case 'teams_limit_type':
    case 'coaches_limit_type':
    case 'players_limit_type':
    case 'historical_records_duration':
    case 'status':
    case 'stripe_status':
      return humanizeEnum(plan[columnId]);
    case 'teams_count':
    case 'coaches_count':
    case 'players_count':
      return plan[columnId] == null ? '—' : String(plan[columnId]);
    case 'is_active':
    case 'include_offline_sync':
      return plan[columnId] ? 'Yes' : 'No';
    case 'archived_at':
    case 'created_at':
    case 'updated_at':
      return formatPlanDate(plan[columnId]);
    case 'features':
      return plan.features.length > 0 ? plan.features.join(', ') : '—';
    case 'description':
      return plan.description?.trim() || '—';
    default:
      return String(plan[columnId] ?? '—');
  }
}
