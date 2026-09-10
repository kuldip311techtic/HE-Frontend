import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SupportRequestDetailDialog } from '@/components/features/support/SupportRequestDetailDialog';
import type { DataTableColumn } from '@/components/shared/DataTable';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupportRequests } from '@/hooks/useSupportRequests';
import { useSortablePage } from '@/hooks/useSortablePage';
import { getApiErrorMessage } from '@/lib/api';
import { cn, titleCase } from '@/lib/utils';
import type { SupportRequest } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatRequestDate(value: string | undefined): string {
  if (!value) {
    return '—';
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return dateFormatter.format(parsed);
}

type SupportRequestRow = SupportRequest & {
  display_user: string;
  display_date: string;
};

export function SupportRequestsPage() {
  const { items, isLoading, error, refetch, respond, close } = useSupportRequests();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<SupportRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const statusOptions = useMemo(() => {
    const values = new Set<string>();
    for (const item of items) {
      if (item.status) {
        values.add(item.status.toLowerCase());
      }
    }
    return Array.from(values).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status?.toLowerCase() !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      const user = (item.user ?? '').toLowerCase();
      const message = (item.message ?? '').toLowerCase();
      return (
        user.includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        message.includes(query) ||
        formatRequestDate(item.request_date).toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery, statusFilter]);

  const tableRows = useMemo<SupportRequestRow[]>(
    () =>
      filteredItems.map((item) => ({
        ...item,
        display_user: item.user ?? '—',
        display_date: item.request_date ?? '',
      })),
    [filteredItems],
  );

  const { paginatedItems, totalItems, sortKey, sortDirection, handleSort } = useSortablePage(
    tableRows,
    page,
    pageSize,
  );

  const supportColumns: DataTableColumn<SupportRequestRow>[] = useMemo(
    () => [
      {
        id: 'user',
        label: 'User',
        sortKey: 'display_user',
        alwaysVisible: true,
        render: (request) => request.display_user,
      },
      {
        id: 'request_date',
        label: 'Request Date',
        sortKey: 'display_date',
        alwaysVisible: true,
        render: (request) => formatRequestDate(request.request_date),
      },
      {
        id: 'status',
        label: 'Status',
        sortKey: 'status',
        alwaysVisible: true,
        render: (request) => {
          const isClosed = request.status?.toLowerCase() === 'closed';
          return (
            <Badge variant={isClosed ? 'secondary' : 'default'}>
              {titleCase(request.status ?? 'Open')}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  const handleRespond = async (requestId: string, response: string) => {
    try {
      await respond(requestId, response);
      toast.success('Response submitted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to submit response.'));
      throw err;
    }
  };

  const handleClose = async (id: string) => {
    try {
      await close(id);
      toast.success('Support request closed successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to close support request.'));
      throw err;
    }
  };

  const openDetail = (request: SupportRequest) => {
    setSelected(request);
    setDialogOpen(true);
  };

  const showEmptyFiltered = !isLoading && !error && items.length > 0 && filteredItems.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Requests"
        description="Review and respond to user support inquiries."
      />

      <DataTable
        columns={supportColumns}
        rows={paginatedItems}
        getRowKey={(request) => request.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        columnVisibility={{ user: true, request_date: true, status: true }}
        onColumnVisibilityChange={() => {}}
        toggleableColumns={[]}
        showColumnsControl={false}
        isLoading={isLoading}
        loadingLabel="Loading support requests…"
        error={error}
        onRetry={() => void refetch()}
        isEmpty={!isLoading && !error && items.length === 0}
        emptyTitle="No Support Requests Yet"
        emptyDescription="Support requests from users will appear here when submitted."
        isEmptyFiltered={showEmptyFiltered}
        filteredEmptyTitle="No Matching Requests"
        filteredEmptyDescription="Try adjusting your search or status filter."
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="search"
              placeholder="Search Support Requests"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="sm:max-w-xs"
              aria-label="Search Support Requests"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto',
              )}
              aria-label="Filter By Status"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </select>
          </div>
        }
        renderActions={(request) => (
          <Button type="button" variant="outline" size="sm" onClick={() => openDetail(request)}>
            View
          </Button>
        )}
        pagination={
          totalItems > 0 ? (
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          ) : null
        }
      />

      <SupportRequestDetailDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelected(null);
          }
        }}
        request={selected}
        onRespond={handleRespond}
        onClose={handleClose}
      />
    </div>
  );
}
