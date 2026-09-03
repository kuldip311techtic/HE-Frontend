import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrganizationForm } from "@/components/features/super-admin/OrganizationForm";
import type { OrganizationFormValues } from "@/components/features/super-admin/OrganizationForm";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "@/hooks/useOrganizations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Organization } from "@/types/api";

const FORM_ID = "organization-form";

export function OrganizationsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const { data, isLoading, isError, error, refetch } = useOrganizations({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const openCreate = () => {
    setDialogMode("create");
    setSelectedOrg(null);
    setDialogOpen(true);
  };

  const openEdit = (org: Organization) => {
    setDialogMode("edit");
    setSelectedOrg(org);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: OrganizationFormValues) => {
    try {
      if (dialogMode === "create") {
        const result = await createMutation.mutateAsync(values);
        toast.success(result.message || "Organization created successfully.");
      } else if (selectedOrg) {
        const result = await updateMutation.mutateAsync({
          organization_id: selectedOrg.id,
          data: values,
        });
        toast.success(result.message || "Changes saved successfully.");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to save organization. Please try again."),
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const result = await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(result.message || "Organization deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to delete organization. Please try again."),
      );
    }
  };

  const columns: DataTableColumn<Organization>[] = [
    {
      id: "name",
      header: "Organization name",
      cell: (row) => row.name,
      sortable: true,
      sortValue: (row) => row.name,
    },
    {
      id: "contact_email",
      header: "Contact email",
      cell: (row) => row.contact_email,
      sortable: true,
      sortValue: (row) => row.contact_email,
    },
    {
      id: "phone_number",
      header: "Phone number",
      cell: (row) => row.phone_number,
      sortable: true,
      sortValue: (row) => row.phone_number,
    },
    {
      id: "actions",
      header: "",
      className: "w-[60px] text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Manage Organizations"
        description="View, add, edit, and remove organizations across the Hoops Engine platform."
        action={
          <Button onClick={openCreate} className="min-h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add organization
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        error={
          isError
            ? getApiErrorMessage(
                error,
                "Unable to load organizations. Please try again.",
              )
            : null
        }
        onRetry={() => void refetch()}
        searchPlaceholder="Search organizations…"
        searchValue={search}
        onSearchChange={setSearch}
        serverSide
        emptyTitle="No organizations yet"
        emptyDescription="Add your first organization to get started."
        emptyAction={
          <Button onClick={openCreate} className="min-h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add organization
          </Button>
        }
        pagination={{
          page,
          pageSize,
          total: data?.pagination.total ?? 0,
        }}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add organization" : "Edit organization"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter the organization details below. All fields are required."
                : "Update the organization details below. All fields are required."}
            </DialogDescription>
          </DialogHeader>

          <OrganizationForm
            key={dialogMode === "create" ? "create" : selectedOrg?.id}
            mode={dialogMode}
            organization={selectedOrg}
            formId={FORM_ID}
            onSubmit={handleSubmit}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending
                ? "Creating…"
                : updateMutation.isPending
                  ? "Saving…"
                  : dialogMode === "create"
                    ? "Create"
                    : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove organization?"
        description={`This will permanently delete "${deleteTarget?.name}" and its associated data. This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
