import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { AdminLayout } from "@/components/AdminLayout";
import { UserList } from "@/components/ManageUsers/UserList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/ManageUsers/UserForm";
import { useAddUser } from "@/hooks/ManageUsers/useAddUser";
import { useUsers } from "@/hooks/ManageUsers/useUsers";
import type { UserFormValues, UserRoleOption } from "@/types/users";
import { ApiClientError } from "@/types/api";

export const Route = createFileRoute("/super-admin/manage-users")({
  component: ManageUsersPage,
});

const DEFAULT_ROLES: UserRoleOption[] = [
  { value: "coach", label: "Coach", description: "Coach role" },
  { value: "player", label: "Player", description: "Player role" },
];

function ManageUsersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [formError, setFormError] = useState<ApiClientError | null>(null);
  const { data } = useUsers();
  const addUser = useAddUser();

  const roles = data?.roles?.length ? data.roles : DEFAULT_ROLES;

  const handleCreate = (values: UserFormValues) => {
    setFormError(null);
    addUser.mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: values.role,
        org_id: values.org_id || null,
      },
      {
        onSuccess: () => setCreateOpen(false),
        onError: (err) => {
          if (err instanceof ApiClientError) setFormError(err);
        },
      }
    );
  };

  return (
    <AdminLayout activePath="/super-admin/manage-users">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <PageHeader
          title="Manage Users"
          description="Create, edit, and remove user accounts across the platform."
          action={
            <Button
              onClick={() => {
                setFormError(null);
                setCreateOpen(true);
              }}
              className="min-h-[44px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add user
            </Button>
          }
        />

        <div className="mt-6">
          <UserList onAddUser={() => setCreateOpen(true)} />
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
          </DialogHeader>
          <UserForm
            mode="create"
            roles={roles}
            loading={addUser.isPending}
            serverError={formError}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
