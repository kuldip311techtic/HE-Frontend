import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { DeleteOrganizationDialog } from '@/components/features/organizations/DeleteOrganizationDialog';
import {
  OrganizationFormDialog,
  type OrganizationFormValues,
} from '@/components/features/organizations/OrganizationFormDialog';
import { OrganizationsTable } from '@/components/features/organizations/OrganizationsTable';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useCreateOrganization,
  useDeleteOrganization,
  useUpdateOrganization,
} from '@/hooks/useOrganizationMutations';
import { useOrganizations } from '@/hooks/useOrganizations';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '@/lib/api/get-api-error-message';
import type { OrganizationItem } from '@/types/api';

export function OrganizationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationItem | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.max(10, Number(searchParams.get('page_size') ?? '20') || 20);
  const searchInput = searchParams.get('search') ?? '';
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useOrganizations({
    page,
    pageSize,
    search: debouncedSearch,
  });

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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

  const handleAdd = () => {
    setSelectedOrganization(null);
    setSubmitError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleEdit = (organization: OrganizationItem) => {
    setSelectedOrganization(organization);
    setSubmitError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleRemove = (organization: OrganizationItem) => {
    setSelectedOrganization(organization);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: OrganizationFormValues) => {
    setSubmitError(null);
    setFieldErrors({});

    try {
      if (selectedOrganization) {
        await updateMutation.mutateAsync({
          organizationId: selectedOrganization.id,
          body: values,
        });
        toast.success('Organization updated successfully.');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Organization created successfully.');
      }

      setFormOpen(false);
      setSelectedOrganization(null);
    } catch (mutationError) {
      const apiFieldErrors = getApiFieldErrors(mutationError);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors(apiFieldErrors);
      }
      setSubmitError(getApiErrorMessage(mutationError));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrganization) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(selectedOrganization.id);
      toast.success('Organization removed successfully.');
      setDeleteOpen(false);
      setSelectedOrganization(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError));
    }
  };

  const emptyDescription = useMemo(() => {
    if (debouncedSearch) {
      return 'No organizations match your search. Try a different term or clear the search.';
    }
    return 'No organizations have been added yet.';
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-outfit text-body-25">Organizations</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Manage organization accounts, contact details, and addresses.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add organization
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          type="search"
          placeholder="Search organizations…"
          value={searchInput}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-10 max-w-md"
          aria-label="Search organizations"
        />
        {data?.pagination ? (
          <p className="text-body-sm text-muted-foreground" aria-live="polite">
            {data.pagination.total} total organizations
          </p>
        ) : null}
      </div>

      {isLoading ? <LoadingState message="Loading organizations…" /> : null}

      {isError ? (
        <EmptyState
          title="Unable to load organizations"
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
          <div className="space-y-4">
            <OrganizationsTable
              organizations={data.items}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
            <DataTablePagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        ) : (
          <EmptyState
            title="No organizations yet"
            description={emptyDescription}
            action={
              <Button type="button" onClick={handleAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add organization
              </Button>
            }
          />
        )
      ) : null}

      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={selectedOrganization}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        fieldErrors={fieldErrors}
      />

      <DeleteOrganizationDialog
        organization={selectedOrganization}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void handleDeleteConfirm()}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
