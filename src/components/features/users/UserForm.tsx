import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
import { parseApiError } from '@/lib/utils/errors';
import type {
  UserCreateRequest,
  UserItem,
  UserRole,
  UserUpdateRequest,
} from '@/types/users';

const ROLE_OPTIONS: UserRole[] = ['Coach', 'Player'];

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  user?: UserItem | null;
  onSubmit: (payload: UserCreateRequest | UserUpdateRequest) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
}

const emptyFormState = (): FormState => ({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'Coach',
});

function userToFormState(user: UserItem): FormState {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: '',
    role: (user.role as UserRole) || 'Coach',
  };
}

function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.';
  }
  return null;
}

function buildCreatePayload(form: FormState): UserCreateRequest {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim(),
    password: form.password,
    role: form.role,
  };
}

function buildUpdatePayload(form: FormState): UserUpdateRequest {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim(),
    role: form.role,
  };
}

export function UserForm({
  open,
  onOpenChange,
  mode,
  user,
  onSubmit,
  isSubmitting = false,
}: UserFormProps) {
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && user) {
      setForm(userToFormState(user));
    } else {
      setForm(emptyFormState());
    }
    setFieldErrors({});
    setFormError(null);
    setShowPassword(false);
  }, [open, mode, user]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.first_name.trim()) {
      errors.first_name = 'First name is required.';
    } else if (form.first_name.trim().length > 50) {
      errors.first_name = 'First name must be 50 characters or fewer.';
    }

    if (!form.last_name.trim()) {
      errors.last_name = 'Last name is required.';
    } else if (form.last_name.trim().length > 50) {
      errors.last_name = 'Last name must be 50 characters or fewer.';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (mode === 'create') {
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }

    if (!form.role) {
      errors.role = 'Role is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    try {
      const payload = mode === 'create' ? buildCreatePayload(form) : buildUpdatePayload(form);
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      const parsed = parseApiError(
        error,
        mode === 'create'
          ? 'Unable to create user. Please try again.'
          : 'Unable to save changes. Please try again.',
      );
      setFormError(parsed.message);
      setFieldErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
    }
  };

  const title = mode === 'create' ? 'Add user' : 'Edit user';
  const description =
    mode === 'create'
      ? 'Create a new coach or player account on the platform.'
      : 'Update user details and role assignment.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="admin-form-dialog">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="admin-form-dialog__header border-0 px-6 py-5">
          <DialogTitle className="admin-form-dialog__title">{title}</DialogTitle>
          <DialogDescription className="admin-form-dialog__description">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="admin-form-dialog__content border-0 py-5">
          {formError ? (
            <p className="font-outfit text-body-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-form-grid admin-form-grid--split">
            <div className="admin-field-group">
              <Label htmlFor="user-first-name" className="admin-field-label">
                First name
              </Label>
              <Input
                id="user-first-name"
                value={form.first_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, first_name: event.target.value }))
                }
                aria-invalid={Boolean(fieldErrors.first_name)}
                aria-describedby={fieldErrors.first_name ? 'user-first-name-error' : undefined}
                disabled={isSubmitting}
                placeholder="John"
                className="admin-field-input"
              />
              {fieldErrors.first_name ? (
                <p
                  id="user-first-name-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.first_name}
                </p>
              ) : null}
            </div>

            <div className="admin-field-group">
              <Label htmlFor="user-last-name" className="admin-field-label">
                Last name
              </Label>
              <Input
                id="user-last-name"
                value={form.last_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, last_name: event.target.value }))
                }
                aria-invalid={Boolean(fieldErrors.last_name)}
                aria-describedby={fieldErrors.last_name ? 'user-last-name-error' : undefined}
                disabled={isSubmitting}
                placeholder="Doe"
                className="admin-field-input"
              />
              {fieldErrors.last_name ? (
                <p
                  id="user-last-name-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.last_name}
                </p>
              ) : null}
            </div>
          </div>

          <div className="admin-field-group">
            <Label htmlFor="user-email" className="admin-field-label">
              Email
            </Label>
            <Input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'user-email-error' : undefined}
              disabled={isSubmitting}
              placeholder="john.doe@example.com"
              className="admin-field-input"
            />
            {fieldErrors.email ? (
              <p id="user-email-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          {mode === 'create' ? (
            <div className="admin-field-group">
              <Label htmlFor="user-password" className="admin-field-label">
                Password
              </Label>
              <div className="admin-field-input-wrap">
                <Input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'user-password-error' : undefined}
                  disabled={isSubmitting}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  className="admin-field-input admin-field-input--password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p
                  id="user-password-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="admin-field-group">
            <Label htmlFor="user-role" className="admin-field-label">
              Role
            </Label>
            <select
              id="user-role"
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))
              }
              aria-invalid={Boolean(fieldErrors.role)}
              aria-describedby={fieldErrors.role ? 'user-role-error' : undefined}
              disabled={isSubmitting}
              className="admin-field-select"
            >
              {ROLE_OPTIONS.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
            {fieldErrors.role ? (
              <p id="user-role-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.role}
              </p>
            ) : null}
          </div>
        </DialogContent>
        <DialogFooter className="admin-form-dialog__footer border-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="admin-outline-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="admin-primary-btn"
          >
            {mode === 'create' ? 'Add user' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
