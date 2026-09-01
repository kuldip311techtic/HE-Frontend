import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PageHeader } from '@/components/PageHeader'
import { UserForm } from '@/components/UserForm'
import { UserList } from '@/components/UserList'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
  type SuperAdminUser,
} from '@/hooks/useUsers'
import { getDisplayName, buildCreatePayload, buildUpdatePayload } from '@/lib/user-helpers'
import { ApiError } from '@/types/api'
import type { PaginationMeta } from '@/types/api'

export const Route = createFileRoute('/super-admin/_authenticated/manage-users')({
  component: ManageUsersPage,
})

const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
}

function ManageUsersPage() {
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SuperAdminUser | null>(null)
  const [formError, setFormError] = useState<ApiError | null>(null)

  const { data, isLoading, isError, refetch } = useUsers(page)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const users = data?.items ?? []
  const pagination = data?.pagination ?? EMPTY_PAGINATION
  const roleOptions = data?.roles ?? []

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedUser(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEditForm = (user: SuperAdminUser) => {
    setFormMode('edit')
    setSelectedUser(user)
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setSelectedUser(null)
    setFormError(null)
  }

  const handleFormSubmit = async (
    values: {
      name: string
      email: string
      role: string
      password?: string
    },
  ) => {
    setFormError(null)
    try {
      if (formMode === 'create') {
        await createUserMutation.mutateAsync(
          buildCreatePayload({
            ...values,
            password: values.password ?? '',
          }),
        )
      } else if (selectedUser) {
        await updateUserMutation.mutateAsync({
          userId: selectedUser.id,
          data: buildUpdatePayload({
            ...values,
            password: values.password ?? '',
          }),
        })
      }
      closeForm()
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error)
      }
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteUserMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      // toast handled in mutation
    }
  }

  const isFormSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending

  return (
    <div>
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts."
        action={
          <Button type="button" onClick={openCreateForm} aria-label="Add new user">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add User
          </Button>
        }
      />

      <UserList
        users={users}
        pagination={pagination}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        onPageChange={setPage}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      <Dialog open={formOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Add New User' : 'Edit User'}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            mode={formMode}
            user={selectedUser ?? undefined}
            roleOptions={roleOptions}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            isSubmitting={isFormSubmitting}
            serverError={formError}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove user"
        description={
          deleteTarget
            ? `Are you sure you want to remove ${getDisplayName(deleteTarget)}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={() => void handleDeleteConfirm()}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  )
}
