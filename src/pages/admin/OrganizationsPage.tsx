import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  OrganizationFormDialog,
  type OrganizationFormValues,
} from "@/components/admin/OrganizationFormDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useOrganizationMutations,
  useOrganizations,
} from "@/hooks/useOrganizations";
import {
  adminPrimaryActionClass,
  adminSearchInputClass,
} from "@/lib/adminFormStyles";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Organization } from "@/types/api";

export function OrganizationsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const { createMutation, updateMutation, deleteMutation } =
    useOrganizationMutations();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch } = useOrganizations({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<Organization>[] = [
    {
      id: "name",
      header: "Organization name",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-white">
          {row.name}
        </span>
      ),
    },
    {
      id: "contact_email",
      header: "Contact email",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-white">
          {row.contact_email}
        </span>
      ),
    },
    {
      id: "phone_number",
      header: "Phone number",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
          {row.phone_number || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-[80px] text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-figma-muted hover:bg-figma-accent/30 hover:text-white"
              aria-label={`Actions for ${row.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-figma-border bg-figma-surface font-outfit"
          >
            <DropdownMenuItem
              className="text-white focus:bg-figma-accent/30 focus:text-white"
              onClick={() => {
                setEditingOrg(row);
                setDialogOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#ff6b6b] focus:bg-[#ff414114] focus:text-[#ff6b6b]"
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

  const handleCreate = () => {
    setEditingOrg(null);
    setDialogOpen(true);
  };

  const handleSubmit = (values: OrganizationFormValues) => {
    if (editingOrg) {
      updateMutation.mutate(
        { id: editingOrg.id, data: values },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingOrg(null);
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Organizations"
        description="Manage organizations registered on the platform."
        className="gap-[12px]"
        titleClassName="text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white"
        descriptionClassName="text-[16px] font-normal leading-[22px] text-figma-muted"
        action={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add organization
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        onRetry={() => void refetch()}
        searchPlaceholder="Search organizations…"
        searchValue={search}
        onSearchChange={setSearch}
        searchInputClassName={adminSearchInputClass}
        serverPagination
        emptyTitle="No organizations yet"
        emptyDescription="Organizations will appear here once they are registered on the platform."
        emptyAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add organization
          </Button>
        }
        primaryAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
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

      <OrganizationFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingOrg(null);
        }}
        organization={editingOrg}
        isLoading={isSaving}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove organization?"
        description={`This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
}
