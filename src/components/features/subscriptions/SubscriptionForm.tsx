import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SubscriptionFormValues, SubscriptionPlan } from '@/types/subscription';

const subscriptionFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Subscription name is required.')
    .max(255, 'Name must be 255 characters or fewer.'),
  price: z
    .string()
    .min(1, 'Price is required.')
    .refine((value) => {
      const parsed = parseFloat(value);
      return !Number.isNaN(parsed) && parsed > 0;
    }, 'Price must be greater than zero.'),
  billing_cycle: z.enum(['monthly', 'yearly'], {
    required_error: 'Duration is required.',
  }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or fewer.'),
  is_published: z.boolean(),
});

function normalizeBillingCycle(value: string): 'monthly' | 'yearly' {
  const normalized = value.toLowerCase();

  if (['yearly', 'year', 'annual'].includes(normalized)) {
    return 'yearly';
  }

  return 'monthly';
}

function getDefaultValues(
  plan?: SubscriptionPlan | null,
): SubscriptionFormValues {
  if (!plan) {
    return {
      name: '',
      price: '',
      billing_cycle: 'monthly',
      description: '',
      is_published: true,
    };
  }

  return {
    name: plan.name,
    price: plan.price,
    billing_cycle: normalizeBillingCycle(plan.billing_cycle || plan.duration),
    description: plan.description ?? '',
    is_published: plan.is_published,
  };
}

interface SubscriptionFormProps {
  mode: 'create' | 'edit';
  initialPlan?: SubscriptionPlan | null;
  loading?: boolean;
  onSubmit: (values: SubscriptionFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export default function SubscriptionForm({
  mode,
  initialPlan,
  loading = false,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: getDefaultValues(initialPlan),
  });

  useEffect(() => {
    form.reset(getDefaultValues(initialPlan));
  }, [form, initialPlan]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label={
          mode === 'create'
            ? 'Add new subscription plan'
            : 'Edit subscription plan'
        }
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subscription-name">Subscription Name</FormLabel>
              <FormControl>
                <Input
                  id="subscription-name"
                  placeholder="e.g. Basic Plan"
                  aria-label="Subscription name"
                  disabled={loading}
                  {...field}
                />
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
              <FormLabel htmlFor="subscription-price">Price (USD)</FormLabel>
              <FormControl>
                <Input
                  id="subscription-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="9.99"
                  aria-label="Subscription price in USD"
                  disabled={loading}
                  {...field}
                />
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
              <FormLabel htmlFor="subscription-duration">Duration</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger
                    id="subscription-duration"
                    aria-label="Subscription duration"
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subscription-description">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  id="subscription-description"
                  placeholder="Optional plan description"
                  aria-label="Subscription description"
                  disabled={loading}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subscription-published">Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'published')}
                value={field.value ? 'published' : 'draft'}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger
                    id="subscription-published"
                    aria-label="Publication status"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-label={mode === 'create' ? 'Save subscription plan' : 'Update subscription plan'}
          >
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { SubscriptionFormValues };
