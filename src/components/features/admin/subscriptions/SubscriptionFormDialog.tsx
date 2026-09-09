import { useEffect } from 'react';
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
import { Select } from '@/components/ui/select';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useCreateSubscription, useUpdateSubscription } from '@/hooks/useSubscriptions';
import type { SubscriptionPlan } from '@/types/subscription';

const BILLING_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const schema = z.object({
  name: z.string().min(1, 'Plan name is required.'),
  price: z.coerce.number().min(0, 'Price must be zero or greater.'),
  billing_cycle: z.string().min(1, 'Please select a billing cycle.'),
});

type FormValues = z.infer<typeof schema>;

interface SubscriptionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: SubscriptionPlan | null;
}

export function SubscriptionFormDialog({
  open,
  onOpenChange,
  subscription,
}: SubscriptionFormDialogProps) {
  const isEdit = Boolean(subscription);
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      price: 0,
      billing_cycle: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: subscription?.name ?? '',
        price: subscription?.price ?? 0,
        billing_cycle: subscription?.billing_cycle ?? '',
      });
    }
  }, [open, subscription, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && subscription) {
        await updateMutation.mutateAsync({ id: subscription.id, payload: values });
        toast.success('Subscription plan updated successfully.');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Subscription plan created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to save changes. Please try again.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit subscription plan' : 'Add subscription plan'}</DialogTitle>
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
                    <Input {...field} placeholder="Plan name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step="0.01" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billing_cycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing cycle</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      options={BILLING_OPTIONS}
                      placeholder="Select billing cycle"
                      value={field.value}
                      onChange={field.onChange}
                    />
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
