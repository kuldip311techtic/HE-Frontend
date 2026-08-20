import { type FormEvent, useEffect, useId, useState } from 'react';
import { useAddUser } from '../../../hooks/useAddUser';
import { useEditUser } from '../../../hooks/useEditUser';
import { getFieldErrorFromApi } from '../../../lib/api/errors';
import {
  buildUserName,
  emptyUserAddPayload,
  emptyUserEditPayload,
  validateUserAddPayload,
  validateUserEditPayload,
  type UserAddFieldErrors,
  type UserEditFieldErrors,
} from '../../../lib/users/validateUser';
import {
  USER_ROLES,
  formatUserRole,
  type User,
  type UserAddPayload,
  type UserEditPayload,
} from '../../../types/user';
import Button from '../../ui/Button';
import ErrorMessage from '../../ui/ErrorMessage';
import Input from '../../ui/Input';

interface UserFormProps {
  mode: 'add' | 'edit';
  user?: User;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function UserForm({
  mode,
  user,
  open,
  onClose,
  onSuccess,
}: UserFormProps) {
  const titleId = useId();
  const [addValues, setAddValues] = useState<UserAddPayload>(
    emptyUserAddPayload(),
  );
  const [editValues, setEditValues] = useState<UserEditPayload>(
    emptyUserEditPayload(),
  );
  const [addFieldErrors, setAddFieldErrors] = useState<UserAddFieldErrors>({});
  const [editFieldErrors, setEditFieldErrors] = useState<UserEditFieldErrors>(
    {},
  );
  const addMutation = useAddUser();
  const editMutation = useEditUser();
  const isSubmitting = addMutation.isLoading || editMutation.isLoading;
  const apiError =
    mode === 'add' ? addMutation.errorMessage : editMutation.errorMessage;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && user) {
      setEditValues({
        first_name: user.first_name,
        last_name: user.last_name,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles.length > 0 ? user.roles : [user.role],
        status: user.status,
        organization_id: user.organization_id,
      });
    } else {
      setAddValues(emptyUserAddPayload());
    }

    setAddFieldErrors({});
    setEditFieldErrors({});
    addMutation.reset();
    editMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset form when dialog opens
  }, [open, mode, user?.id]);

  const setAddField = <Key extends keyof UserAddPayload>(
    key: Key,
    value: UserAddPayload[Key],
  ) => {
    setAddValues((current) => ({ ...current, [key]: value }));
    setAddFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const setEditField = <Key extends keyof UserEditPayload>(
    key: Key,
    value: UserEditPayload[Key],
  ) => {
    setEditValues((current) => ({ ...current, [key]: value }));
    setEditFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleRoleChange = (role: string) => {
    if (mode === 'add') {
      setAddField('role', role);
      setAddField('roles', [role]);
    } else {
      setEditField('role', role);
      setEditField('roles', [role]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'add') {
      const validationErrors = validateUserAddPayload(addValues);
      setAddFieldErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      const payload: UserAddPayload = {
        first_name: addValues.first_name.trim(),
        last_name: addValues.last_name.trim(),
        name: buildUserName(addValues.first_name, addValues.last_name),
        email: addValues.email.trim(),
        role: addValues.role,
        roles: [addValues.role],
        password: addValues.password,
        status: addValues.status,
        organization_id: addValues.organization_id,
      };

      try {
        await addMutation.addUser(payload);
        onSuccess('User added successfully.');
        onClose();
      } catch (error) {
        const emailError = getFieldErrorFromApi(error, 'email');
        if (emailError) {
          setAddFieldErrors((current) => ({ ...current, email: emailError }));
        }
      }

      return;
    }

    const validationErrors = validateUserEditPayload(editValues);
    setEditFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload: UserEditPayload = {
      first_name: editValues.first_name.trim(),
      last_name: editValues.last_name.trim(),
      name: buildUserName(editValues.first_name, editValues.last_name),
      email: editValues.email.trim(),
      role: editValues.role,
      roles: [editValues.role],
      status: editValues.status,
      organization_id: editValues.organization_id,
    };

    if (!user) {
      return;
    }

    try {
      await editMutation.editUser({ id: user.id, payload });
      onSuccess('User updated successfully.');
      onClose();
    } catch (error) {
      const emailError = getFieldErrorFromApi(error, 'email');
      if (emailError) {
        setEditFieldErrors((current) => ({ ...current, email: emailError }));
      }
    }
  };

  if (!open) {
    return null;
  }

  const firstName =
    mode === 'add' ? addValues.first_name : editValues.first_name;
  const lastName = mode === 'add' ? addValues.last_name : editValues.last_name;
  const email = mode === 'add' ? addValues.email : editValues.email;
  const role = mode === 'add' ? addValues.role : editValues.role;
  const password = mode === 'add' ? addValues.password : '';
  const firstNameError =
    mode === 'add' ? addFieldErrors.first_name : editFieldErrors.first_name;
  const lastNameError =
    mode === 'add' ? addFieldErrors.last_name : editFieldErrors.last_name;
  const emailError =
    mode === 'add' ? addFieldErrors.email : editFieldErrors.email;
  const roleError = mode === 'add' ? addFieldErrors.role : editFieldErrors.role;
  const passwordError = mode === 'add' ? addFieldErrors.password : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-card"
      >
        <h2 id={titleId} className="text-xl font-bold leading-7 text-ink">
          {mode === 'add' ? 'Add user' : 'Edit user'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {mode === 'add'
            ? 'Create a new user account and assign a role.'
            : 'Update user details and save your changes.'}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="user-first-name"
              label="First name"
              name="first_name"
              required
              value={firstName}
              error={firstNameError}
              disabled={isSubmitting}
              autoComplete="given-name"
              onChange={(event) => {
                if (mode === 'add') {
                  setAddField('first_name', event.target.value);
                } else {
                  setEditField('first_name', event.target.value);
                }
              }}
            />
            <Input
              id="user-last-name"
              label="Last name"
              name="last_name"
              required
              value={lastName}
              error={lastNameError}
              disabled={isSubmitting}
              autoComplete="family-name"
              onChange={(event) => {
                if (mode === 'add') {
                  setAddField('last_name', event.target.value);
                } else {
                  setEditField('last_name', event.target.value);
                }
              }}
            />
            <Input
              id="user-email"
              label="Email address"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              error={emailError}
              disabled={isSubmitting}
              className="md:col-span-2"
              onChange={(event) => {
                if (mode === 'add') {
                  setAddField('email', event.target.value);
                } else {
                  setEditField('email', event.target.value);
                }
              }}
            />
            {mode === 'add' ? (
              <Input
                id="user-password"
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                error={passwordError}
                disabled={isSubmitting}
                className="md:col-span-2"
                onChange={(event) => setAddField('password', event.target.value)}
              />
            ) : null}
          </div>

          <div>
            <label
              htmlFor="user-role"
              className="mb-2 block text-sm font-semibold leading-5 text-ink"
            >
              Role
            </label>
            <select
              id="user-role"
              name="role"
              required
              value={role}
              disabled={isSubmitting}
              aria-invalid={Boolean(roleError)}
              aria-describedby={roleError ? 'user-role-error' : undefined}
              className="min-h-touch w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-5 text-ink outline-none transition focus:border-accent focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-70"
              onChange={(event) => handleRoleChange(event.target.value)}
            >
              {USER_ROLES.map((userRole) => (
                <option key={userRole} value={userRole}>
                  {formatUserRole(userRole)}
                </option>
              ))}
            </select>
            {roleError ? (
              <p
                id="user-role-error"
                className="mt-1.5 text-xs leading-4 text-danger"
              >
                {roleError}
              </p>
            ) : null}
          </div>

          {apiError ? <ErrorMessage message={apiError} /> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              fullWidth={false}
              className="sm:min-w-[120px]"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              fullWidth={false}
              className="sm:min-w-[160px]"
              loading={isSubmitting}
              loadingText={mode === 'add' ? 'Adding…' : 'Saving…'}
            >
              {mode === 'add' ? 'Add user' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
