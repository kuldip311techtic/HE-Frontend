import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { AdminUserItem, RoleOption, UserRole } from '@/types/api';
import { formatUserRole } from '@/lib/format';

const USER_ROLES: UserRole[] = ['super_admin', 'org_admin', 'coach', 'player'];

function userFormSchema(requirePassword: boolean) {
  return z
    .object({
      first_name: z.string().min(1, 'First Name is required.'),
      last_name: z.string().min(1, 'Last Name is required.'),
      email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
      password: z.string(),
      role: z.enum(['super_admin', 'org_admin', 'coach', 'player'], {
        required_error: 'Role is required.',
      }),
    })
    .superRefine((values, ctx) => {
      if (requirePassword && !values.password.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message: 'Password is required.',
        });
      }
    });
}

export type UserFormValues = z.infer<ReturnType<typeof userFormSchema>>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUserItem | null;
  roles: RoleOption[];
  isSubmitting: boolean;
  error: string | null;
  fieldErrors?: Record<string, string>;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roles,
  isSubmitting,
  error,
  fieldErrors = {},
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const form = useForm<UserFormValues>({
    resolver: (values, context, options) =>
      zodResolver(userFormSchema(!user))(values, context, options),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'coach',
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'coach',
    });
  }, [open, user, form]);

  useEffect(() => {
    if (!open) return;
    Object.entries(fieldErrors).forEach(([key, message]) => {
      if (
        key === 'first_name' ||
        key === 'last_name' ||
        key === 'email' ||
        key === 'password' ||
        key === 'role'
      ) {
        form.setError(key, { message });
      }
    });
  }, [fieldErrors, open, form]);

  const roleOptions =
    roles.length > 0
      ? roles.map((role) => ({
          value: role.value,
          label: role.label || formatUserRole(role.value),
        }))
      : USER_ROLES.map((role) => ({ value: role, label: formatUserRole(role) }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this user’s profile and role.' : 'Create a new user account.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" autoComplete="given-name" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" autoComplete="family-name" {...field} />
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
                    <Input type="email" autoComplete="email" placeholder="Email" {...field} />
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
                  <FormLabel>{isEdit ? 'Password (Optional)' : 'Password'}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder={isEdit ? 'Leave Blank To Keep Current Password' : 'Password'}
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
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <NativeSelect
                      ref={field.ref}
                      aria-label="Role"
                      options={roleOptions}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? <ErrorMessage message={error} /> : null}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
