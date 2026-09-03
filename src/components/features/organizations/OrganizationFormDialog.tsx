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
import { Textarea } from '@/components/ui/textarea';
import { getOrganizationDisplayName, getOrganizationPhone } from '@/lib/api/organizations';
import type { OrganizationItem } from '@/types/api';

const organizationFormSchema = z.object({
  name: z.string().trim().min(1, 'Organization name is required.'),
  contact_email: z.string().trim().email('Please enter a valid email address.'),
  phone_number: z.string().trim().min(1, 'Phone number is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: OrganizationItem | null;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  fieldErrors?: Record<string, string>;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  onSubmit,
  isSubmitting = false,
  submitError,
  fieldErrors = {},
}: OrganizationFormDialogProps) {
  const isEditMode = Boolean(organization);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: '',
      contact_email: '',
      phone_number: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (organization) {
      form.reset({
        name: getOrganizationDisplayName(organization),
        contact_email: organization.contact_email ?? organization.email ?? '',
        phone_number: getOrganizationPhone(organization) === '—' ? '' : getOrganizationPhone(organization),
        address: organization.address ?? '',
      });
    } else {
      form.reset({
        name: '',
        contact_email: '',
        phone_number: '',
        address: '',
      });
    }
  }, [open, organization, form]);

  useEffect(() => {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      if (field in form.getValues()) {
        form.setError(field as keyof OrganizationFormValues, { message });
      }
    });
  }, [fieldErrors, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const nameError = form.formState.errors.name?.message;
  const emailError = form.formState.errors.contact_email?.message ?? fieldErrors.contact_email;
  const phoneError = form.formState.errors.phone_number?.message ?? fieldErrors.phone_number;
  const addressError = form.formState.errors.address?.message ?? fieldErrors.address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit organization' : 'Add organization'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update organization contact details and address.'
              : 'Create a new organization with contact information and address.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="organization-name">Organization name</Label>
            <Input
              id="organization-name"
              autoComplete="organization"
              aria-invalid={Boolean(nameError)}
              {...form.register('name')}
            />
            {nameError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {nameError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-email">Contact email</Label>
            <Input
              id="organization-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              {...form.register('contact_email')}
            />
            {emailError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-phone">Phone number</Label>
            <Input
              id="organization-phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(phoneError)}
              {...form.register('phone_number')}
            />
            {phoneError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {phoneError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-address">Address</Label>
            <Textarea
              id="organization-address"
              autoComplete="street-address"
              className="min-h-[88px] resize-y"
              aria-invalid={Boolean(addressError)}
              {...form.register('address')}
            />
            {addressError ? (
              <p className="text-body-sm text-destructive" role="alert">
                {addressError}
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
                  : 'Add organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
