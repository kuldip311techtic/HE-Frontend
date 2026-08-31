import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApiClientError } from '@/services/api-client';
import { getFieldError } from '@/hooks/useUsers';
import { splitFullName } from '@/lib/utils';
import type { SuperAdminUserRecord, UserRoleOption } from '@/types';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.string().min(1, 'Role is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.string().min(1, 'Role is required'),
  password: z
    .string()
    .max(72, 'Password must be at most 72 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type EditUserFormValues = z.infer<typeof editUserSchema>;

interface UserFormProps {
  mode: 'create' | 'edit';
  roles: UserRoleOption[];
  initialUser?: SuperAdminUserRecord;
  onSubmit: (values: CreateUserFormValues | EditUserFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: unknown;
}

export function UserForm({
  mode,
  roles,
  initialUser,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError,
}: UserFormProps) {
  const schema = mode === 'create' ? createUserSchema : editUserSchema;

  const form = useForm<CreateUserFormValues | EditUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialUser?.name ?? '',
      email: initialUser?.email ?? '',
      role: initialUser?.role ?? roles[0]?.value ?? '',
      password: '',
    },
  });

  useEffect(() => {
    if (initialUser) {
      form.reset({
        name: initialUser.name,
        email: initialUser.email,
        role: initialUser.role,
        password: '',
      });
    }
  }, [initialUser, form]);

  useEffect(() => {
    if (submitError instanceof ApiClientError) {
      const emailError = getFieldError(submitError, 'email');
      if (emailError) {
        form.setError('email', { message: emailError });
      }
      submitError.details?.forEach((detail) => {
        if (detail.field === 'name') {
          form.setError('name', { message: detail.message });
        }
        if (detail.field === 'role') {
          form.setError('role', { message: detail.message });
        }
        if (detail.field === 'password') {
          form.setError('password', { message: detail.message });
        }
      });
    }
  }, [submitError, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="user-name">Name</FormLabel>
              <FormControl>
                <Input
                  id="user-name"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-label="Full name"
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
              <FormLabel htmlFor="user-email">Email</FormLabel>
              <FormControl>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  aria-label="Email address"
                  {...field}
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
              <FormLabel htmlFor="user-role">Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger id="user-role" aria-label="User role">
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
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'create' ? (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="user-password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    aria-label="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="user-password-edit">New password (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="user-password-edit"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    autoComplete="new-password"
                    aria-label="New password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                {mode === 'create' ? 'Adding user…' : 'Saving changes…'}
              </>
            ) : mode === 'create' ? (
              'Add user'
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function mapCreateFormToRequest(values: CreateUserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  return {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  };
}

export function mapEditFormToRequest(values: EditUserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  const payload: {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    role: string;
    password?: string;
  } = {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    role: values.role,
  };

  if (values.password && values.password.trim().length > 0) {
    payload.password = values.password;
  }

  return payload;
}
