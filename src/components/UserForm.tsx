import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  formatUserName,
  isDuplicateEmailError,
  splitFullName,
  USER_ROLES,
  type UserRole,
} from '@/lib/user-utils'
import { ApiError, type User } from '@/types/api'

const baseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(USER_ROLES, {
    required_error: 'Please select a role',
  }),
})

const createUserSchema = baseSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const editUserSchema = baseSchema

type CreateFormValues = z.infer<typeof createUserSchema>
type EditFormValues = z.infer<typeof editUserSchema>

interface UserFormProps {
  mode: 'create' | 'edit'
  initialUser?: User
  onSubmit: (values: {
    first_name: string
    last_name: string
    email: string
    role: UserRole
    password?: string
  }) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  serverError?: string | null
}

export function UserForm({
  mode,
  initialUser,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: UserFormProps) {
  const isCreate = mode === 'create'

  const form = useForm<CreateFormValues | EditFormValues>({
    resolver: zodResolver(isCreate ? createUserSchema : editUserSchema),
    defaultValues: {
      name: initialUser ? formatUserName(initialUser) : '',
      email: initialUser?.email ?? '',
      role: (initialUser?.role?.toLowerCase() as UserRole) ?? undefined,
      ...(isCreate ? { password: '' } : {}),
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const { first_name, last_name } = splitFullName(values.name)
    await onSubmit({
      first_name,
      last_name,
      email: values.email.trim(),
      role: values.role,
      ...(isCreate && 'password' in values
        ? { password: values.password as string }
        : {}),
    })
  })

  const displayError =
    serverError ??
    (form.formState.errors.root?.message as string | undefined) ??
    null

  const duplicateEmailError =
    displayError && isDuplicateEmailError(displayError) ? displayError : null

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {duplicateEmailError && (
                <p className="text-sm text-destructive" role="alert">
                  {duplicateEmailError}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger aria-label="User role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCreate && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter a password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {displayError && !duplicateEmailError && (
          <ErrorMessage message={displayError} />
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {isCreate ? 'Adding…' : 'Saving…'}
              </>
            ) : isCreate ? (
              'Add User'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}
