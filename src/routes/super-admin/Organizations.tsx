import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import {
  OrganizationForm,
  type OrganizationFormValues,
} from "@/components/OrganizationForm";
import { OrganizationTable } from "@/components/OrganizationTable";
import { PageHeader } from "@/components/PageHeader";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { useOrganizations } from "@/hooks/useOrganizations";
import { ApiClientError } from "@/services/api-client";
import { getAuthToken } from "@/services/api-client";
import type { SuperAdminOrganization } from "@/types/super-admin";

const PAGE_SIZE = 10;

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const {
    organizations,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    isMutating,
  } = useOrganizations();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<SuperAdminOrganization | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<SuperAdminOrganization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return organizations;
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        (org.contact_email?.toLowerCase().includes(query) ?? false) ||
        (org.phone_number?.toLowerCase().includes(query) ?? false)
    );
  }, [organizations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openCreate = () => {
    setFormMode("create");
    setSelected(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (organization: SuperAdminOrganization) => {
    setFormMode("edit");
    setSelected(organization);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: OrganizationFormValues) => {
    setFormError(null);
    try {
      if (formMode === "create") {
        await create({
          name: values.name,
          contact_email: values.contact_email,
          phone_number: values.phone_number,
          address: values.address,
        });
        toast.success("Organization added successfully.");
      } else if (selected) {
        await update(selected.id, {
          name: values.name,
          contact_email: values.contact_email,
          phone_number: values.phone_number,
          address: values.address,
        });
        toast.success("Organization updated successfully.");
      }
      setFormOpen(false);
      setSelected(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save organization.";
      setFormError(message);
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Organization removed successfully.");
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove organization.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmpty =
    !error && !isLoading && filtered.length === 0 && !search;

  const showNoResults =
    !error && !isLoading && filtered.length === 0 && Boolean(search);

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Manage Organizations"
        description="View, add, edit, and remove platform organizations"
        action={
          <Button onClick={openCreate} aria-label="Add new organization">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Organization
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search organizations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search organizations"
          />
        </div>
        <Button
          onClick={openCreate}
          className="sm:hidden"
          aria-label="Add new organization"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Organization
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {showEmpty ? (
        <EmptyState
          title="No organizations"
          description="Get started by adding your first organization."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Organization
            </Button>
          }
        />
      ) : showNoResults ? (
        <EmptyState
          title="No matching organizations"
          description="No organizations match your search. Try a different term."
        />
      ) : (
        <>
          <OrganizationTable
            organizations={paginated}
            isLoading={isLoading}
            onEdit={openEdit}
            onRemove={setDeleteTarget}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setFormError(null);
            setSelected(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? "Add New Organization"
                : "Edit Organization"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Enter the organization details to register a new organization."
                : "Update the organization details below."}
            </DialogDescription>
          </DialogHeader>
          <OrganizationForm
            mode={formMode}
            initialData={selected ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setFormOpen(false)}
            isSubmitting={isMutating}
            serverError={formError}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove organization"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </SuperAdminLayout>
  );
}
