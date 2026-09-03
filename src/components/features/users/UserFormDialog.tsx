import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { filterCreateRoleOptions } from '@/lib/api/users';
import type { AdminUserItem, AdminUserRole, RoleOption } from '@/types/api';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

const createUserFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  last_name: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(
      passwordPattern,
      'Password must include uppercase, lowercase, number, and special character.',
    ),
  role: z.enum(['coach', 'player'], {
    errorMap: () => ({ message: 'Please select a role.' }),
  }),
});

const editUserFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  last_name: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .optional()
    .refine((value) => !value || passwordPattern.test(value), {
      message: 'Password must include uppercase, lowercase, number, and special character.',
    }),
  role: z.enum(['coach', 'player'], {
    errorMap: () => ({ message: 'Please select a role.' }),
  }),
});

export type UserFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: AdminUserRole;
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUserItem | null;
  roleOptions: RoleOption[];
  onSubmit: (values: UserFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  fieldErrors?: Record<string, string>;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roleOptions,
  onSubmit,
  isSubmitting = false,
  submitError,
  fieldErrors = {},
}: UserFormDialogProps) {
  const isEditMode = Boolean(user);
  const formRoleOptions = filterCreateRoleOptions(roleOptions);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? editUserFormSchema : createUserFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'coach',
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (user) {
      form.reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        password: '',
        role: (user.role === 'coach' || user.role === 'player' ? user.role : 'coach') as
          | 'coach'
          | 'player',
      });
    } else {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'coach',
      });
    }
  }, [open, user, form]);

  useEffect(() => {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (field in form.getValues()) {
        form.setError(field as keyof UserFormValues, { message });
      }
    });
  }, [fieldErrors, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const firstNameError = form.formState.errors.first_name?.message;
  const lastNameError = form.formState.errors.last_name?.message;
  const emailError = form.formState.errors.email?.message ?? fieldErrors.email;
  const passwordError = form.formState.errors.password?.message ?? fieldErrors.password;
  const roleError = form.formState.errors.role?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit user' : 'Add user'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update account details. Leave password blank to keep the current password.'
              : 'Create a coach or player account with login credentials.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-first-name">First name</Label>
              <Input
                id="user-first-name"
                autoComplete="given-name"
                aria-invalid={Boolean(firstNameError)}
                {...form.register('first_name')}
              />
              {firstNameError ? (
                <p className="text-body-sm text-destructive" role="alert">
                  {firstNameError}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-last-name">Last name</Label>
              <Input
                id="user-last-name"
                autoComplete="family-name"
                aria-invalid={Boolean(lastNameError)}
                {...form.register('last_name')}
              />
              {lastNameError ? (
                <p className="text-body-sm text-destructive" role="alert">
                  {lastNameError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              {...form.register('email')}
            />
            {emailError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password">
              {isEditMode ? 'New password (optional)' : 'Password'}
            </Label>
            <Input
              id="user-password"
              type="password"
              autoComplete={isEditMode ? 'new-password' : 'new-password'}
              aria-invalid={Boolean(passwordError)}
              {...form.register('password')}
            />
            {passwordError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {passwordError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <Select
              value={form.watch('role')}
              onValueChange={(value) =>
                form.setValue('role', value as AdminUserRole, { shouldValidate: true })
              }
            >
              <SelectTrigger id="user-role" aria-invalid={Boolean(roleError)}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {formRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {roleError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {roleError}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <p className="text-body-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Saving…'
                  : 'Adding…'
                : isEditMode
                  ? 'Save changes'
                  : 'Add user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
