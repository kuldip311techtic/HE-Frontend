import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { applyApiFieldErrors, getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useCreateOrganization, useUpdateOrganization } from '@/hooks/useOrganizations';
import type { OrganizationItem } from '@/types/organization';

const schema = z.object({
  name: z.string().min(1, 'Organization name is required.'),
  contact_email: z
    .string()
    .min(1, 'Contact email is required.')
    .email('Please enter a valid email address.'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required.')
    .refine((value) => value.replace(/\D/g, '').length >= 7, {
      message: 'Please enter a valid phone number.',
    }),
  address: z.string().min(1, 'Address is required.'),
});

type FormValues = z.infer<typeof schema>;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: OrganizationItem | null;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
}: OrganizationFormDialogProps) {
  const isEdit = Boolean(organization);
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      contact_email: '',
      phone_number: '',
      address: '',
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: organization?.name ?? '',
      contact_email: organization?.contact_email || organization?.email || '',
      phone_number: organization?.phone_number || organization?.phone || '',
      address: organization?.address ?? '',
    });
  }, [open, organization, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (organization) {
        const response = await updateMutation.mutateAsync({
          organizationId: organization.id,
          payload: {
            name: values.name,
            contact_email: values.contact_email,
            phone_number: values.phone_number,
            address: values.address,
          },
        });
        toast.success(response.message || 'Organization updated successfully.');
      } else {
        const response = await createMutation.mutateAsync(values);
        toast.success(response.message || 'Organization created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      const applied = applyApiFieldErrors(error, form.setError);
      if (applied) return;
      form.setError('root', {
        message: getApiErrorMessage(error, 'Unable to save the organization. Please try again.'),
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
      title={isEdit ? 'Edit organization' : 'Add organization'}
      description={
        isEdit
          ? 'Update organization contact details. Changes replace the current values.'
          : 'Create a new organization. All fields are required.'
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="organization-form"
            variant="brand"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form
          id="organization-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="organization" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" autoComplete="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="street-address" />
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
