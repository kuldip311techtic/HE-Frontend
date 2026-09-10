import * as React from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/features/shared/ConfirmDialog';
import { DetailFields } from '@/components/features/shared/DetailFields';
import { OrganizationFormDialog } from '@/components/features/organizations/OrganizationFormDialog';
import { OrganizationsTable } from '@/components/features/organizations/OrganizationsTable';
import { useDeleteOrganization, useOrganizations } from '@/hooks/useOrganizations';
import { useListQuery } from '@/hooks/useListQuery';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { formatDateTime } from '@/lib/utils/format';
import type { OrganizationItem } from '@/types/organization';
import type { PaginationMeta } from '@/types/api';

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

export function OrganizationsPage() {
  const list = useListQuery();
  const query = useOrganizations({
    page: list.page,
    page_size: list.pageSize,
    search: list.search || undefined,
  });
  const deleteMutation = useDeleteOrganization();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<OrganizationItem | null>(null);
  const [viewing, setViewing] = React.useState<OrganizationItem | null>(null);
  const [removing, setRemoving] = React.useState<OrganizationItem | null>(null);

  const items = query.data?.items ?? [];
  const pagination = toPagination(query.data?.pagination, list.page, list.pageSize, items.length);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleRemove = async () => {
    if (!removing) return;
    try {
      const response = await deleteMutation.mutateAsync(removing.id);
      toast.success(response.message || 'Organization removed successfully.');
      setRemoving(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to remove this organization. Please try again.'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Manage Organizations"
        description="Create, update, and remove organizations on the platform."
      />
      <OrganizationsTable
        items={items}
        loading={query.isLoading}
        error={
          query.isError
            ? getApiErrorMessage(query.error, 'Unable to load organizations. Please try again.')
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
            placeholder="Search Organizations"
            aria-label="Search Organizations"
            className="md:max-w-sm"
          />
        }
        trailingToolbar={
          <Button type="button" variant="brand" onClick={openCreate}>
            Add Organization
          </Button>
        }
        onView={setViewing}
        onEdit={(row) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onRemove={setRemoving}
      />
      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        organization={editing}
      />
      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        title={viewing?.name ?? 'Organization'}
        description="Organization details from the live API."
        footer={
          <Button type="button" variant="outline" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing ? (
          <DetailFields
            sections={[
              {
                title: 'Profile',
                fields: [
                  { label: 'Name', value: viewing.name },
                  { label: 'Description', value: viewing.description || '—' },
                ],
              },
              {
                title: 'Contact',
                fields: [
                  { label: 'Contact email', value: viewing.contact_email },
                  { label: 'Phone number', value: viewing.phone_number || '—' },
                  { label: 'Address', value: viewing.address || '—' },
                ],
              },
              {
                title: 'System',
                fields: [
                  { label: 'Join code', value: viewing.join_code || '—' },
                  { label: 'Created at', value: formatDateTime(viewing.created_at) },
                ],
              },
            ]}
          />
        ) : null}
      </Dialog>
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open && deleteMutation.isPending) return;
          if (!open) setRemoving(null);
        }}
        title="Remove organization?"
        description={
          removing
            ? `This will permanently delete ${removing.name} and its associated data. This action cannot be undone.`
            : 'This will permanently delete the organization and its associated data. This action cannot be undone.'
        }
        confirmLabel="Remove"
        loadingLabel="Removing…"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          void handleRemove();
        }}
      />
    </div>
  );
}
