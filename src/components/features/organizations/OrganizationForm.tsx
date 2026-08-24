import { type FormEvent, useEffect, useId, useState } from 'react';
import { useAddOrganization } from '../../../hooks/useAddOrganization';
import { useEditOrganization } from '../../../hooks/useEditOrganization';
import { getFieldErrorFromApi } from '../../../lib/api/errors';
import {
  emptyOrganizationPayload,
  validateOrganizationPayload,
  type OrganizationFieldErrors,
} from '../../../lib/organizations/validateOrganization';
import type { Organization, OrganizationPayload } from '../../../types/organization';
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
        contact_email: organization.contact_email,
        phone_number: organization.phone_number,
        address: organization.address,
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
      contact_email: values.contact_email.trim(),
      phone_number: values.phone_number.trim(),
      address: values.address.trim(),
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
      const contactEmailError = getFieldErrorFromApi(error, 'contact_email');
      if (contactEmailError) {
        setFieldErrors((current) => ({
          ...current,
          contact_email: contactEmailError,
        }));
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
            id="organization-contact-email"
            label="Contact email"
            name="contact_email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.contact_email}
            error={fieldErrors.contact_email}
            disabled={isSubmitting}
            onChange={(event) => setField('contact_email', event.target.value)}
          />
          <Input
            id="organization-phone"
            label="Phone number"
            name="phone_number"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone_number}
            error={fieldErrors.phone_number}
            disabled={isSubmitting}
            onChange={(event) => setField('phone_number', event.target.value)}
          />
          <Input
            id="organization-address"
            label="Address"
            name="address"
            autoComplete="street-address"
            required
            value={values.address}
            error={fieldErrors.address}
            disabled={isSubmitting}
            onChange={(event) => setField('address', event.target.value)}
          />

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
              className="sm:min-w-[120px]"
              loading={isSubmitting}
              loadingText="Saving…"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
