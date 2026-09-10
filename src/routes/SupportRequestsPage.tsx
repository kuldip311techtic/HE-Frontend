import { useEffect, useMemo, useState } from 'react';
import { LifeBuoy } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { DataTable, type DataTableColumn } from '@/components/features/admin/DataTable';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { SupportRequestDetailDialog } from '@/components/features/admin/SupportRequestDetailDialog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useListQueryState } from '@/hooks/useListQueryState';
import { SUPPORT_ACTIONS_UNAVAILABLE, useSupportRequests } from '@/hooks/useSupportRequests';
import { displayText, formatDateTime, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { sortCollection, type SortState } from '@/lib/sort';
import type { SupportRequestItem } from '@/types/api';

const COLUMNS: DataTableColumn<SupportRequestItem>[] = [
  { key: 'name', label: 'Name', alwaysVisible: true, className: 'font-medium', render: (row) => displayText(row.name) },
  { key: 'email', label: 'Email', render: (row) => displayText(row.email) },
  { key: 'subject', label: 'Subject', render: (row) => displayText(row.subject) },
  { key: 'created_at', label: 'Created At', render: (row) => formatDateTime(row.created_at) },
  {
    key: 'message',
    label: 'Message',
    render: (row) => (
      <span className="block max-w-xs truncate" title={row.message}>
        {displayText(row.message)}
      </span>
    ),
  },
];

const DEFAULT_VISIBLE_KEYS = ['name', 'email', 'subject', 'created_at'];

function requestValue(row: SupportRequestItem, key: string): unknown {
  return row[key as keyof SupportRequestItem];
}

export function SupportRequestsPage() {
  const { page, pageSize, search, setQuery } = useListQueryState();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const { items, pagination, isLoading, error, reload } = useSupportRequests(page, pageSize, debouncedSearch);

  const [sort, setSort] = useState<SortState | null>(null);
  const { visibleKeys, toggleColumn } = useColumnVisibility(COLUMNS, DEFAULT_VISIBLE_KEYS);
  const [viewing, setViewing] = useState<SupportRequestItem | null>(null);

  useEffect(() => {
    if (debouncedSearch === search) return;
    setQuery({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, search, setQuery]);

  const sortedItems = useMemo(() => sortCollection(items, sort, requestValue), [items, sort]);

  return (
    <div className="space-y-6">
      <PageHeader title="Support Requests" description="Review incoming support inquiries." />

      <DataTable
        columns={COLUMNS}
        rows={sortedItems}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        visibleKeys={visibleKeys}
        onToggleColumn={toggleColumn}
        filters={
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Support Requests"
            aria-label="Search Support Requests"
            className="lg:max-w-sm"
          />
        }
        pagination={pagination}
        onPageChange={(nextPage) => setQuery({ page: nextPage })}
        onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize })}
        isLoading={isLoading}
        loadingLabel="Loading Support Requests…"
        error={error}
        onRetry={() => void reload()}
        emptyIcon={<LifeBuoy className="h-6 w-6" aria-hidden="true" />}
        emptyTitle="No Support Requests Yet"
        emptyDescription="New inquiries will appear here when they are submitted."
        renderRowActions={(row) => (
          <RowActionsMenu
            label={`${displayText(row.name)} Actions`}
            actions={[
              { label: 'View', onSelect: () => setViewing(row) },
              {
                label: 'Respond',
                disabled: true,
                title: SUPPORT_ACTIONS_UNAVAILABLE,
                onSelect: () => setViewing(row),
              },
              {
                label: 'Close',
                destructive: true,
                disabled: true,
                title: SUPPORT_ACTIONS_UNAVAILABLE,
                onSelect: () => undefined,
              },
            ]}
          />
        )}
      />

      <SupportRequestDetailDialog
        request={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      />
    </div>
  );
}
