import {
  toCreateUserPayload,
  UserForm,
  type CreateUserFormValues,
} from '@/components/UserForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateUser } from '@/hooks/useCreateUser'
import type { UserRoleOption } from '@/types/super-admin'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleOptions?: UserRoleOption[]
}

export function CreateUserDialog({
  open,
  onOpenChange,
  roleOptions,
}: CreateUserDialogProps) {
  const createMutation = useCreateUser()

  const handleCreate = (values: CreateUserFormValues) => {
    createMutation.mutate(toCreateUserPayload(values), {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription>
            Create a coach or player account for the Hoops Engine application.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          mode="create"
          roleOptions={roleOptions}
          loading={createMutation.isPending}
          error={createMutation.error}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleCreate}
        />
      </DialogContent>
    </Dialog>
  )
}
