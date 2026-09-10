import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { LifeBuoy } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnVisibilityMenu, type ColumnOption } from '@/components/features/admin/ColumnVisibilityMenu';
import { ResourcePagination } from '@/components/features/admin/ResourcePagination';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { SortableHeader } from '@/components/features/admin/SortableHeader';
import { SupportRequestDetailDialog } from '@/components/features/admin/SupportRequestDetailDialog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useListQueryState } from '@/hooks/useListQueryState';
import { SUPPORT_ACTIONS_UNAVAILABLE, useSupportRequests } from '@/hooks/useSupportRequests';
import { getApiErrorMessage } from '@/lib/api';
import { displayText, formatDateTime, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { nextSortState, sortCollection, type SortState } from '@/lib/sort';
import type { SupportRequestItem } from '@/types/api';

const COLUMN_OPTIONS: ColumnOption[] = [
  { key: 'name', label: 'Name', alwaysVisible: true },
  { key: 'email', label: 'Email' },
  { key: 'subject', label: 'Subject' },
  { key: 'created_at', label: 'Created At' },
  { key: 'message', label: 'Message' },
];

const DEFAULT_VISIBLE_KEYS = ['name', 'email', 'subject', 'created_at'];

function requestValue(row: SupportRequestItem, key: string): unknown {
  return row[key as keyof SupportRequestItem];
}

function renderRequestCell(row: SupportRequestItem, key: string) {
  if (key === 'created_at') return formatDateTime(row.created_at);
  if (key === 'message') {
    const value = displayText(row.message);
    return (
      <span className="block max-w-xs truncate" title={row.message}>
        {value}
      </span>
    );
  }
  if (key === 'name') return displayText(row.name);
  if (key === 'email') return displayText(row.email);
  if (key === 'subject') return displayText(row.subject);
  return '—';
}

export function SupportRequestsPage() {
  const { page, pageSize, search, setQuery } = useListQueryState();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const { items, pagination, isLoading, error, reload, respond, close } = useSupportRequests(
    page,
    pageSize,
    debouncedSearch,
  );

  const [sort, setSort] = useState<SortState | null>(null);
  const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE_KEYS);
  const [viewing, setViewing] = useState<SupportRequestItem | null>(null);
  const [closing, setClosing] = useState<SupportRequestItem | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedSearch === search) return;
    setQuery({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, search, setQuery]);

  const sortedItems = useMemo(() => sortCollection(items, sort, requestValue), [items, sort]);
  const visibleColumns = COLUMN_OPTIONS.filter((column) => visibleKeys.includes(column.key));

  const handleRespond = async (response: string) => {
    if (!viewing) return;
    setIsResponding(true);
    setActionError(null);
    try {
      const result = await respond({ request_id: viewing.id, response });
      toast.success(result?.message || 'Response Sent Successfully.');
      setViewing(null);
    } catch (err) {
      const message = getApiErrorMessage(err, SUPPORT_ACTIONS_UNAVAILABLE);
      setActionError(message);
      toast.error(message);
    } finally {
      setIsResponding(false);
    }
  };

  const handleClose = async () => {
    if (!closing) return;
    setIsClosing(true);
    setActionError(null);
    try {
      const result = await close(closing.id);
      toast.success(result?.message || 'Support Request Closed Successfully.');
      setClosing(null);
      setViewing(null);
    } catch (err) {
      const message = getApiErrorMessage(err, SUPPORT_ACTIONS_UNAVAILABLE);
      setActionError(message);
      toast.error(message);
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Support Requests" description="Review incoming support inquiries." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search Support Requests"
          aria-label="Search Support Requests"
          className="lg:max-w-sm"
        />
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <ColumnVisibilityMenu
            columns={COLUMN_OPTIONS}
            visibleKeys={visibleKeys}
            onToggle={(key) =>
              setVisibleKeys((current) => {
                const column = COLUMN_OPTIONS.find((item) => item.key === key);
                if (column?.alwaysVisible) return current;
                return current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
              })
            }
          />
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading Support Requests…" /> : null}
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
          icon={<LifeBuoy className="h-6 w-6" aria-hidden="true" />}
          title="No Support Requests Yet"
          description="New inquiries will appear here when they are submitted."
        />
      ) : null}
      {!isLoading && !error && items.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <SortableHeader
                    key={column.key}
                    label={column.label}
                    columnKey={column.key}
                    sort={sort}
                    onSort={(nextKey) => setSort(nextSortState(sort, nextKey))}
                  />
                ))}
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((row) => (
                <TableRow key={row.id}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key} className={column.key === 'name' ? 'font-medium' : undefined}>
                      {renderRequestCell(row, column.key)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <RowActionsMenu
                      label={`${displayText(row.name)} Actions`}
                      actions={[
                        {
                          label: 'View',
                          onSelect: () => {
                            setActionError(null);
                            setViewing(row);
                          },
                        },
                        {
                          label: 'Respond',
                          onSelect: () => {
                            setActionError(null);
                            setViewing(row);
                          },
                        },
                        {
                          label: 'Close',
                          destructive: true,
                          onSelect: () => setClosing(row),
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
            onPageChange={(nextPage) => setQuery({ page: nextPage })}
            onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize })}
          />
        </>
      ) : null}

      <SupportRequestDetailDialog
        request={viewing}
        onOpenChange={(open) => {
          if (!open) {
            setViewing(null);
            setActionError(null);
          }
        }}
        isResponding={isResponding}
        isClosing={isClosing && closing?.id === viewing?.id}
        actionError={actionError}
        onRespond={handleRespond}
        onCloseRequest={() => viewing && setClosing(viewing)}
      />

      <ConfirmDialog
        open={Boolean(closing)}
        onOpenChange={(open) => !open && setClosing(null)}
        title="Close Support Request?"
        description="This will close the support request. This action cannot be undone."
        confirmLabel="Close"
        loadingLabel="Closing…"
        variant="destructive"
        isLoading={isClosing}
        onConfirm={() => void handleClose()}
      />
    </div>
  );
}
