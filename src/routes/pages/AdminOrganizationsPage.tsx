import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { OrganizationForm } from '@/components/features/organizations/OrganizationForm';
import { OrganizationsTable } from '@/components/features/organizations/OrganizationsTable';
import { RemoveOrganizationDialog } from '@/components/features/organizations/RemoveOrganizationDialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { TablePagination } from '@/components/ui/pagination';
import { useOrganizationMutations } from '@/hooks/useOrganizationMutations';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getApiErrorMessage } from '@/lib/utils/errors';
import type {
  OrganizationCreateRequest,
  OrganizationItem,
  OrganizationUpdateRequest,
} from '@/types/organizations';

export function AdminOrganizationsPage() {
  const { isHydrating } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;
  const pageSize = Number.parseInt(searchParams.get('page_size') ?? '10', 10) || 10;
  const search = searchParams.get('search') ?? '';

  const [searchInput, setSearchInput] = useState(search);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationItem | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: search || null,
    }),
    [page, pageSize, search],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useOrganizations(listParams);
  const { create, update, remove } = useOrganizationMutations();

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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim() || null, page: '1' });
  };

  const handleAddOrganization = () => {
    setFormMode('create');
    setSelectedOrganization(null);
    setFormOpen(true);
  };

  const handleEditOrganization = (organization: OrganizationItem) => {
    setFormMode('edit');
    setSelectedOrganization(organization);
    setFormOpen(true);
  };

  const handleRemoveOrganization = (organization: OrganizationItem) => {
    setSelectedOrganization(organization);
    setRemoveError(null);
    setRemoveOpen(true);
  };

  const handleFormSubmit = async (
    payload: OrganizationCreateRequest | OrganizationUpdateRequest,
  ) => {
    if (formMode === 'create') {
      await create.mutateAsync(payload as OrganizationCreateRequest);
    } else if (selectedOrganization) {
      await update.mutateAsync({ organizationId: selectedOrganization.id, payload });
    }
  };

  const handleConfirmRemove = async () => {
    if (!selectedOrganization) return;
    setRemoveError(null);
    try {
      await remove.mutateAsync(selectedOrganization.id);
      setRemoveOpen(false);
      setSelectedOrganization(null);
    } catch (err) {
      setRemoveError(
        getApiErrorMessage(err, 'Unable to remove organization. Please try again.'),
      );
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading organizations…" fullPage />;
  }

  const organizations = data?.items ?? [];
  const pagination = data?.pagination;
  const isFormSubmitting = create.isPending || update.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-body-42 text-foreground">Manage Organizations</h2>
          <p className="mt-1 font-outfit text-body-sm text-muted-foreground">
            View, add, edit, and remove organization accounts on the platform.
          </p>
        </div>
        <Button type="button" onClick={handleAddOrganization} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add organization
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search organizations…"
            aria-label="Search organizations"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {isError ? (
        <EmptyState
          title="Unable to load organizations"
          description={getApiErrorMessage(
            error,
            'Unable to load organizations. Please try again.',
          )}
          action={
            <Button onClick={() => refetch()} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Retrying…' : 'Retry'}
            </Button>
          }
        />
      ) : null}

      {!isError && isLoading ? (
        <OrganizationsTable
          organizations={[]}
          isLoading
          onEdit={() => {}}
          onRemove={() => {}}
        />
      ) : null}

      {!isError && !isLoading && organizations.length === 0 ? (
        <EmptyState
          title="No organizations yet"
          description="Create your first organization to get started."
          action={
            <Button type="button" onClick={handleAddOrganization}>
              Add organization
            </Button>
          }
        />
      ) : null}

      {!isError && !isLoading && organizations.length > 0 ? (
        <div className="space-y-4">
          <OrganizationsTable
            organizations={organizations}
            onEdit={handleEditOrganization}
            onRemove={handleRemoveOrganization}
          />
          {pagination ? (
            <TablePagination
              pagination={pagination}
              onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
              onPageSizeChange={(nextSize) =>
                updateParams({ page_size: String(nextSize), page: '1' })
              }
            />
          ) : null}
        </div>
      ) : null}

      <OrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        organization={selectedOrganization}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
      />

      <RemoveOrganizationDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        organization={selectedOrganization}
        onConfirm={handleConfirmRemove}
        isLoading={remove.isPending}
        errorMessage={removeError}
      />
    </div>
  );
}
