import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Select } from '@/components/ui/select';
import { applyApiFieldErrors, getApiErrorCode, getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import type { AdminUserItem, RoleOption } from '@/types/user';
import type { UserRole } from '@/types/auth';

const ROLE_FALLBACK: RoleOption[] = [
  { value: 'super_admin', label: 'Super Admin', description: '' },
  { value: 'org_admin', label: 'Organization Admin', description: '' },
  { value: 'coach', label: 'Coach', description: '' },
  { value: 'player', label: 'Player', description: '' },
];

function userFormSchema(requirePassword: boolean) {
  return z
    .object({
      first_name: z.string().min(1, 'First name is required.'),
      last_name: z.string().min(1, 'Last name is required.'),
      email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
      password: requirePassword
        ? z.string().min(1, 'Password is required.').min(8, 'Password must be at least 8 characters.')
        : z.string(),
      role: z.enum(['super_admin', 'org_admin', 'coach', 'player']),
    })
    .superRefine((values, ctx) => {
      if (!requirePassword && values.password.length > 0 && values.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message: 'Password must be at least 8 characters.',
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof userFormSchema>>;

function isDuplicateEmailError(error: unknown): boolean {
  const code = getApiErrorCode(error);
  if (code && /email|duplicate|already.?exists/i.test(code)) return true;
  if (axios.isAxiosError(error) && error.response?.status === 409) return true;
  const message = getApiErrorMessage(error, '');
  return /email.*already|already.*email|duplicate/i.test(message);
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUserItem | null;
  roles?: RoleOption[];
  requirePassword: boolean;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roles,
  requirePassword,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const roleOptions = roles && roles.length > 0 ? roles : ROLE_FALLBACK;

  const form = useForm<FormValues>({
    resolver: (values, context, options) =>
      zodResolver(userFormSchema(requirePassword))(values, context, options),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'org_admin',
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user?.role ?? 'org_admin',
    });
  }, [open, user, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (user) {
        const payload = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role as UserRole,
          ...(values.password ? { password: values.password } : {}),
        };
        const response = await updateMutation.mutateAsync({ userId: user.id, payload });
        toast.success(response.message || 'User updated successfully.');
      } else {
        const response = await createMutation.mutateAsync({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: values.role as UserRole,
        });
        toast.success(response.message || 'User created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      const applied = applyApiFieldErrors(error, form.setError);
      if (applied) return;
      if (isDuplicateEmailError(error)) {
        form.setError('email', {
          message: getApiErrorMessage(error, 'This email is already in use.'),
        });
        return;
      }
      form.setError('root', {
        message: getApiErrorMessage(error, 'Unable to save the user. Please try again.'),
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit User' : 'Add User'}
      description={
        isEdit
          ? 'Update user details. Leave password blank to keep the current password.'
          : 'Create a user with a role from the Super Admin catalog.'
      }
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="user-form"
            variant="brand"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id="user-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="given-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="family-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isEdit ? 'Password (optional)' : 'Password'}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    key={user?.id ?? 'new-user'}
                    autoComplete={isEdit ? 'new-password' : 'new-password'}
                    placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter a password'}
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
                <FormControl>
                  <Select {...field}>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ? (
            <ErrorMessage message={form.formState.errors.root.message} />
          ) : null}
        </form>
      </Form>
    </Dialog>
  );
}
