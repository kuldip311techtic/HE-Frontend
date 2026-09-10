import { useEffect, useMemo, useState } from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { SupportRequestDetailDialog } from '@/components/features/support/SupportRequestDetailDialog';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

function getSubmitter(request: SupportRequest): string {
  return request.user ?? request.name ?? request.email ?? 'Unknown User';
}

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
      const submitter = getSubmitter(item).toLowerCase();
      const subject = (item.inquiry_subject ?? item.message ?? '').toLowerCase();
      const description = (item.message_description ?? '').toLowerCase();
      return (
        submitter.includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        subject.includes(query) ||
        description.includes(query) ||
        formatRequestDate(item.request_date ?? item.created_at).toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery, statusFilter]);

  const tableItems = useMemo(
    () =>
      filteredItems.map((item) => ({
        ...item,
        submitter: getSubmitter(item),
        display_date: item.request_date ?? item.created_at ?? '',
      })) as Record<string, unknown>[],
    [filteredItems],
  );

  const { paginatedItems, totalItems, sortKey, sortDirection, handleSort } = useSortablePage(
    tableItems,
    page,
    pageSize,
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

      {error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState label="Loading support requests…" />
      ) : items.length === 0 && !error ? (
        <EmptyState
          title="No Support Requests Yet"
          description="Support requests from users will appear here when submitted."
        />
      ) : showEmptyFiltered ? (
        <EmptyState
          title="No Matching Requests"
          description="Try adjusting your search or status filter."
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    label="User"
                    sortKey="submitter"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Request Date"
                    sortKey="display_date"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Status"
                    sortKey="status"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHead scope="col">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((row) => {
                  const request = row as unknown as SupportRequest & {
                    submitter: string;
                    display_date: string;
                  };
                  const isClosed = request.status?.toLowerCase() === 'closed';
                  return (
                    <TableRow key={request.id}>
                      <TableCell>{request.submitter}</TableCell>
                      <TableCell>{formatRequestDate(request.display_date)}</TableCell>
                      <TableCell>
                        <Badge variant={isClosed ? 'secondary' : 'default'}>
                          {titleCase(request.status ?? 'Open')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${request.submitter}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetail(request)}>
                              <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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
        </div>
      )}

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
