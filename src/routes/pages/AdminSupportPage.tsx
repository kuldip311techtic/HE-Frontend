import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CloseSupportRequestDialog } from '@/components/features/support/CloseSupportRequestDialog';
import { SupportRequestDetailPanel } from '@/components/features/support/SupportRequestDetailPanel';
import { SupportRequestsTable } from '@/components/features/support/SupportRequestsTable';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { TablePagination } from '@/components/ui/pagination';
import { useSupportRequestMutations } from '@/hooks/useSupportRequestMutations';
import { useSupportRequests } from '@/hooks/useSupportRequests';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getApiErrorMessage } from '@/lib/utils/errors';
import {
  resolveSupportRequestId,
  type SupportRequestItem,
} from '@/types/support-requests';

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'closed', label: 'Closed' },
];

export function AdminSupportPage() {
  const { isHydrating } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;
  const pageSize = Number.parseInt(searchParams.get('page_size') ?? '10', 10) || 10;
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';

  const [searchInput, setSearchInput] = useState(search);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequestItem | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: search || null,
      status: status || null,
    }),
    [page, pageSize, search, status],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useSupportRequests(listParams);
  const { respond, close } = useSupportRequestMutations();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const requests = useMemo(() => data?.items ?? [], [data?.items]);
  const pagination = data?.pagination;

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateParams({ search: trimmed || null, page: '1' });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  useEffect(() => {
    setSelectedRequest(null);
  }, [page, pageSize, search, status]);

  useEffect(() => {
    if (!selectedRequest?.id) return;
    const refreshed = requests.find((item) => item.id === selectedRequest.id);
    if (refreshed) {
      setSelectedRequest(refreshed);
      return;
    }
    setSelectedRequest(null);
  }, [requests, selectedRequest?.id]);

  const handleSelectRequest = (request: SupportRequestItem) => {
    setSelectedRequest(request);
  };

  const handleRespond = async (payload: { request_id: string; response: string }) => {
    const result = await respond.mutateAsync(payload);
    setSelectedRequest(result);
  };

  const handleCloseClick = () => {
    setCloseError(null);
    setCloseOpen(true);
  };

  const handleConfirmClose = async () => {
    if (!selectedRequest) return;
    setCloseError(null);
    try {
      const result = await close.mutateAsync(resolveSupportRequestId(selectedRequest));
      setSelectedRequest(result);
      setCloseOpen(false);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Unable to close support request. Please try again.');
      setCloseError(message);
      toast.error(message);
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading support requests…" fullPage />;
  }

  return (
    <div className="admin-manage-page">
      <div className="admin-manage-page__glow" aria-hidden="true" />
      <div className="admin-manage-page__inner">
        <header className="admin-manage-page__header">
          <h2 className="text-body-42 text-foreground">Support Requests</h2>
          <p className="font-outfit text-body-sm text-muted-foreground">
            Review user inquiries, submit responses, and close resolved support requests.
          </p>
        </header>

        <div className="admin-manage-page__toolbar">
          <div className="admin-manage-page__toolbar-filters">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search support requests…"
              aria-label="Search support requests"
              className="admin-field-input w-full sm:max-w-md"
            />
            <select
              value={status}
              onChange={(event) => updateParams({ status: event.target.value || null, page: '1' })}
              aria-label="Filter by status"
              className="admin-field-select sm:w-auto"
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isError ? (
          <EmptyState
            title="Unable to load support requests"
            description={getApiErrorMessage(
              error,
              'Unable to load support requests. Please try again.',
            )}
            action={
              <Button
                onClick={() => refetch()}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-primary-btn"
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </Button>
            }
          />
        ) : null}

        {!isError && isLoading ? (
          <div className="admin-support-grid">
            <SupportRequestsTable requests={[]} isLoading onSelect={() => {}} />
            <SupportRequestDetailPanel
              request={null}
              onRespond={async () => {}}
              onClose={() => {}}
            />
          </div>
        ) : null}

        {!isError && !isLoading && requests.length === 0 ? (
          <EmptyState
            title="No support requests"
            description="When users submit support inquiries, they will appear here for review."
          />
        ) : null}

        {!isError && !isLoading && requests.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="admin-support-grid">
              <SupportRequestsTable
                requests={requests}
                selectedId={selectedRequest?.id ?? null}
                onSelect={handleSelectRequest}
              />
              <SupportRequestDetailPanel
                request={selectedRequest}
                onRespond={handleRespond}
                onClose={handleCloseClick}
                isResponding={respond.isPending}
                isClosing={close.isPending}
              />
            </div>
            {pagination ? (
              <TablePagination
                pagination={pagination}
                appearance="admin"
                onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
                onPageSizeChange={(nextSize) =>
                  updateParams({ page_size: String(nextSize), page: '1' })
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <CloseSupportRequestDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        request={selectedRequest}
        onConfirm={handleConfirmClose}
        isLoading={close.isPending}
        errorMessage={closeError}
      />
    </div>
  );
}
