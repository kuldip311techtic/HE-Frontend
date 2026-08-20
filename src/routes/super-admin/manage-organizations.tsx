import { useEffect, useState } from 'react';
import OrganizationForm from '../../components/features/organizations/OrganizationForm';
import OrganizationList from '../../components/features/organizations/OrganizationList';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Toast from '../../components/ui/Toast';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useRemoveOrganization } from '../../hooks/useRemoveOrganization';
import type { Organization } from '../../types/organization';

type FormMode = 'add' | 'edit' | null;

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

export default function ManageOrganizationsPage() {
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [organizationToRemove, setOrganizationToRemove] =
    useState<Organization | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const {
    organizations,
    total,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrganizations(page);

  const removeMutation = useRemoveOrganization();

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openAddForm = () => {
    setSelectedOrganization(null);
    setFormMode('add');
  };

  const openEditForm = (organization: Organization) => {
    setSelectedOrganization(organization);
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedOrganization(null);
  };

  const handleRemoveConfirm = async () => {
    if (!organizationToRemove) {
      return;
    }

    try {
      const response = await removeMutation.removeOrganization(
        organizationToRemove.id,
      );
      setToast({
        message: response.message || 'Organization removed successfully.',
        variant: 'success',
      });
      setOrganizationToRemove(null);

      if (organizations.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        void refetch();
      }
    } catch {
      setToast({
        message:
          removeMutation.errorMessage ??
          'Unable to remove organization. Please try again.',
        variant: 'error',
      });
    }
  };

  const isOrganizationInUse = organizationToRemove?.status === 'active';

  return (
    <AdminLayout title="Manage Organizations">
      <div className="space-y-6">
        <Card
          title="Organizations"
          description="View, add, edit, and remove organizations across the Hoops Engine platform."
          action={
            <Button
              type="button"
              variant="accent"
              fullWidth={false}
              className="min-w-[180px]"
              onClick={openAddForm}
            >
              Add organization
            </Button>
          }
        >
          <OrganizationList
            organizations={organizations}
            total={total}
            page={page}
            pageSize={pageSize}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onPageChange={setPage}
            onEdit={openEditForm}
            onRemove={setOrganizationToRemove}
          />
        </Card>
      </div>

      <OrganizationForm
        mode={formMode === 'edit' ? 'edit' : 'add'}
        organization={selectedOrganization ?? undefined}
        open={formMode !== null}
        onClose={closeForm}
        onSuccess={(message) => {
          setToast({ message, variant: 'success' });
          void refetch();
        }}
      />

      <ConfirmationDialog
        open={Boolean(organizationToRemove)}
        title="Remove organization"
        message={
          organizationToRemove
            ? `Are you sure you want to remove ${organizationToRemove.name}? This action cannot be undone.`
            : ''
        }
        warningMessage={
          isOrganizationInUse
            ? 'This organization is currently active and may be in use by coaches or players.'
            : undefined
        }
        confirmLabel="Remove"
        loading={removeMutation.isLoading}
        onConfirm={() => void handleRemoveConfirm()}
        onCancel={() => {
          if (!removeMutation.isLoading) {
            setOrganizationToRemove(null);
            removeMutation.reset();
          }
        }}
      />

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
