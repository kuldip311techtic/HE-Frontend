import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ErrorMessage } from '@/components/ErrorMessage'
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
import { ApiError } from '@/services/api-client'
import type { SuperAdminUser, UserRoleOption } from '@/types/super-admin'
import { DEFAULT_USER_ROLES, formatDisplayName, splitFullName } from '@/lib/utils'

const baseUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  role: z.string().min(1, 'Role is required'),
})

const createUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
})

const editUserSchema = baseUserSchema.extend({
  password: z
    .string()
    .max(72, 'Password must be at most 72 characters')
    .optional()
    .or(z.literal('')),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>
type EditUserFormValues = z.infer<typeof editUserSchema>

interface UserFormBaseProps {
  mode: 'create' | 'edit'
  roleOptions?: UserRoleOption[]
  loading?: boolean
  error?: unknown
  onCancel?: () => void
}

interface CreateUserFormProps extends UserFormBaseProps {
  mode: 'create'
  defaultValues?: Partial<CreateUserFormValues>
  onSubmit: (values: CreateUserFormValues) => void
}

interface EditUserFormProps extends UserFormBaseProps {
  mode: 'edit'
  user?: SuperAdminUser
  defaultValues?: Partial<EditUserFormValues>
  onSubmit: (values: EditUserFormValues) => void
}

type UserFormProps = CreateUserFormProps | EditUserFormProps

function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {}
  return error.details.reduce<Record<string, string>>((acc, detail) => {
    acc[detail.field] = detail.message
    return acc
  }, {})
}

function getApiErrorMessage(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null
  if (error.details.length > 0) return null
  return error.message
}

export function UserForm(props: UserFormProps) {
  const {
    mode,
    roleOptions,
    loading = false,
    error,
    onCancel,
    onSubmit,
  } = props

  const roles =
    roleOptions && roleOptions.length > 0
      ? roleOptions
      : [...DEFAULT_USER_ROLES]

  const defaultName =
    props.mode === 'edit' && props.user
      ? formatDisplayName(
          props.user.first_name,
          props.user.last_name,
          props.user.name,
        )
      : ''

  const form = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : editUserSchema),
    defaultValues:
      mode === 'create'
        ? {
            name: '',
            email: '',
            role: roles[0]?.value ?? 'coach',
            password: '',
            ...props.defaultValues,
          }
        : {
            name: defaultName,
            email: props.user?.email ?? '',
            role: props.user?.role ?? roles[0]?.value ?? 'coach',
            password: '',
            ...props.defaultValues,
          },
  })

  useEffect(() => {
    if (mode === 'edit' && 'user' in props && props.user) {
      form.reset({
        name: formatDisplayName(
          props.user.first_name,
          props.user.last_name,
          props.user.name,
        ),
        email: props.user.email,
        role: props.user.role,
        password: '',
      })
    }
  }, [form, mode, props])

  const fieldErrors = getApiFieldErrors(error)
  const generalError = getApiErrorMessage(error)

  const handleSubmit = (values: CreateUserFormValues | EditUserFormValues) => {
    if (mode === 'create') {
      ;(onSubmit as CreateUserFormProps['onSubmit'])(
        values as CreateUserFormValues,
      )
    } else {
      ;(onSubmit as EditUserFormProps['onSubmit'])(
        values as EditUserFormValues,
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        noValidate
        aria-label={mode === 'create' ? 'Add user form' : 'Edit user form'}
      >
        {generalError && <ErrorMessage message={generalError} />}

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
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {fieldErrors.name || fieldErrors.first_name || fieldErrors.last_name}
              </FormMessage>
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
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage>{fieldErrors.email}</FormMessage>
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
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger aria-label="User role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{fieldErrors.role}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {mode === 'create' ? 'Password' : 'New password (optional)'}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    mode === 'create'
                      ? 'Enter a password'
                      : 'Leave blank to keep current password'
                  }
                  autoComplete={mode === 'create' ? 'new-password' : 'off'}
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage>{fieldErrors.password}</FormMessage>
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading} className="min-h-[44px]">
            {mode === 'create' ? 'Add user' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function toCreateUserPayload(values: CreateUserFormValues) {
  const { first_name, last_name } = splitFullName(values.name)
  return {
    first_name,
    last_name,
    email: values.email,
    password: values.password,
    role: values.role,
  }
}

export function toUpdateUserPayload(values: EditUserFormValues) {
  const { first_name, last_name } = splitFullName(values.name)
  const payload: {
    first_name: string
    last_name: string
    email: string
    role: string
    password?: string
  } = {
    first_name,
    last_name,
    email: values.email,
    role: values.role,
  }

  if (values.password && values.password.length > 0) {
    payload.password = values.password
  }

  return payload
}

export type { CreateUserFormValues, EditUserFormValues }
