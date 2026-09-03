import { useState } from "react";
import { Navigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationForm } from "@/components/features/super-admin/OrganizationForm";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useUpdateOrganization,
} from "@/hooks/useOrganizationMutations";
import { useOrganizations } from "@/hooks/useOrganizations";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Organization } from "@/types/api";

export function OrganizationsPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const { data, isLoading, isError, error, refetch } = useOrganizations({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  if (!isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  const columns: DataTableColumn<Organization>[] = [
    {
      id: "name",
      header: "Organization name",
      cell: (row) => row.name,
      sortValue: (row) => row.name,
    },
    {
      id: "contact_email",
      header: "Contact email",
      cell: (row) => row.contact_email,
      sortValue: (row) => row.contact_email,
    },
    {
      id: "phone_number",
      header: "Phone",
      cell: (row) => row.phone_number,
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
              className="h-8 w-8"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingOrg(row);
                setFormOpen(true);
              }}
            >
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

  const handleFormSubmit = async (values: {
    name: string;
    contact_email: string;
    phone_number: string;
    address: string;
  }) => {
    if (editingOrg) {
      await updateMutation.mutateAsync({
        organizationId: editingOrg.id,
        body: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    setFormOpen(false);
    setEditingOrg(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isFormLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Organizations"
        description="Manage platform organizations, contact details, and addresses."
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
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
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        serverSide
        emptyTitle="No organizations yet"
        emptyDescription="Add your first organization to get started."
        primaryAction={
          <Button
            className="min-h-11"
            onClick={() => {
              setEditingOrg(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add organization
          </Button>
        }
        emptyAction={
          <Button
            className="min-h-11"
            onClick={() => {
              setEditingOrg(null);
              setFormOpen(true);
            }}
          >
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
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <OrganizationForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingOrg(null);
        }}
        organization={editingOrg}
        isLoading={isFormLoading}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove organization?"
        description={`This will permanently remove "${deleteTarget?.name}" and its associated data. This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
