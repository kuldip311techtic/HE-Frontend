import { useMemo, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserForm } from "@/components/features/super-admin/UserForm";
import {
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "@/hooks/useAdminUserMutations";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AdminUser, RoleOption } from "@/types/api";

const DEFAULT_ROLES: RoleOption[] = [
  { value: "coach", label: "Coach" },
  { value: "player", label: "Player" },
  { value: "org_admin", label: "Organization Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export function UsersPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFilter = searchParams.get("role") ?? "all";

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });

  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser();
  const deleteMutation = useDeleteAdminUser();

  const roleOptions = useMemo(
    () => (data?.roles?.length ? data.roles : DEFAULT_ROLES),
    [data?.roles],
  );

  const filterOptions = useMemo(
    () =>
      roleOptions.map((r) => ({
        label: r.label,
        value: r.value,
      })),
    [roleOptions],
  );

  if (!isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name || `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
      sortValue: (row) => row.name,
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email,
      sortValue: (row) => row.email,
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.role.replace(/_/g, " ")}
        </Badge>
      ),
      sortValue: (row) => row.role,
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
                setEditingUser(row);
                setFormOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={row.is_self}
              aria-label={
                row.is_self
                  ? "Cannot remove your own account"
                  : `Remove ${row.name}`
              }
              onClick={() => {
                if (!row.is_self) setDeleteTarget(row);
              }}
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
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    role: string;
  }) => {
    if (editingUser) {
      const body = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };
      await updateMutation.mutateAsync({ userId: editingUser.id, body });
    } else {
      await createMutation.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password!,
        role: values.role,
      });
    }
    setFormOpen(false);
    setEditingUser(null);
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
        title="Users"
        description="Manage platform users, roles, and access."
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={
          isError
            ? getApiErrorMessage(error, "Unable to load users. Please try again.")
            : null
        }
        onRetry={() => void refetch()}
        searchPlaceholder="Search users…"
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filterLabel="Role"
        filterOptions={filterOptions}
        filterValue={roleFilter}
        onFilterChange={(value) => {
          const next = new URLSearchParams(searchParams);
          if (value === "all") {
            next.delete("role");
          } else {
            next.set("role", value);
          }
          setSearchParams(next, { replace: true });
          setPage(1);
        }}
        serverSide
        emptyTitle="No users found"
        emptyDescription="Add a user or adjust your filters."
        emptyAction={
          <Button
            className="min-h-11"
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Button>
        }
        primaryAction={
          <Button
            className="min-h-11"
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add user
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

      <UserForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
        roleOptions={roleOptions}
        isLoading={isFormLoading}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove user?"
        description={`This will permanently remove "${deleteTarget?.name}" from the platform. This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
