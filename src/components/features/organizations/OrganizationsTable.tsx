import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/features/shared/DataTable';
import { RowActions } from '@/components/features/shared/RowActions';
import { formatDateTime } from '@/lib/utils/format';
import type { PaginationMeta } from '@/types/api';
import type { OrganizationItem } from '@/types/organization';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function renderName(row: OrganizationItem) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials(row.name)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{row.name || '—'}</span>
    </div>
  );
}

function renderPhone(row: OrganizationItem) {
  return row.phone_number || '—';
}

function renderCreatedAt(row: OrganizationItem) {
  return formatDateTime(row.created_at);
}

const ORGANIZATION_COLUMNS: DataTableColumn<OrganizationItem>[] = [
  { id: 'id', label: 'Id', accessor: (row) => row.id, sortable: false, defaultHidden: true },
  {
    id: 'name',
    label: 'Organization Name',
    accessor: (row) => row.name,
    sortable: true,
    alwaysVisible: true,
    render: renderName,
  },
  {
    id: 'contact_email',
    label: 'Contact Email',
    accessor: (row) => row.contact_email,
    sortable: true,
  },
  {
    id: 'phone_number',
    label: 'Phone Number',
    accessor: (row) => row.phone_number,
    sortable: true,
    render: renderPhone,
  },
  {
    id: 'description',
    label: 'Description',
    accessor: (row) => row.description,
    sortable: true,
    defaultHidden: true,
  },
  {
    id: 'join_code',
    label: 'Join Code',
    accessor: (row) => row.join_code,
    sortable: true,
    defaultHidden: true,
  },
  {
    id: 'created_at',
    label: 'Created At',
    accessor: (row) => row.created_at,
    sortable: true,
    defaultHidden: true,
    render: renderCreatedAt,
  },
];

interface OrganizationsTableProps {
  items: OrganizationItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  leadingToolbar: ReactNode;
  trailingToolbar: ReactNode;
  emptyAction?: ReactNode;
  onView: (row: OrganizationItem) => void;
  onEdit: (row: OrganizationItem) => void;
  onRemove: (row: OrganizationItem) => void;
}

export function OrganizationsTable({
  items,
  loading,
  error,
  onRetry,
  pagination,
  onPageChange,
  onPageSizeChange,
  leadingToolbar,
  trailingToolbar,
  emptyAction,
  onView,
  onEdit,
  onRemove,
}: OrganizationsTableProps) {
  return (
    <DataTable
      columns={ORGANIZATION_COLUMNS}
      data={items}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No organizations yet"
      emptyDescription="Add an organization to get started."
      emptyAction={emptyAction}
      leadingToolbar={leadingToolbar}
      trailingToolbar={trailingToolbar}
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
            aria-label={`View ${row.name}`}
            title="View"
            onClick={() => onView(row)}
          >
            <Eye className="h-4 w-4" aria-hidden />
          </Button>
          <RowActions
            label={`Actions for ${row.name}`}
            items={[
              { label: 'View', onSelect: () => onView(row) },
              { label: 'Edit', onSelect: () => onEdit(row) },
              { label: 'Remove', onSelect: () => onRemove(row), destructive: true },
            ]}
          />
        </div>
      )}
    />
  );
}
