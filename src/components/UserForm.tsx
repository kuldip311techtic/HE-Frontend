import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
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
import type { SuperAdminUser, UserRoleOption } from '@/types/users'
import { ApiError } from '@/types/api'

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  role: z.string().min(1, 'Role is required'),
})

const createSchema = baseSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
})

const editSchema = baseSchema.extend({
  password: z
    .string()
    .max(72, 'Password must be at most 72 characters')
    .optional()
    .or(z.literal('')),
})

type CreateFormValues = z.infer<typeof createSchema>
type EditFormValues = z.infer<typeof editSchema>

interface UserFormProps {
  mode: 'create' | 'edit'
  user?: SuperAdminUser
  roleOptions: UserRoleOption[]
  onSubmit: (values: CreateFormValues | EditFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  serverError?: ApiError | null
}

const DEFAULT_ROLE_OPTIONS: UserRoleOption[] = [
  { value: 'coach', label: 'Coach', description: 'Coach account' },
  { value: 'player', label: 'Player', description: 'Player account' },
]

export function UserForm({
  mode,
  user,
  roleOptions,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: UserFormProps) {
  const schema = mode === 'create' ? createSchema : editSchema
  const options =
    roleOptions.length > 0 ? roleOptions : DEFAULT_ROLE_OPTIONS

  const form = useForm<CreateFormValues | EditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user ? getInitialName(user) : '',
      email: user?.email ?? '',
      role: user?.role ?? options[0]?.value ?? 'coach',
      password: '',
    },
  })

  useEffect(() => {
    if (serverError instanceof ApiError) {
      const emailDetail = serverError.details?.find(
        (detail) => detail.field === 'email',
      )
      if (emailDetail) {
        form.setError('email', { message: emailDetail.message })
      }
    }
  }, [serverError, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

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
                  {...field}
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-required="true"
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
                  {...field}
                  type="email"
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger aria-label="Select user role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {mode === 'create' ? 'Password' : 'New Password (optional)'}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder={
                    mode === 'create' ? 'Enter password' : 'Leave blank to keep'
                  }
                  autoComplete={mode === 'create' ? 'new-password' : 'off'}
                  aria-required={mode === 'create' ? 'true' : 'false'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <LoadingSpinner size="sm" />
                Saving…
              </>
            ) : mode === 'create' ? (
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

function getInitialName(user: SuperAdminUser): string {
  if (user.name?.trim()) {
    return user.name.trim()
  }
  return [user.first_name, user.last_name].filter(Boolean).join(' ')
}
