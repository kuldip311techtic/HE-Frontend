import { Plus } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { OrganizationForm } from "@/components/organizations/OrganizationForm";
import { OrganizationTable } from "@/components/organizations/OrganizationTable";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "@/hooks/useOrganizations";
import { getOrganizationName } from "@/lib/organization-helpers";
import type { Organization, OrganizationFormValues } from "@/types/organization";

export default function ManageOrganizations() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] =
    useState<Organization | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useOrganizations();

  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();
  const deleteOrganizationMutation = useDeleteOrganization();

  const organizations = data?.items ?? [];
  const total = data?.total ?? organizations.length;

  const handleCreateSubmit = (values: OrganizationFormValues) => {
    createOrganizationMutation.mutate(
      {
        name: values.name,
        contact_email: values.contact_email,
        phone_number: values.phone_number,
        address: values.address,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
        },
      },
    );
  };

  const handleEditSubmit = (values: OrganizationFormValues) => {
    if (!editingOrganization) {
      return;
    }

    updateOrganizationMutation.mutate(
      {
        id: editingOrganization.id,
        payload: {
          name: values.name,
          contact_email: values.contact_email,
          phone_number: values.phone_number,
          address: values.address,
        },
      },
      {
        onSuccess: () => {
          setEditingOrganization(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingOrganization) {
      return;
    }

    deleteOrganizationMutation.mutate(deletingOrganization.id, {
      onSuccess: () => {
        setDeletingOrganization(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Manage Organizations"
        description="View, add, edit, and remove organizations across the platform."
        action={
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="min-h-11 w-full sm:w-auto"
            aria-label="Add new organization"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add organization
          </Button>
        }
      />

      {isError ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <ErrorMessage
              message={error?.message ?? "Failed to load organizations."}
            />
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!isLoading && organizations.length === 0 ? (
            <EmptyState
              title="No organizations yet"
              description="Get started by adding your first organization."
              action={
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="min-h-11"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add organization
                </Button>
              }
            />
          ) : (
            <>
              <OrganizationTable
                organizations={organizations}
                onEdit={setEditingOrganization}
                onDelete={setDeletingOrganization}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && total > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {total} organization{total === 1 ? "" : "s"} total
                </p>
              )}
            </>
          )}
        </>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add organization</DialogTitle>
            <DialogDescription>
              Create a new organization with contact details and address.
            </DialogDescription>
          </DialogHeader>
          <OrganizationForm
            mode="create"
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createOrganizationMutation.isPending}
            error={createOrganizationMutation.error}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingOrganization !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOrganization(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit organization</DialogTitle>
            <DialogDescription>
              Update details for{" "}
              {editingOrganization
                ? getOrganizationName(editingOrganization)
                : "this organization"}
              .
            </DialogDescription>
          </DialogHeader>
          {editingOrganization && (
            <OrganizationForm
              mode="edit"
              organization={editingOrganization}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingOrganization(null)}
              isLoading={updateOrganizationMutation.isPending}
              error={updateOrganizationMutation.error}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingOrganization !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingOrganization(null);
          }
        }}
        title="Remove organization"
        description={
          deletingOrganization
            ? `Are you sure you want to remove ${getOrganizationName(deletingOrganization)}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteOrganizationMutation.isPending}
      />
    </div>
  );
}
