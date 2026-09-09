import * as React from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/features/shared/ConfirmDialog';
import { SupportRequestDetail } from '@/components/features/support/SupportRequestDetail';
import { SupportRequestsTable } from '@/components/features/support/SupportRequestsTable';
import { useCloseSupportRequest, useSupportRequests } from '@/hooks/useSupportRequests';
import { useListQuery } from '@/hooks/useListQuery';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import type { PaginationMeta } from '@/types/api';
import type { SupportRequestItem } from '@/types/support';

function toPagination(
  meta: PaginationMeta | undefined,
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  if (meta) return meta;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

export function SupportRequestsPage() {
  const list = useListQuery();
  const query = useSupportRequests({
    page: list.page,
    page_size: list.pageSize,
    search: list.search || undefined,
  });
  const closeMutation = useCloseSupportRequest();
  const [viewing, setViewing] = React.useState<SupportRequestItem | null>(null);
  const [closing, setClosing] = React.useState<SupportRequestItem | null>(null);
  const items = query.data?.items ?? [];
  const pagination = toPagination(query.data?.pagination, list.page, list.pageSize, items.length);

  const handleClose = async () => {
    if (!closing) return;
    try {
      const response = await closeMutation.mutateAsync(closing.id);
      toast.success(response.message || 'Support request closed.');
      setClosing(null);
      if (viewing?.id === closing.id) setViewing(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to close this request. Please try again.'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Support requests"
        description="Review inbound support inquiries, send a response, or close a request."
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
            placeholder="Search support requests"
            aria-label="Search support requests"
            className="md:max-w-sm"
          />
        }
        onView={setViewing}
        onRespond={setViewing}
        onClose={setClosing}
      />
      <SupportRequestDetail
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        request={viewing}
        isClosing={closeMutation.isPending && closing?.id === viewing?.id}
        onCloseRequest={setClosing}
      />
      <ConfirmDialog
        open={Boolean(closing)}
        onOpenChange={(open) => {
          if (!open) setClosing(null);
        }}
        title="Close this support request?"
        description="This marks the request as closed. This action cannot be undone from this screen."
        confirmLabel="Close request"
        loadingLabel="Closing…"
        isLoading={closeMutation.isPending}
        onConfirm={() => {
          void handleClose();
        }}
      />
    </div>
  );
}
