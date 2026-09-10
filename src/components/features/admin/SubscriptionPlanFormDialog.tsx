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
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { SubscriptionPlanItem, SubscriptionPlanRole } from '@/types/api';

const roleOptions = [
  { value: 'org_admin', label: 'Organization Admin' },
  { value: 'coach', label: 'Coach' },
];

const billingOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const limitOptions = [
  { value: 'limited', label: 'Limited' },
  { value: 'unlimited', label: 'Unlimited' },
];

const durationOptions = [
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
  { value: 'unlimited', label: 'Unlimited' },
];

const schema = z
  .object({
    role: z.enum(['org_admin', 'coach']),
    name: z.string().min(1, 'Plan Name is required.'),
    billing_frequency: z.enum(['monthly', 'yearly']),
    currency: z.string().min(1, 'Currency is required.'),
    price_amount: z.string().min(1, 'Price Amount is required.'),
    teams_limit_type: z.enum(['limited', 'unlimited']),
    teams_count: z.string(),
    coaches_limit_type: z.enum(['limited', 'unlimited']),
    coaches_count: z.string(),
    players_limit_type: z.enum(['limited', 'unlimited']),
    players_count: z.string(),
    historical_records_duration: z.enum(['1_month', '3_months', '6_months', '1_year', 'unlimited']),
    is_active: z.enum(['true', 'false']),
    include_offline_sync: z.enum(['true', 'false']),
    description: z.string(),
    features: z.string(),
  })
  .superRefine((values, ctx) => {
    const amount = Number(values.price_amount);
    if (Number.isNaN(amount) || amount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['price_amount'],
        message: 'Please enter a valid price amount.',
      });
    }
    const requireCount = (type: string, count: string, path: 'teams_count' | 'coaches_count' | 'players_count') => {
      if (type !== 'limited') return;
      const parsed = Number(count);
      if (!count.trim() || Number.isNaN(parsed) || parsed < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [path],
          message: 'Please enter a valid count.',
        });
      }
    };
    requireCount(values.teams_limit_type, values.teams_count, 'teams_count');
    requireCount(values.coaches_limit_type, values.coaches_count, 'coaches_count');
    requireCount(values.players_limit_type, values.players_count, 'players_count');
  });

export type SubscriptionPlanFormValues = z.infer<typeof schema>;

interface SubscriptionPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlanItem | null;
  defaultRole: SubscriptionPlanRole;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
}

export function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  plan,
  defaultRole,
  isSubmitting,
  error,
  onSubmit,
}: SubscriptionPlanFormDialogProps) {
  const isEdit = Boolean(plan);
  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: defaultRole,
      name: '',
      billing_frequency: 'monthly',
      currency: 'USD',
      price_amount: '',
      teams_limit_type: 'limited',
      teams_count: '',
      coaches_limit_type: 'limited',
      coaches_count: '',
      players_limit_type: 'limited',
      players_count: '',
      historical_records_duration: '1_year',
      is_active: 'true',
      include_offline_sync: 'false',
      description: '',
      features: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      role: plan?.role || defaultRole,
      name: plan?.name || '',
      billing_frequency: plan?.billing_frequency || 'monthly',
      currency: plan?.currency || 'USD',
      price_amount: plan ? String(plan.price_amount) : '',
      teams_limit_type: plan?.teams_limit_type || 'limited',
      teams_count: plan?.teams_count != null ? String(plan.teams_count) : '',
      coaches_limit_type: plan?.coaches_limit_type || 'limited',
      coaches_count: plan?.coaches_count != null ? String(plan.coaches_count) : '',
      players_limit_type: plan?.players_limit_type || 'limited',
      players_count: plan?.players_count != null ? String(plan.players_count) : '',
      historical_records_duration: plan?.historical_records_duration || '1_year',
      is_active: plan?.is_active === false ? 'false' : 'true',
      include_offline_sync: plan?.include_offline_sync ? 'true' : 'false',
      description: plan?.description || '',
      features: plan?.features?.join(', ') || '',
    });
  }, [open, plan, defaultRole, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Subscription Plan' : 'Add Subscription Plan'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this subscription plan.' : 'Create a subscription plan for organization admins or coaches.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience</FormLabel>
                  <FormControl>
                    <NativeSelect
                      aria-label="Audience"
                      options={roleOptions}
                      disabled={isEdit}
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                  <FormLabel>Subscription Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Subscription Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="0" {...field} />
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
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <NativeSelect aria-label="Duration" options={billingOptions} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Plan Description" {...field} />
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
                    <Input placeholder="USD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="teams_limit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teams Limit</FormLabel>
                    <FormControl>
                      <NativeSelect aria-label="Teams Limit" options={limitOptions} {...field} />
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
                    <FormLabel>Teams Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Teams Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="coaches_limit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coaches Limit</FormLabel>
                    <FormControl>
                      <NativeSelect aria-label="Coaches Limit" options={limitOptions} {...field} />
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
                    <FormLabel>Coaches Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Coaches Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="players_limit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Players Limit</FormLabel>
                    <FormControl>
                      <NativeSelect aria-label="Players Limit" options={limitOptions} {...field} />
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
                    <FormLabel>Players Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="Players Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="historical_records_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Records Duration</FormLabel>
                  <FormControl>
                    <NativeSelect aria-label="Historical Records Duration" options={durationOptions} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <NativeSelect
                        aria-label="Active"
                        options={[
                          { value: 'true', label: 'Active' },
                          { value: 'false', label: 'Inactive' },
                        ]}
                        {...field}
                      />
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
                    <FormLabel>Offline Sync</FormLabel>
                    <FormControl>
                      <NativeSelect
                        aria-label="Offline Sync"
                        options={[
                          { value: 'true', label: 'Included' },
                          { value: 'false', label: 'Not Included' },
                        ]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Input placeholder="Comma Separated Features" {...field} />
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
