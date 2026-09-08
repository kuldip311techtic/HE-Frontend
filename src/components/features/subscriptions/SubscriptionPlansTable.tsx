import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { ColumnVisibilityMenu } from '@/components/shared/ColumnVisibilityMenu';
import { RowActionsMenu } from '@/components/shared/RowActionsMenu';
import {
  compareSubscriptionPlans,
  getDefaultColumnVisibility,
  getPlanCellDisplayValue,
  PLAN_TABLE_COLUMNS,
  type PlanColumnId,
  type PlanSortKey,
} from '@/components/features/subscriptions/subscription-plan-table-utils';
import { useTableSort } from '@/hooks/useTableSort';
import { cn } from '@/lib/utils/cn';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  isLoading?: boolean;
  toggleBusyPlanId?: string | null;
  onView: (plan: SubscriptionPlanItem) => void;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
  onToggleActive: (plan: SubscriptionPlanItem) => void;
}

const ADMIN_BADGE_ACTIVE =
  'border-figma-border bg-[var(--token-color-107)] text-[var(--token-color-114)]';
const ADMIN_BADGE_MUTED =
  'border-figma-border bg-[var(--token-color-103)] text-figma-accent';

function PlanStatusBadge({ plan }: { plan: SubscriptionPlanItem }) {
  if (plan.status === 'archived') {
    return (
      <Badge variant="outline" className={ADMIN_BADGE_MUTED}>
        Archived
      </Badge>
    );
  }
  if (plan.is_active) {
    return (
      <Badge variant="outline" className={ADMIN_BADGE_ACTIVE}>
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={ADMIN_BADGE_MUTED}>
      Inactive
    </Badge>
  );
}

function ActiveToggle({
  plan,
  onToggle,
  isBusy = false,
}: {
  plan: SubscriptionPlanItem;
  onToggle: (plan: SubscriptionPlanItem) => void;
  isBusy?: boolean;
}) {
  if (plan.status === 'archived') {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={plan.is_active}
      aria-busy={isBusy}
      aria-label={(plan.is_active ? 'Deactivate ' : 'Activate ') + plan.name}
      disabled={isBusy}
      onClick={() => onToggle(plan)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 rounded-full border border-figma-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand disabled:cursor-not-allowed disabled:opacity-50',
        plan.is_active ? 'bg-figma-brand' : 'bg-[var(--figma-surface-deep)]',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-background shadow transition-transform',
          plan.is_active ? 'translate-x-5' : 'translate-x-0.5',
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export function SubscriptionPlansTable({
  plans,
  isLoading = false,
  toggleBusyPlanId = null,
  onView,
  onEdit,
  onArchive,
  onToggleActive,
}: SubscriptionPlansTableProps) {
  const [columnVisibility, setColumnVisibility] = useState(getDefaultColumnVisibility);

  const visibleColumns = useMemo(
    () => PLAN_TABLE_COLUMNS.filter((column) => columnVisibility[column.id]),
    [columnVisibility],
  );

  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    SubscriptionPlanItem,
    PlanSortKey
  >(plans, compareSubscriptionPlans);

  const columnVisibilityOptions = PLAN_TABLE_COLUMNS.map((column) => ({
    id: column.id,
    label: column.label,
    visible: columnVisibility[column.id],
    alwaysVisible: column.alwaysVisible,
  }));

  const handleColumnToggle = (columnId: string, visible: boolean) => {
    const column = PLAN_TABLE_COLUMNS.find((item) => item.id === columnId);
    if (!column || column.alwaysVisible) return;
    setColumnVisibility((prev) => ({ ...prev, [columnId as PlanColumnId]: visible }));
  };

  if (isLoading) {
    return (
      <div className="admin-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={'plan-skeleton-' + index}
              className="h-12 w-full bg-[var(--figma-surface)]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ColumnVisibilityMenu columns={columnVisibilityOptions} onToggle={handleColumnToggle} />
      </div>

      <div className="admin-table overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) =>
                column.sortable && column.id !== 'id' ? (
                  <SortableTableHead
                    key={column.id}
                    label={column.label}
                    sortKey={column.id as PlanSortKey}
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                ) : (
                  <TableHead key={column.id}>{column.label}</TableHead>
                ),
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((plan) => (
              <TableRow key={plan.id}>
                {visibleColumns.map((column) => (
                  <TableCell
                    key={plan.id + '-' + column.id}
                    className={cn(column.id === 'name' && 'font-medium max-w-[16rem] truncate')}
                    title={
                      column.id === 'description' || column.id === 'features'
                        ? getPlanCellDisplayValue(plan, column.id)
                        : undefined
                    }
                  >
                    {column.id === 'status' ? (
                      <PlanStatusBadge plan={plan} />
                    ) : column.id === 'is_active' ? (
                      <ActiveToggle
                        plan={plan}
                        onToggle={onToggleActive}
                        isBusy={toggleBusyPlanId === plan.id}
                      />
                    ) : (
                      getPlanCellDisplayValue(plan, column.id)
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-figma-10 border border-figma-border text-muted-foreground transition-colors hover:bg-[var(--figma-surface)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
                      aria-label={'View ' + plan.name}
                      title={'View ' + plan.name}
                      onClick={() => onView(plan)}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <RowActionsMenu
                      appearance="admin"
                      ariaLabel={'Actions for ' + plan.name}
                      actions={[
                        ...(plan.status !== 'archived'
                          ? [
                              {
                                id: 'edit',
                                label: 'Edit',
                                onSelect: () => onEdit(plan),
                              },
                              {
                                id: 'archive',
                                label: 'Archive',
                                onSelect: () => onArchive(plan),
                                destructive: true,
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="font-outfit text-body-sm text-muted-foreground" role="note">
        Column sorting applies to the current page only. Server pagination does not support global
        sort.
      </p>
    </div>
  );
}
