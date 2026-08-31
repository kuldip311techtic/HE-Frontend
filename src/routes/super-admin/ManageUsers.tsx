import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/Button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { PageHeader } from '@/components/PageHeader'
import { getApiErrorMessage, UserForm } from '@/components/UserForm'
import { UserList } from '@/components/UserList'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUsers } from '@/hooks/useUsers'
import { formatUserName } from '@/lib/user-utils'
import type { User } from '@/types/api'

export default function ManageUsers() {
  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    users,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    createUser,
    isCreating,
    updateUser,
    isUpdating,
    deleteUser,
    isDeleting,
  } = useUsers(page)

  const handleCreateOpen = () => {
    setFormError(null)
    setIsCreateOpen(true)
  }

  const handleEditOpen = (user: User) => {
    setFormError(null)
    setEditingUser(user)
  }

  const handleCreateSubmit = async (values: {
    first_name: string
    last_name: string
    email: string
    role: string
    password?: string
  }) => {
    setFormError(null)
    try {
      await createUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password ?? '',
        role: values.role,
      })
      toast.success('User added successfully')
      setIsCreateOpen(false)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
      throw err
    }
  }

  const handleEditSubmit = async (values: {
    first_name: string
    last_name: string
    email: string
    role: string
  }) => {
    if (!editingUser) return

    setFormError(null)
    try {
      await updateUser({
        id: editingUser.id,
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role,
        },
      })
      toast.success('User updated successfully')
      setEditingUser(null)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
      throw err
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return

    try {
      await deleteUser(deletingUser.id)
      toast.success('User removed successfully')
      setDeletingUser(null)

      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1)
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts."
        action={
          <Button onClick={handleCreateOpen} className="min-h-11 w-full sm:w-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add User
          </Button>
        }
      />

      <UserList
        users={users}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        onEdit={handleEditOpen}
        onDelete={setDeletingUser}
        onAddUser={handleCreateOpen}
      />

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new coach or player account.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            mode="create"
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
            isSubmitting={isCreating}
            serverError={formError}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update account details for{' '}
              {editingUser ? formatUserName(editingUser) : 'this user'}.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              key={editingUser.id}
              mode="edit"
              initialUser={editingUser}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingUser(null)}
              isSubmitting={isUpdating}
              serverError={formError}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingUser !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null)
        }}
        title="Remove User"
        description={
          deletingUser
            ? `Are you sure you want to remove ${formatUserName(deletingUser)}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
