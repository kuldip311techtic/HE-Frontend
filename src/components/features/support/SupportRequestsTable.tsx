import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/features/shared/DataTable';
import { RowActions } from '@/components/features/shared/RowActions';
import { SUPPORT_MUTATIONS_UNAVAILABLE } from '@/components/features/support/supportCopy';
import { getAttachmentLabel } from '@/lib/utils/attachment';
import { formatDateTime } from '@/lib/utils/format';
import type { PaginationMeta } from '@/types/api';
import type { SupportRequestItem } from '@/types/support';

function initials(name: string, email: string): string {
  const label = name.trim() || email;
  return label
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function renderName(row: SupportRequestItem) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials(row.name, row.email)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{row.name || '—'}</span>
    </div>
  );
}

function renderCreatedAt(row: SupportRequestItem) {
  return formatDateTime(row.created_at);
}

function renderMessage(row: SupportRequestItem) {
  return (
    <span className="line-clamp-2 max-w-xs" title={row.message}>
      {row.message || '—'}
    </span>
  );
}

function renderAttachment(row: SupportRequestItem) {
  return getAttachmentLabel(row.attachment);
}

const SUPPORT_REQUEST_COLUMNS: DataTableColumn<SupportRequestItem>[] = [
  { id: 'id', label: 'Id', accessor: (row) => row.id, sortable: false, defaultHidden: true },
  {
    id: 'name',
    label: 'Name',
    accessor: (row) => row.name,
    sortable: true,
    alwaysVisible: true,
    render: renderName,
  },
  { id: 'email', label: 'Email', accessor: (row) => row.email, sortable: true },
  { id: 'subject', label: 'Subject', accessor: (row) => row.subject, sortable: true },
  {
    id: 'created_at',
    label: 'Created At',
    accessor: (row) => row.created_at,
    sortable: true,
    render: renderCreatedAt,
  },
  {
    id: 'message',
    label: 'Message',
    accessor: (row) => row.message,
    sortable: true,
    defaultHidden: true,
    render: renderMessage,
  },
  {
    id: 'attachment',
    label: 'Attachment',
    accessor: (row) => getAttachmentLabel(row.attachment),
    sortable: true,
    defaultHidden: true,
    render: renderAttachment,
  },
];

interface SupportRequestsTableProps {
  items: SupportRequestItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  leadingToolbar: ReactNode;
  onView: (row: SupportRequestItem) => void;
}

export function SupportRequestsTable({
  items,
  loading,
  error,
  onRetry,
  pagination,
  onPageChange,
  onPageSizeChange,
  leadingToolbar,
  onView,
}: SupportRequestsTableProps) {
  return (
    <DataTable
      columns={SUPPORT_REQUEST_COLUMNS}
      data={items}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No support requests"
      emptyDescription="Inbound inquiries will appear here when they are submitted."
      leadingToolbar={leadingToolbar}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      renderActions={(row) => (
        <div className="inline-flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            aria-label={`View ${row.subject}`}
            title="View"
            onClick={() => onView(row)}
          >
            <Eye className="h-4 w-4" aria-hidden />
          </Button>
          <RowActions
            label={`Actions for ${row.subject}`}
            items={[
              { label: 'View', onSelect: () => onView(row) },
              {
                label: 'Respond',
                onSelect: () => onView(row),
                disabled: true,
                disabledReason: SUPPORT_MUTATIONS_UNAVAILABLE,
              },
              {
                label: 'Close',
                onSelect: () => undefined,
                destructive: true,
                disabled: true,
                disabledReason: SUPPORT_MUTATIONS_UNAVAILABLE,
              },
            ]}
          />
        </div>
      )}
    />
  );
}
