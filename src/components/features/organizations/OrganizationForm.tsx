import { type FormEvent, useEffect, useId, useState } from 'react';
import { useAddOrganization } from '../../../hooks/useAddOrganization';
import { useEditOrganization } from '../../../hooks/useEditOrganization';
import { getFieldErrorFromApi } from '../../../lib/api/errors';
import {
  emptyOrganizationPayload,
  validateOrganizationPayload,
  type OrganizationFieldErrors,
} from '../../../lib/organizations/validateOrganization';
import {
  ORGANIZATION_STATUSES,
  type Organization,
  type OrganizationPayload,
} from '../../../types/organization';
import Button from '../../ui/Button';
import ErrorMessage from '../../ui/ErrorMessage';
import Input from '../../ui/Input';

interface OrganizationFormProps {
  mode: 'add' | 'edit';
  organization?: Organization;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function OrganizationForm({
  mode,
  organization,
  open,
  onClose,
  onSuccess,
}: OrganizationFormProps) {
  const titleId = useId();
  const [values, setValues] = useState<OrganizationPayload>(
    emptyOrganizationPayload(),
  );
  const [fieldErrors, setFieldErrors] = useState<OrganizationFieldErrors>({});
  const addMutation = useAddOrganization();
  const editMutation = useEditOrganization();
  const isSubmitting = addMutation.isLoading || editMutation.isLoading;
  const apiError =
    mode === 'add' ? addMutation.errorMessage : editMutation.errorMessage;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === 'edit' && organization) {
      setValues({
        name: organization.name,
        email: organization.email,
        contact_email: organization.contact_email,
        phone_number: organization.phone_number,
        address: organization.address,
        description: organization.description,
        status: organization.status,
      });
    } else {
      setValues(emptyOrganizationPayload());
    }

    setFieldErrors({});
    addMutation.reset();
    editMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset form when dialog opens
  }, [open, mode, organization?.id]);

  const setField = <Key extends keyof OrganizationPayload>(
    key: Key,
    value: OrganizationPayload[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateOrganizationPayload(values);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload: OrganizationPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      contact_email: values.contact_email.trim(),
      phone_number: values.phone_number.trim(),
      address: values.address.trim(),
      description: values.description.trim(),
      status: values.status,
    };

    try {
      if (mode === 'add') {
        await addMutation.addOrganization(payload);
        onSuccess('Organization added successfully.');
      } else if (organization) {
        await editMutation.editOrganization({
          id: organization.id,
          payload,
        });
        onSuccess('Organization updated successfully.');
      }
      onClose();
    } catch (error) {
      const emailError = getFieldErrorFromApi(error, 'email');
      if (emailError) {
        setFieldErrors((current) => ({ ...current, email: emailError }));
      }
    }
  };

  if (!open) {
    return null;
  }

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
          {mode === 'add' ? 'Add organization' : 'Edit organization'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {mode === 'add'
            ? 'Create a new organization record for the Super Admin dashboard.'
            : 'Update organization details and save your changes.'}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="organization-name"
              label="Organization name"
              name="name"
              required
              value={values.name}
              error={fieldErrors.name}
              disabled={isSubmitting}
              onChange={(event) => setField('name', event.target.value)}
            />
            <Input
              id="organization-email"
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={values.email}
              error={fieldErrors.email}
              disabled={isSubmitting}
              onChange={(event) => setField('email', event.target.value)}
            />
            <Input
              id="organization-contact-email"
              label="Contact email"
              name="contact_email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.contact_email}
              error={fieldErrors.contact_email}
              disabled={isSubmitting}
              onChange={(event) =>
                setField('contact_email', event.target.value)
              }
            />
            <Input
              id="organization-phone"
              label="Phone number"
              name="phone_number"
              type="tel"
              autoComplete="tel"
              value={values.phone_number}
              error={fieldErrors.phone_number}
              disabled={isSubmitting}
              onChange={(event) =>
                setField('phone_number', event.target.value)
              }
            />
          </div>

          <Input
            id="organization-address"
            label="Address"
            name="address"
            autoComplete="street-address"
            value={values.address}
            error={fieldErrors.address}
            disabled={isSubmitting}
            onChange={(event) => setField('address', event.target.value)}
          />

          <div>
            <label
              htmlFor="organization-description"
              className="mb-2 block text-sm font-semibold leading-5 text-ink"
            >
              Description
            </label>
            <textarea
              id="organization-description"
              name="description"
              rows={4}
              value={values.description}
              disabled={isSubmitting}
              aria-describedby={
                fieldErrors.description ? 'organization-description-error' : undefined
              }
              aria-invalid={Boolean(fieldErrors.description)}
              className="min-h-[120px] w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-5 text-ink outline-none transition focus:border-accent focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-70"
              onChange={(event) => setField('description', event.target.value)}
            />
            {fieldErrors.description ? (
              <p
                id="organization-description-error"
                className="mt-1.5 text-xs leading-4 text-danger"
              >
                {fieldErrors.description}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="organization-status"
              className="mb-2 block text-sm font-semibold leading-5 text-ink"
            >
              Status
            </label>
            <select
              id="organization-status"
              name="status"
              required
              value={values.status}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.status)}
              aria-describedby={
                fieldErrors.status ? 'organization-status-error' : undefined
              }
              className="min-h-touch w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-5 text-ink outline-none transition focus:border-accent focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-70"
              onChange={(event) => setField('status', event.target.value)}
            >
              {ORGANIZATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            {fieldErrors.status ? (
              <p
                id="organization-status-error"
                className="mt-1.5 text-xs leading-4 text-danger"
              >
                {fieldErrors.status}
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
              {mode === 'add' ? 'Add organization' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
