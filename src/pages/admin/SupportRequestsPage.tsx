import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SupportRequestDetailPanel } from '@/components/features/support/SupportRequestDetailPanel';
import { SupportRequestsTable } from '@/components/features/support/SupportRequestsTable';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSupportRequests } from '@/hooks/useSupportRequests';
import { getApiErrorMessage } from '@/lib/api/get-api-error-message';
import type { SupportRequestItem } from '@/types/api';

export function SupportRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.max(10, Number(searchParams.get('page_size') ?? '20') || 20);
  const searchInput = searchParams.get('search') ?? '';
  const selectedId = searchParams.get('selected');
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useSupportRequests({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const selectedRequest = useMemo(() => {
    if (!data?.items.length) {
      return null;
    }

    if (selectedId) {
      const match = data.items.find((item) => item.id === selectedId);
      if (match) {
        return match;
      }
    }

    return data.items[0] ?? null;
  }, [data, selectedId]);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearchChange = (value: string) => {
    updateSearchParams({ search: value || null, page: '1' });
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams({ page: String(nextPage) });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    updateSearchParams({ page_size: String(nextPageSize), page: '1' });
  };

  const handleSelect = (request: SupportRequestItem) => {
    updateSearchParams({ selected: request.id });
  };

  const emptyDescription = useMemo(() => {
    if (debouncedSearch) {
      return 'No support requests match your search. Try a different term or clear the search.';
    }
    return 'No support requests have been submitted yet.';
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-body-25">Support Requests</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Review user inquiries and respond when backend actions are available.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          type="search"
          placeholder="Search by user, email, subject, or message…"
          value={searchInput}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-10 max-w-md"
          aria-label="Search support requests"
        />
        {data?.pagination ? (
          <p className="text-body-sm text-muted-foreground" aria-live="polite">
            {data.pagination.total} total requests
          </p>
        ) : null}
      </div>

      {isLoading ? <LoadingState message="Loading support requests…" /> : null}

      {isError ? (
        <EmptyState
          title="Unable to load support requests"
          description={getApiErrorMessage(error)}
          action={
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data ? (
        data.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
            <div className="space-y-4">
              <SupportRequestsTable
                requests={data.items}
                selectedId={selectedRequest?.id}
                onSelect={handleSelect}
              />
              <DataTablePagination
                pagination={data.pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>

            <SupportRequestDetailPanel request={selectedRequest} />
          </div>
        ) : (
          <EmptyState title="No support requests" description={emptyDescription} />
        )
      ) : null}
    </div>
  );
}
