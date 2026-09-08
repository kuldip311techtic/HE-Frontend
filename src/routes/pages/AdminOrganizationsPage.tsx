import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
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
      const message = getApiErrorMessage(err, 'Unable to remove organization. Please try again.');
      setRemoveError(message);
      toast.error(message);
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading organizations…" fullPage />;
  }

  const organizations = data?.items ?? [];
  const pagination = data?.pagination;
  const isFormSubmitting = create.isPending || update.isPending;

  return (
    <div className="admin-manage-page">
      <div className="admin-manage-page__glow" aria-hidden="true" />
      <div className="admin-manage-page__inner">
        <header className="admin-manage-page__header">
          <h1 className="text-body-42 text-foreground">Manage Organizations</h1>
          <p className="font-outfit text-body-sm text-muted-foreground">
            View, add, edit, and remove organization accounts on the platform.
          </p>
        </header>

        <div className="admin-manage-page__toolbar">
          <div className="admin-manage-page__toolbar-filters">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search organizations…"
              aria-label="Search organizations"
              className="admin-field-input w-full sm:max-w-md"
            />
          </div>
          <Button type="button" onClick={handleAddOrganization} className="admin-primary-btn shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add organization
          </Button>
        </div>

        {isError ? (
          <EmptyState
            title="Unable to load organizations"
            description={getApiErrorMessage(
              error,
              'Unable to load organizations. Please try again.',
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
              <Button type="button" onClick={handleAddOrganization} className="admin-primary-btn">
                Add organization
              </Button>
            }
          />
        ) : null}

        {!isError && !isLoading && organizations.length > 0 ? (
          <div className="flex flex-col gap-4">
            <OrganizationsTable
              organizations={organizations}
              onEdit={handleEditOrganization}
              onRemove={handleRemoveOrganization}
            />
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
