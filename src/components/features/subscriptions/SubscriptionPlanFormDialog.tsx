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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { buildDefaultCreatePayload } from '@/lib/api/subscription-plans';
import type {
  BillingFrequency,
  HistoricalRecordsDuration,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from '@/types/api';

const billingFrequencyOptions: BillingFrequency[] = ['monthly', 'yearly'];
const historicalDurationOptions: HistoricalRecordsDuration[] = [
  '1_month',
  '3_months',
  '6_months',
  '1_year',
  'unlimited',
];

const subscriptionPlanFormSchema = z.object({
  name: z.string().trim().min(1, 'Subscription name is required.'),
  price_amount: z
    .string()
    .trim()
    .min(1, 'Price is required.')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Please enter a valid price.',
    }),
  billing_frequency: z.enum(['monthly', 'yearly']),
  description: z.string().optional(),
  historical_records_duration: z.enum([
    '1_month',
    '3_months',
    '6_months',
    '1_year',
    'unlimited',
  ]),
  include_offline_sync: z.boolean(),
});

type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanFormSchema>;

interface SubscriptionPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlanItem | null;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
}

function formatHistoricalDuration(value: HistoricalRecordsDuration): string {
  switch (value) {
    case '1_month':
      return '1 month';
    case '3_months':
      return '3 months';
    case '6_months':
      return '6 months';
    case '1_year':
      return '1 year';
    case 'unlimited':
      return 'Unlimited';
    default:
      return value;
  }
}

export function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  role,
  plan,
  onSubmit,
  isSubmitting = false,
  submitError,
}: SubscriptionPlanFormDialogProps) {
  const isEditMode = Boolean(plan);

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanFormSchema),
    defaultValues: {
      name: '',
      price_amount: '0',
      billing_frequency: 'monthly',
      description: '',
      historical_records_duration: '1_year',
      include_offline_sync: false,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (plan) {
      form.reset({
        name: plan.name,
        price_amount: plan.price_amount,
        billing_frequency: plan.billing_frequency,
        description: plan.description ?? '',
        historical_records_duration: plan.historical_records_duration,
        include_offline_sync: plan.include_offline_sync,
      });
      return;
    }

    const defaults = buildDefaultCreatePayload(role);
    form.reset({
      name: defaults.name,
      price_amount: String(defaults.price_amount),
      billing_frequency: defaults.billing_frequency,
      description: defaults.description ?? '',
      historical_records_duration: defaults.historical_records_duration,
      include_offline_sync: defaults.include_offline_sync ?? false,
    });
  }, [open, plan, role, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit subscription plan' : 'Add subscription plan'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update plan details. Currency and billing frequency cannot be changed after creation.'
              : 'Create a new subscription plan. Advanced limits use sensible defaults for a successful save.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <section className="space-y-4">
            <h3 className="font-outfit text-body-10">Basic details</h3>

            <div className="space-y-2">
              <Label htmlFor="plan-name">Subscription name</Label>
              <Input
                id="plan-name"
                {...register('name')}
                aria-invalid={Boolean(errors.name)}
                disabled={isSubmitting}
              />
              {errors.name ? (
                <p className="text-body-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price (USD)</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('price_amount')}
                  aria-invalid={Boolean(errors.price_amount)}
                  disabled={isSubmitting}
                />
                {errors.price_amount ? (
                  <p className="text-body-sm text-destructive" role="alert">
                    {errors.price_amount.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-duration">Duration</Label>
                <Select
                  value={watch('billing_frequency')}
                  onValueChange={(value) =>
                    setValue('billing_frequency', value as BillingFrequency, { shouldValidate: true })
                  }
                  disabled={isSubmitting || isEditMode}
                >
                  <SelectTrigger
                    id="plan-duration"
                    aria-label="Duration"
                    aria-invalid={Boolean(errors.billing_frequency)}
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {billingFrequencyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === 'monthly' ? 'Monthly' : 'Yearly'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.billing_frequency ? (
                  <p className="text-body-sm text-destructive" role="alert">
                    {errors.billing_frequency.message}
                  </p>
                ) : null}
                {isEditMode ? (
                  <p className="text-body-sm text-muted-foreground">
                    Duration is fixed after the plan is created.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                rows={3}
                {...register('description')}
                disabled={isSubmitting}
              />
            </div>
          </section>

          <section className="space-y-4 border-t border-border pt-4">
            <h3 className="font-outfit text-body-10">Advanced settings</h3>
            <p className="text-body-sm text-muted-foreground">
              Teams, coaches, and players default to unlimited. Historical records default to 1 year.
            </p>

            <div className="space-y-2">
              <Label htmlFor="plan-historical">Historical records duration</Label>
              <Select
                value={watch('historical_records_duration')}
                onValueChange={(value) =>
                  setValue('historical_records_duration', value as HistoricalRecordsDuration, {
                    shouldValidate: true,
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="plan-historical" aria-label="Historical records duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {historicalDurationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {formatHistoricalDuration(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-3 text-body-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={watch('include_offline_sync')}
                onChange={(event) =>
                  setValue('include_offline_sync', event.target.checked, { shouldValidate: true })
                }
                disabled={isSubmitting}
              />
              Include offline sync
            </label>
          </section>

          {submitError ? (
            <p className="text-body-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

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
      </DialogContent>
    </Dialog>
  );
}

export type { SubscriptionPlanFormValues };
