import { useEffect, type RefObject } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useCreateOrganization, useUpdateOrganization } from '@/hooks/useOrganizations';
import type { Organization } from '@/types/organization';

const schema = z.object({
  name: z.string().min(1, 'Organization name is required.'),
  contact_email: z
    .string()
    .min(1, 'Contact email is required.')
    .email('Please enter a valid email address.'),
  phone_number: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  returnFocusRef,
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

  useEffect(() => {
    if (open) {
      form.reset({
        name: organization?.name ?? '',
        contact_email: organization?.contact_email ?? '',
        phone_number: organization?.phone_number ?? '',
        address: organization?.address ?? '',
      });
    }
  }, [open, organization, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && organization) {
        await updateMutation.mutateAsync({ id: organization.id, payload: values });
        toast.success('Organization updated successfully.');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Organization created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to save changes. Please try again.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} returnFocusRef={returnFocusRef}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit organization' : 'Add organization'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Organization name" />
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
                    <Input {...field} type="email" placeholder="contact@example.com" />
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
                    <Input {...field} type="tel" placeholder="+1 555 000 0000" />
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
                    <Textarea {...field} placeholder="Street, city, state" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={isPending} aria-busy={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
