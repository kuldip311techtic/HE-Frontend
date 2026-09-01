import {
  toUpdateUserPayload,
  UserForm,
  type EditUserFormValues,
} from '@/components/UserForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateUser } from '@/hooks/useUpdateUser'
import { formatDisplayName } from '@/lib/utils'
import type { SuperAdminUser, UserRoleOption } from '@/types/super-admin'

interface EditUserDialogProps {
  user: SuperAdminUser | null
  onOpenChange: (open: boolean) => void
  roleOptions?: UserRoleOption[]
}

export function EditUserDialog({
  user,
  onOpenChange,
  roleOptions,
}: EditUserDialogProps) {
  const updateMutation = useUpdateUser()

  const handleUpdate = (values: EditUserFormValues) => {
    if (!user) return
    updateMutation.mutate(
      { userId: user.id, payload: toUpdateUserPayload(values) },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update account details for{' '}
            {user
              ? formatDisplayName(user.first_name, user.last_name, user.name)
              : 'this user'}
            .
          </DialogDescription>
        </DialogHeader>
        {user && (
          <UserForm
            mode="edit"
            user={user}
            roleOptions={roleOptions}
            loading={updateMutation.isPending}
            error={updateMutation.error}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleUpdate}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
