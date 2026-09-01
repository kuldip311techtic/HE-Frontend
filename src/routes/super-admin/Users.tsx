import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PageHeader } from "@/components/PageHeader";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import {
  UserForm,
  buildCreateUserPayload,
  buildUpdateUserPayload,
  type UserFormValues,
} from "@/components/UserForm";
import { UserList } from "@/components/UserList";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";
import { ApiClientError } from "@/services/api-client";
import { getAuthToken } from "@/services/api-client";
import type { SuperAdminUser } from "@/types/super-admin";

export default function UsersPage() {
  const navigate = useNavigate();
  const {
    users,
    pagination,
    roles,
    isLoading,
    error,
    page,
    setPage,
    refetch,
    create,
    update,
    remove,
    isMutating,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<SuperAdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SuperAdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole =
        roleFilter === "all" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = pagination?.total_pages ?? Math.max(1, page);
  const hasServerPagination = pagination !== null;

  useEffect(() => {
    if (!hasServerPagination) return;
    setPage(1);
  }, [search, roleFilter, hasServerPagination, setPage]);

  const openCreate = () => {
    setFormMode("create");
    setSelected(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (user: SuperAdminUser) => {
    setFormMode("edit");
    setSelected(user);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    setFormError(null);
    try {
      if (formMode === "create") {
        await create(buildCreateUserPayload(values));
        toast.success("User added successfully.");
      } else if (selected) {
        await update(selected.id, buildUpdateUserPayload(values));
        toast.success("User updated successfully.");
      }
      setFormOpen(false);
      setSelected(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save user.";
      setFormError(message);
      if (
        !message.toLowerCase().includes("email") &&
        !message.toLowerCase().includes("duplicate")
      ) {
        toast.error(message);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("User removed successfully.");
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to remove user.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmpty =
    !error && !isLoading && filtered.length === 0 && !search && roleFilter === "all";

  const showNoResults =
    !error && !isLoading && filtered.length === 0 && (search || roleFilter !== "all");

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts"
        action={
          <Button onClick={openCreate} aria-label="Add new user">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add User
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              className="w-full sm:w-[160px]"
              aria-label="Filter by role"
            >
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={openCreate}
          className="sm:hidden"
          aria-label="Add new user"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add User
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
          title="No users"
          description="Get started by adding your first coach or player account."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add User
            </Button>
          }
        />
      ) : showNoResults ? (
        <EmptyState
          title="No matching users"
          description="No users match your search or filter. Try adjusting your criteria."
        />
      ) : (
        <>
          <UserList
            users={filtered}
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
              {formMode === "create" ? "Add New User" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Enter the user details to create a new account."
                : "Update the user details below."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            mode={formMode}
            initialData={selected ?? undefined}
            roleOptions={roles}
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
        title="Remove user"
        description={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </SuperAdminLayout>
  );
}
