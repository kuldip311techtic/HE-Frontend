import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { SupportRequestDetail } from '@/components/features/support/SupportRequestDetail';
import { SupportRequestsTable } from '@/components/features/support/SupportRequestsTable';
import { useSupportRequests } from '@/hooks/useSupportRequests';
import { useListQuery } from '@/hooks/useListQuery';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import type { PaginationMeta } from '@/types/api';
import type { SupportRequestItem } from '@/types/support';

function toPagination(
  meta: PaginationMeta | undefined,
  page: number,
  pageSize: number,
  loadedCount: number,
): PaginationMeta {
  if (meta) return meta;
  return {
    page,
    page_size: pageSize,
    total: loadedCount,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };
}

export function SupportRequestsPage() {
  const list = useListQuery();
  const query = useSupportRequests({
    page: list.page,
    page_size: list.pageSize,
    search: list.search || undefined,
  });
  const [viewing, setViewing] = React.useState<SupportRequestItem | null>(null);
  const items = query.data?.items ?? [];
  const pagination = toPagination(query.data?.pagination, list.page, list.pageSize, items.length);

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Support requests"
        description="Review inbound support inquiries. Use View to read the full message. Respond and Close stay unavailable until the API exposes those operations."
      />
      <SupportRequestsTable
        items={items}
        loading={query.isLoading}
        error={
          query.isError
            ? getApiErrorMessage(query.error, 'Unable to load support requests. Please try again.')
            : null
        }
        onRetry={() => void query.refetch()}
        pagination={pagination}
        onPageChange={list.setPage}
        onPageSizeChange={list.setPageSize}
        leadingToolbar={
          <Input
            value={list.searchInput}
            onChange={(event) => list.setSearchInput(event.target.value)}
            placeholder="Search Support Requests"
            aria-label="Search Support Requests"
            className="md:max-w-sm"
          />
        }
        onView={setViewing}
      />
      <SupportRequestDetail
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        request={viewing}
      />
    </div>
  );
}
