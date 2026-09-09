import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DataTable, type DataTableColumn } from '@/components/features/shared/DataTable';
import { RowActions } from '@/components/features/shared/RowActions';
import { formatBoolean, formatDateTime, formatMoney, formatNumber, humanize } from '@/lib/utils/format';
import type { PaginationMeta } from '@/types/api';
import type { SubscriptionPlanItem } from '@/types/subscription';

interface SubscriptionPlansTableProps {
  items: SubscriptionPlanItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  leadingToolbar: ReactNode;
  trailingToolbar: ReactNode;
  emptyAction?: ReactNode;
  onView: (row: SubscriptionPlanItem) => void;
  onEdit: (row: SubscriptionPlanItem) => void;
  onArchive: (row: SubscriptionPlanItem) => void;
  onToggleActive: (row: SubscriptionPlanItem) => void;
}

export function SubscriptionPlansTable({
  items,
  loading,
  error,
  onRetry,
  pagination,
  onPageChange,
  onPageSizeChange,
  leadingToolbar,
  trailingToolbar,
  emptyAction,
  onView,
  onEdit,
  onArchive,
  onToggleActive,
}: SubscriptionPlansTableProps) {
  const columns: DataTableColumn<SubscriptionPlanItem>[] = [
    { id: 'id', label: 'Id', accessor: (row) => row.id, sortable: false, defaultHidden: true, hideable: true },
    { id: 'name', label: 'Name', accessor: (row) => row.name, sortable: true, alwaysVisible: true },
    {
      id: 'role',
      label: 'Role',
      accessor: (row) => row.role,
      sortable: true,
      render: (row) => humanize(row.role),
    },
    {
      id: 'price_amount',
      label: 'Price Amount',
      accessor: (row) => row.price_amount,
      sortable: true,
      render: (row) => formatMoney(row.price_amount, row.currency),
    },
    { id: 'currency', label: 'Currency', accessor: (row) => row.currency, sortable: true, defaultHidden: true },
    {
      id: 'billing_frequency',
      label: 'Billing Frequency',
      accessor: (row) => row.billing_frequency,
      sortable: true,
      render: (row) => humanize(row.billing_frequency),
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>{humanize(row.status)}</Badge>
      ),
    },
    {
      id: 'is_active',
      label: 'Is Active',
      accessor: (row) => row.is_active,
      sortable: true,
      render: (row) => {
        if (row.status === 'archived') {
          return formatBoolean(row.is_active);
        }
        return (
          <Switch
            checked={row.is_active}
            aria-label={`Set ${row.name} ${row.is_active ? 'inactive' : 'active'}`}
            onCheckedChange={() => onToggleActive(row)}
          />
        );
      },
    },
    {
      id: 'stripe_product_id',
      label: 'Stripe Product Id',
      accessor: (row) => row.stripe_product_id,
      sortable: true,
      defaultHidden: true,
    },
    {
      id: 'stripe_price_id',
      label: 'Stripe Price Id',
      accessor: (row) => row.stripe_price_id,
      sortable: true,
      defaultHidden: true,
    },
    {
      id: 'teams_limit_type',
      label: 'Teams Limit Type',
      accessor: (row) => row.teams_limit_type,
      sortable: true,
      defaultHidden: true,
      render: (row) => humanize(row.teams_limit_type),
    },
    {
      id: 'teams_count',
      label: 'Teams Count',
      accessor: (row) => row.teams_count,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatNumber(row.teams_count),
    },
    {
      id: 'coaches_limit_type',
      label: 'Coaches Limit Type',
      accessor: (row) => row.coaches_limit_type,
      sortable: true,
      defaultHidden: true,
      render: (row) => humanize(row.coaches_limit_type),
    },
    {
      id: 'coaches_count',
      label: 'Coaches Count',
      accessor: (row) => row.coaches_count,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatNumber(row.coaches_count),
    },
    {
      id: 'players_limit_type',
      label: 'Players Limit Type',
      accessor: (row) => row.players_limit_type,
      sortable: true,
      defaultHidden: true,
      render: (row) => humanize(row.players_limit_type),
    },
    {
      id: 'players_count',
      label: 'Players Count',
      accessor: (row) => row.players_count,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatNumber(row.players_count),
    },
    {
      id: 'historical_records_duration',
      label: 'Historical Records Duration',
      accessor: (row) => row.historical_records_duration,
      sortable: true,
      defaultHidden: true,
      render: (row) => humanize(row.historical_records_duration),
    },
    {
      id: 'include_offline_sync',
      label: 'Include Offline Sync',
      accessor: (row) => row.include_offline_sync,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatBoolean(row.include_offline_sync),
    },
    {
      id: 'archived_at',
      label: 'Archived At',
      accessor: (row) => row.archived_at,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatDateTime(row.archived_at),
    },
    {
      id: 'replacement_plan_id',
      label: 'Replacement Plan Id',
      accessor: (row) => row.replacement_plan_id,
      sortable: true,
      defaultHidden: true,
    },
    {
      id: 'stripe_status',
      label: 'Stripe Status',
      accessor: (row) => row.stripe_status,
      sortable: true,
      defaultHidden: true,
      render: (row) => humanize(row.stripe_status),
    },
    {
      id: 'description',
      label: 'Description',
      accessor: (row) => row.description,
      sortable: true,
      defaultHidden: true,
    },
    {
      id: 'features',
      label: 'Features',
      accessor: (row) => row.features?.join(', '),
      sortable: true,
      defaultHidden: true,
      render: (row) => row.features?.join(', ') || '—',
    },
    {
      id: 'created_at',
      label: 'Created At',
      accessor: (row) => row.created_at,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatDateTime(row.created_at),
    },
    {
      id: 'updated_at',
      label: 'Updated At',
      accessor: (row) => row.updated_at,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatDateTime(row.updated_at),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No subscription plans yet"
      emptyDescription="Create a plan for the selected role."
      emptyAction={emptyAction}
      leadingToolbar={leadingToolbar}
      trailingToolbar={trailingToolbar}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      renderActions={(row) => {
        const archived = row.status === 'archived';
        return (
          <div className="inline-flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              aria-label={`View ${row.name}`}
              title="View"
              onClick={() => onView(row)}
            >
              <Eye className="h-4 w-4" aria-hidden />
            </Button>
            <RowActions
              items={[
                { label: 'View', onSelect: () => onView(row) },
                ...(archived
                  ? []
                  : [
                      { label: 'Edit', onSelect: () => onEdit(row) },
                      { label: 'Archive', onSelect: () => onArchive(row), destructive: true },
                    ]),
              ]}
            />
          </div>
        );
      }}
    />
  );
}
