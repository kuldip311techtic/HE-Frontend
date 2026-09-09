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
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { applyApiFieldErrors, getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import {
  useCreateSubscriptionPlan,
  useSubscriptionCurrencies,
  useUpdateSubscriptionPlan,
} from '@/hooks/useSubscriptionPlans';
import type {
  HistoricalRecordsDuration,
  LimitType,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from '@/types/subscription';

const durationOptions: HistoricalRecordsDuration[] = [
  '1_month',
  '3_months',
  '6_months',
  '1_year',
  'unlimited',
];

const schema = z
  .object({
    role: z.enum(['org_admin', 'coach']),
    name: z.string().min(1, 'Plan name is required.'),
    billing_frequency: z.enum(['monthly', 'yearly']),
    currency: z.string().min(1, 'Currency is required.'),
    price_amount: z.string().min(1, 'Price amount is required.'),
    teams_limit_type: z.enum(['limited', 'unlimited']),
    teams_count: z.string(),
    coaches_limit_type: z.enum(['limited', 'unlimited', '']),
    coaches_count: z.string(),
    players_limit_type: z.enum(['limited', 'unlimited']),
    players_count: z.string(),
    historical_records_duration: z.enum(['1_month', '3_months', '6_months', '1_year', 'unlimited']),
    is_active: z.boolean(),
    include_offline_sync: z.boolean(),
    description: z.string(),
    features: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.teams_limit_type === 'limited' && values.teams_count.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['teams_count'],
        message: 'Teams count is required when the limit is limited.',
      });
    }
    if (values.players_limit_type === 'limited' && values.players_count.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['players_count'],
        message: 'Players count is required when the limit is limited.',
      });
    }
    if (values.coaches_limit_type === 'limited' && values.coaches_count.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['coaches_count'],
        message: 'Coaches count is required when the limit is limited.',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function parseCount(value: string, limitType: string): number | null {
  if (limitType !== 'limited') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseFeatures(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

interface SubscriptionPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlanItem | null;
  defaultRole: SubscriptionPlanRole;
}

export function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  plan,
  defaultRole,
}: SubscriptionPlanFormDialogProps) {
  const isEdit = Boolean(plan);
  const createMutation = useCreateSubscriptionPlan();
  const updateMutation = useUpdateSubscriptionPlan();
  const currenciesQuery = useSubscriptionCurrencies();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const currencies = currenciesQuery.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: defaultRole,
      name: '',
      billing_frequency: 'monthly',
      currency: 'USD',
      price_amount: '',
      teams_limit_type: 'limited',
      teams_count: '',
      coaches_limit_type: '',
      coaches_count: '',
      players_limit_type: 'limited',
      players_count: '',
      historical_records_duration: '1_year',
      is_active: true,
      include_offline_sync: false,
      description: '',
      features: '',
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      role: plan?.role ?? defaultRole,
      name: plan?.name ?? '',
      billing_frequency: plan?.billing_frequency ?? 'monthly',
      currency: plan?.currency ?? 'USD',
      price_amount: plan?.price_amount ? String(plan.price_amount) : '',
      teams_limit_type: plan?.teams_limit_type ?? 'limited',
      teams_count: plan?.teams_count != null ? String(plan.teams_count) : '',
      coaches_limit_type: plan?.coaches_limit_type ?? '',
      coaches_count: plan?.coaches_count != null ? String(plan.coaches_count) : '',
      players_limit_type: plan?.players_limit_type ?? 'limited',
      players_count: plan?.players_count != null ? String(plan.players_count) : '',
      historical_records_duration: plan?.historical_records_duration ?? '1_year',
      is_active: plan?.is_active ?? true,
      include_offline_sync: plan?.include_offline_sync ?? false,
      description: plan?.description ?? '',
      features: plan?.features?.join(', ') ?? '',
    });
  }, [open, plan, defaultRole, form]);

  const onSubmit = async (values: FormValues) => {
    const coachesLimit =
      values.coaches_limit_type === '' ? null : (values.coaches_limit_type as LimitType);
    try {
      if (plan) {
        await updateMutation.mutateAsync({
          planId: plan.id,
          role: plan.role,
          payload: {
            name: values.name,
            billing_frequency: values.billing_frequency,
            currency: values.currency,
            price_amount: values.price_amount,
            teams_limit_type: values.teams_limit_type,
            teams_count: parseCount(values.teams_count, values.teams_limit_type),
            coaches_limit_type: coachesLimit,
            coaches_count: parseCount(values.coaches_count, values.coaches_limit_type),
            players_limit_type: values.players_limit_type,
            players_count: parseCount(values.players_count, values.players_limit_type),
            historical_records_duration: values.historical_records_duration,
            is_active: values.is_active,
            include_offline_sync: values.include_offline_sync,
            description: values.description || null,
            features: parseFeatures(values.features),
          },
        });
        toast.success('Subscription plan updated successfully.');
      } else {
        await createMutation.mutateAsync({
          role: values.role,
          name: values.name,
          billing_frequency: values.billing_frequency,
          currency: values.currency,
          price_amount: values.price_amount,
          teams_limit_type: values.teams_limit_type,
          teams_count: parseCount(values.teams_count, values.teams_limit_type),
          coaches_limit_type: coachesLimit,
          coaches_count: parseCount(values.coaches_count, values.coaches_limit_type),
          players_limit_type: values.players_limit_type,
          players_count: parseCount(values.players_count, values.players_limit_type),
          historical_records_duration: values.historical_records_duration,
          is_active: values.is_active,
          include_offline_sync: values.include_offline_sync,
          description: values.description || null,
          features: parseFeatures(values.features),
        });
        toast.success('Subscription plan created successfully.');
      }
      onOpenChange(false);
    } catch (error) {
      const applied = applyApiFieldErrors(error, form.setError);
      if (!applied) {
        form.setError('root', {
          message: getApiErrorMessage(error, 'Unable to save the subscription plan. Please try again.'),
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit subscription plan' : 'Add subscription plan'}
      description={
        isEdit
          ? 'Update plan billing and limits. Role cannot be changed after create.'
          : 'Create a plan for organization admins or coaches. Role cannot be changed later.'
      }
      className="max-w-3xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="subscription-plan-form"
            variant="brand"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (isEdit ? 'Saving…' : 'Creating…') : isEdit ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form
          id="subscription-plan-form"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select {...field} disabled={isEdit}>
                    <option value="org_admin">Organization Admin</option>
                    <option value="coach">Coach</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing frequency</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  {currencies.length > 0 ? (
                    <Select {...field}>
                      {currencies.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input {...field} placeholder="USD" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price amount</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="decimal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="historical_records_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical records duration</FormLabel>
                <FormControl>
                  <Select {...field}>
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teams_limit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teams limit type</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="limited">Limited</option>
                    <option value="unlimited">Unlimited</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teams_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teams count</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="players_limit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Players limit type</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="limited">Limited</option>
                    <option value="unlimited">Unlimited</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="players_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Players count</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coaches_limit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coaches limit type</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="">None</option>
                    <option value="limited">Limited</option>
                    <option value="unlimited">Unlimited</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coaches_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coaches count</FormLabel>
                <FormControl>
                  <Input {...field} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? 'true' : 'false'}
                    onChange={(event) => field.onChange(event.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="include_offline_sync"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Include offline sync</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? 'true' : 'false'}
                    onChange={(event) => field.onChange(event.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Comma-separated features" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ? (
            <div className="sm:col-span-2">
              <ErrorMessage message={form.formState.errors.root.message} />
            </div>
          ) : null}
        </form>
      </Form>
    </Dialog>
  );
}
