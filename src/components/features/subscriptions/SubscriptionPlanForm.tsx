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
import { useCurrencies } from '@/hooks/useCurrencies';
import { parseApiError } from '@/lib/utils/errors';
import type {
  BillingFrequency,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscriptions';

interface SubscriptionPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlanItem | null;
  onSubmit: (
    payload: SubscriptionPlanCreateRequest | SubscriptionPlanUpdateRequest,
  ) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormState {
  name: string;
  price_amount: string;
  currency: string;
  billing_frequency: BillingFrequency;
  description: string;
  is_active: boolean;
}

const defaultFormState = (currency = 'USD'): FormState => ({
  name: '',
  price_amount: '',
  currency,
  billing_frequency: 'monthly',
  description: '',
  is_active: true,
});

function planToFormState(plan: SubscriptionPlanItem): FormState {
  return {
    name: plan.name,
    price_amount: plan.price_amount,
    currency: plan.currency,
    billing_frequency: plan.billing_frequency,
    description: plan.description ?? '',
    is_active: plan.is_active,
  };
}

function buildCreatePayload(form: FormState, role: SubscriptionPlanRole): SubscriptionPlanCreateRequest {
  return {
    role,
    name: form.name.trim(),
    billing_frequency: form.billing_frequency,
    currency: form.currency,
    price_amount: form.price_amount.trim(),
    teams_limit_type: 'unlimited',
    players_limit_type: 'unlimited',
    historical_records_duration: 'unlimited',
    is_active: form.is_active,
    include_offline_sync: false,
    description: form.description.trim() || null,
    features: [],
  };
}

function buildUpdatePayload(form: FormState): SubscriptionPlanUpdateRequest {
  return {
    name: form.name.trim(),
    price_amount: form.price_amount.trim(),
    is_active: form.is_active,
    description: form.description.trim() || null,
  };
}

export function SubscriptionPlanForm({
  open,
  onOpenChange,
  mode,
  role,
  plan,
  onSubmit,
  isSubmitting = false,
}: SubscriptionPlanFormProps) {
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const [form, setForm] = useState<FormState>(() => defaultFormState());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && plan) {
      setForm(planToFormState(plan));
    } else {
      const defaultCurrency = currencies[0]?.code ?? 'USD';
      setForm(defaultFormState(defaultCurrency));
    }
    setFieldErrors({});
    setFormError(null);
  }, [open, mode, plan, role, currencies]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Subscription name is required.';
    }

    if (!form.price_amount.trim()) {
      errors.price_amount = 'Price is required.';
    } else {
      const price = Number.parseFloat(form.price_amount);
      if (Number.isNaN(price) || price < 0) {
        errors.price_amount = 'Please enter a valid price.';
      }
    }

    if (mode === 'create' && !form.currency) {
      errors.currency = 'Please select a currency.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    try {
      const payload =
        mode === 'create' ? buildCreatePayload(form, role) : buildUpdatePayload(form);
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      const parsed = parseApiError(
        error,
        mode === 'create'
          ? 'Unable to create subscription plan. Please try again.'
          : 'Unable to save changes. Please try again.',
      );
      setFormError(parsed.message);
      setFieldErrors((prev) => ({ ...prev, ...parsed.fieldErrors }));
    }
  };

  const title = mode === 'create' ? 'Add subscription plan' : 'Edit subscription plan';
  const description =
    mode === 'create'
      ? 'Create a new subscription plan for organizations.'
      : 'Update subscription plan details. Currency and billing frequency cannot be changed.';

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
            <Label htmlFor="plan-name" className="text-body-5">
              Subscription name
            </Label>
            <Input
              id="plan-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'plan-name-error' : undefined}
              disabled={isSubmitting}
              placeholder="e.g. Pro Plan"
            />
            {fieldErrors.name ? (
              <p id="plan-name-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-price" className="text-body-5">
                Price
              </Label>
              <Input
                id="plan-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price_amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, price_amount: event.target.value }))
                }
                aria-invalid={Boolean(fieldErrors.price_amount)}
                aria-describedby={fieldErrors.price_amount ? 'plan-price-error' : undefined}
                disabled={isSubmitting}
                placeholder="0.00"
              />
              {fieldErrors.price_amount ? (
                <p id="plan-price-error" className="font-outfit text-body-sm text-destructive" role="alert">
                  {fieldErrors.price_amount}
                </p>
              ) : null}
            </div>

            {mode === 'create' ? (
              <div className="space-y-2">
                <Label htmlFor="plan-currency" className="text-body-5">
                  Currency
                </Label>
                <select
                  id="plan-currency"
                  value={form.currency}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, currency: event.target.value }))
                  }
                  disabled={isSubmitting || currenciesLoading}
                  aria-invalid={Boolean(fieldErrors.currency)}
                  className="flex h-10 w-full rounded-lg border border-border bg-input px-3 font-outfit text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currencies.length === 0 ? (
                    <option value="USD">USD</option>
                  ) : (
                    currencies.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} — {item.name}
                      </option>
                    ))
                  )}
                </select>
                {fieldErrors.currency ? (
                  <p className="font-outfit text-body-sm text-destructive" role="alert">
                    {fieldErrors.currency}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-body-5">Currency</Label>
                <p className="flex h-10 items-center font-outfit text-body-sm text-muted-foreground">
                  {form.currency}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-duration" className="text-body-5">
              Duration
            </Label>
            {mode === 'create' ? (
              <select
                id="plan-duration"
                value={form.billing_frequency}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    billing_frequency: event.target.value as BillingFrequency,
                  }))
                }
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 font-outfit text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            ) : (
              <p className="flex h-10 items-center font-outfit text-body-sm text-muted-foreground">
                {form.billing_frequency === 'monthly' ? 'Monthly' : 'Yearly'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-description" className="text-body-5">
              Description
            </Label>
            <Textarea
              id="plan-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              disabled={isSubmitting}
              placeholder="Optional plan description"
              rows={3}
            />
          </div>

          {mode === 'edit' ? (
            <div className="flex items-center gap-2">
              <input
                id="plan-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_active: event.target.checked }))
                }
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Label htmlFor="plan-active" className="text-body-5">
                Plan is active
              </Label>
            </div>
          ) : null}
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
