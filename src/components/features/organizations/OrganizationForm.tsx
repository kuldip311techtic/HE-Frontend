import { FormEvent, useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { parseApiError } from '@/lib/utils/errors';
import type {
  OrganizationCreateRequest,
  OrganizationItem,
  OrganizationUpdateRequest,
} from '@/types/organizations';

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  organization?: OrganizationItem | null;
  onSubmit: (
    payload: OrganizationCreateRequest | OrganizationUpdateRequest,
  ) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormState {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

const emptyFormState = (): FormState => ({
  name: '',
  contact_email: '',
  phone_number: '',
  address: '',
});

function organizationToFormState(organization: OrganizationItem): FormState {
  return {
    name: organization.name,
    contact_email: organization.contact_email || organization.email,
    phone_number: organization.phone_number ?? organization.phone ?? '',
    address: organization.address ?? '',
  };
}

function buildPayload(form: FormState): OrganizationCreateRequest {
  return {
    name: form.name.trim(),
    contact_email: form.contact_email.trim(),
    phone_number: form.phone_number.trim(),
    address: form.address.trim(),
  };
}

export function OrganizationForm({
  open,
  onOpenChange,
  mode,
  organization,
  onSubmit,
  isSubmitting = false,
}: OrganizationFormProps) {
  const [form, setForm] = useState<FormState>(emptyFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && organization) {
      setForm(organizationToFormState(organization));
    } else {
      setForm(emptyFormState());
    }
    setFieldErrors({});
    setFormError(null);
  }, [open, mode, organization]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Organization name is required.';
    }

    if (!form.contact_email.trim()) {
      errors.contact_email = 'Contact email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim())) {
      errors.contact_email = 'Please enter a valid email address.';
    }

    if (!form.phone_number.trim()) {
      errors.phone_number = 'Phone number is required.';
    }

    if (!form.address.trim()) {
      errors.address = 'Address is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    try {
      await onSubmit(buildPayload(form));
      onOpenChange(false);
    } catch (error) {
      const parsed = parseApiError(
        error,
        mode === 'create'
          ? 'Unable to create organization. Please try again.'
          : 'Unable to save changes. Please try again.',
      );
      setFormError(parsed.message);
      setFieldErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
    }
  };

  const title = mode === 'create' ? 'Add organization' : 'Edit organization';
  const description =
    mode === 'create'
      ? 'Create a new organization account for the platform.'
      : 'Update organization contact details and address.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogContent className="space-y-4">
          {formError ? (
            <p className="font-outfit text-body-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-body-5">
              Organization name
            </Label>
            <Input
              id="org-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'org-name-error' : undefined}
              disabled={isSubmitting}
              placeholder="Organization name"
            />
            {fieldErrors.name ? (
              <p id="org-name-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-email" className="text-body-5">
              Contact email
            </Label>
            <Input
              id="org-email"
              type="email"
              value={form.contact_email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contact_email: event.target.value }))
              }
              aria-invalid={Boolean(fieldErrors.contact_email)}
              aria-describedby={fieldErrors.contact_email ? 'org-email-error' : undefined}
              disabled={isSubmitting}
              placeholder="contact@example.com"
            />
            {fieldErrors.contact_email ? (
              <p id="org-email-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.contact_email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-phone" className="text-body-5">
              Phone number
            </Label>
            <Input
              id="org-phone"
              type="tel"
              value={form.phone_number}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone_number: event.target.value }))
              }
              aria-invalid={Boolean(fieldErrors.phone_number)}
              aria-describedby={fieldErrors.phone_number ? 'org-phone-error' : undefined}
              disabled={isSubmitting}
              placeholder="1234567890"
            />
            {fieldErrors.phone_number ? (
              <p id="org-phone-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.phone_number}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-address" className="text-body-5">
              Address
            </Label>
            <Textarea
              id="org-address"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              aria-invalid={Boolean(fieldErrors.address)}
              aria-describedby={fieldErrors.address ? 'org-address-error' : undefined}
              disabled={isSubmitting}
              placeholder="123 Main St"
              rows={3}
            />
            {fieldErrors.address ? (
              <p id="org-address-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.address}
              </p>
            ) : null}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
