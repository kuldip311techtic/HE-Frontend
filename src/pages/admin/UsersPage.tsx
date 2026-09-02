import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  UserFormDialog,
  type UserFormValues,
} from "@/components/admin/UserFormDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSuperAdminUserMutations,
  useSuperAdminUsers,
} from "@/hooks/useSuperAdminUsers";
import {
  adminPrimaryActionClass,
  adminSearchInputClass,
  adminToolbarSelectClass,
} from "@/lib/adminFormStyles";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AdminUserItem } from "@/types/api";
import { cn } from "@/lib/utils";

type RoleFilter = "all" | string;

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserItem | null>(null);

  const { createMutation, updateMutation, deleteMutation } =
    useSuperAdminUserMutations();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  const { data, isLoading, error, refetch } = useSuperAdminUsers({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const roleOptions = data?.roles ?? [];

  const columns: DataTableColumn<AdminUserItem>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-white">
          {row.name}
        </span>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-white">
          {row.email}
        </span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <Badge
          variant="secondary"
          className={cn(
            "rounded-[10px] border-figma-border bg-[#1bc94f1a] px-[10px] py-[2px]",
            "font-outfit text-[14px] font-medium capitalize leading-[17.64px] text-figma-bright",
          )}
        >
          {row.role.replace(/_/g, " ")}
        </Badge>
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
                setEditingUser(row);
                setDialogOpen(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[#ff6b6b] focus:bg-[#ff414114] focus:text-[#ff6b6b] disabled:opacity-50"
              disabled={row.is_self}
              title={row.is_self ? "Cannot remove your own account" : undefined}
              aria-disabled={row.is_self}
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

  const handleCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleSubmit = (values: UserFormValues) => {
    if (editingUser) {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };
      updateMutation.mutate(
        { id: editingUser.id, data: payload },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingUser(null);
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password ?? "",
          role: values.role,
        },
        {
          onSuccess: () => setDialogOpen(false),
        },
      );
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const toolbarFilters = (
    <Select
      value={roleFilter}
      onValueChange={(value) => setRoleFilter(value as RoleFilter)}
    >
      <SelectTrigger
        className={cn(adminToolbarSelectClass, "w-full sm:w-[160px]")}
        aria-label="Filter by role"
      >
        <SelectValue placeholder="All roles" />
      </SelectTrigger>
      <SelectContent className="border-figma-border bg-figma-surface font-outfit">
        <SelectItem value="all">All roles</SelectItem>
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Users"
        description="Manage coaches and players across the platform."
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
            Add user
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        onRetry={() => void refetch()}
        searchPlaceholder="Search users…"
        searchValue={search}
        onSearchChange={setSearch}
        searchInputClassName={adminSearchInputClass}
        toolbarFilters={toolbarFilters}
        serverPagination
        emptyTitle="No users yet"
        emptyDescription="Users will appear here once accounts are created."
        emptyAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add user
          </Button>
        }
        primaryAction={
          <Button
            size="sm"
            onClick={handleCreate}
            className={adminPrimaryActionClass}
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
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

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
        roleOptions={roleOptions}
        isLoading={isSaving}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remove user?"
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
