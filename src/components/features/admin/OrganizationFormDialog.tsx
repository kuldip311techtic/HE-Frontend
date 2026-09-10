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
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { OrganizationItem } from '@/types/api';

const schema = z.object({
  name: z.string().min(1, 'Organization Name is required.'),
  contact_email: z
    .string()
    .min(1, 'Contact Email is required.')
    .email('Please enter a valid email address.'),
  phone_number: z
    .string()
    .min(1, 'Phone Number is required.')
    .regex(/^[\d\s+().-]{7,}$/, 'Please enter a valid phone number.'),
  address: z.string().min(1, 'Address is required.'),
});

export type OrganizationFormValues = z.infer<typeof schema>;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: OrganizationItem | null;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors?: Record<string, string>;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  isSubmitting,
  error,
  fieldErrors = {},
  onSubmit,
}: OrganizationFormDialogProps) {
  const isEdit = Boolean(organization);
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      contact_email: '',
      phone_number: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: organization?.name || organization?.organization || '',
      contact_email: organization?.contact_email || organization?.email || '',
      phone_number: organization?.phone_number || organization?.phone || '',
      address: organization?.address || '',
    });
  }, [open, organization, form]);

  useEffect(() => {
    if (!open) return;
    Object.entries(fieldErrors).forEach(([key, message]) => {
      if (key === 'name' || key === 'contact_email' || key === 'phone_number' || key === 'address') {
        form.setError(key, { message });
      }
    });
  }, [fieldErrors, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Organization' : 'Add Organization'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update this organization’s contact details.'
              : 'Create a new organization on the platform.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization Name" autoComplete="organization" {...field} />
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
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="Contact Email" {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" placeholder="Phone Number" {...field} />
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
                    <Input placeholder="Address" autoComplete="street-address" {...field} />
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
