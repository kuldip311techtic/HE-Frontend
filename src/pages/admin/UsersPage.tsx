import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserForm } from "@/components/features/super-admin/UserForm";
import type { UserFormValues } from "@/components/features/super-admin/UserForm";
import { Badge } from "@/components/ui/badge";
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
  useCreateSuperAdminUser,
  useDeleteSuperAdminUser,
  useSuperAdminUsers,
  useUpdateSuperAdminUser,
} from "@/hooks/useSuperAdminUsers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AdminUser } from "@/types/api";

const FORM_ID = "user-form";

function resolveRoleFilter(role: string | null): string {
  if (role === "coach" || role === "player") return role;
  return "all";
}

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(() =>
    resolveRoleFilter(searchParams.get("role")),
  );
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    setRoleFilter(resolveRoleFilter(searchParams.get("role")));
    setPage(1);
  }, [searchParams]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const { data, isLoading, isError, error, refetch } = useSuperAdminUsers({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const createMutation = useCreateSuperAdminUser();
  const updateMutation = useUpdateSuperAdminUser();
  const deleteMutation = useDeleteSuperAdminUser();

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const roleOptions = useMemo(
    () =>
      data?.roles?.length
        ? data.roles
        : [
            { value: "coach", label: "Coach" },
            { value: "player", label: "Player" },
          ],
    [data?.roles],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize, roleFilter]);

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "all") {
          next.delete("role");
        } else {
          next.set("role", value);
        }
        return next;
      },
      { replace: true },
    );
  };

  const openCreate = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (dialogMode === "create") {
        const result = await createMutation.mutateAsync(values);
        toast.success(result.message || "User created successfully.");
      } else if (selectedUser) {
        const payload = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role,
          ...(values.password ? { password: values.password } : {}),
        };
        const result = await updateMutation.mutateAsync({
          user_id: selectedUser.id,
          data: payload,
        });
        toast.success(result.message || "Changes saved successfully.");
      }
      setDialogOpen(false);
    } catch (err) {
      const isDuplicateEmail =
        axios.isAxiosError(err) && err.response?.status === 409;
      const message = isDuplicateEmail
        ? getApiErrorMessage(
            err,
            "An account with this email already exists.",
          )
        : getApiErrorMessage(err, "Unable to save user. Please try again.");
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const result = await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(result.message || "User deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to delete user. Please try again."),
      );
    }
  };

  const columns: DataTableColumn<AdminUser>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name || `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
      sortable: true,
      sortValue: (row) =>
        row.name || `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email,
      sortable: true,
      sortValue: (row) => row.email,
    },
    {
      id: "role",
      header: "Role",
      sortable: true,
      sortValue: (row) => row.role,
      cell: (row) => (
        <Badge variant="secondary" className="capitalize">
          {row.role.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.is_active,
      cell: (row) => (
        <Badge variant={row.is_active ? "default" : "outline"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
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
              aria-label={`Actions for ${row.name || row.email}`}
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
              disabled={row.is_self}
              aria-disabled={row.is_self}
              title={
                row.is_self
                  ? "You cannot delete your own account."
                  : undefined
              }
              onClick={() => !row.is_self && setDeleteTarget(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts across the Hoops Engine platform."
        action={
          <Button onClick={openCreate} className="min-h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add user
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
            ? getApiErrorMessage(error, "Unable to load users. Please try again.")
            : null
        }
        onRetry={() => void refetch()}
        searchPlaceholder="Search users…"
        searchValue={search}
        onSearchChange={setSearch}
        filterLabel="Role"
        filterOptions={[
          { label: "Coach", value: "coach" },
          { label: "Player", value: "player" },
        ]}
        filterValue={roleFilter}
        onFilterChange={handleRoleFilterChange}
        serverSide
        emptyTitle="No users found"
        emptyDescription="Add a user or adjust your search filters."
        emptyAction={
          <Button onClick={openCreate}>
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
        onPageSizeChange={setPageSize}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Add user" : "Edit user"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Enter user details to create a new account."
                : "Update user details. Password is optional on edit."}
            </DialogDescription>
          </DialogHeader>

          <UserForm
            key={dialogMode === "create" ? "create" : selectedUser?.id}
            mode={dialogMode}
            user={selectedUser}
            roleOptions={roleOptions}
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
        title="Delete user?"
        description={`This will permanently delete the account for "${deleteTarget?.email}". This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
