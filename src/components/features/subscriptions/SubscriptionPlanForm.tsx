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
  HistoricalRecordsDuration,
  LimitType,
  SubscriptionPlanCreateRequest,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
  SubscriptionPlanUpdateRequest,
} from '@/types/subscriptions';

const HISTORICAL_DURATION_OPTIONS: { value: HistoricalRecordsDuration; label: string }[] = [
  { value: '1_month', label: '1 month' },
  { value: '3_months', label: '3 months' },
  { value: '6_months', label: '6 months' },
  { value: '1_year', label: '1 year' },
  { value: 'unlimited', label: 'Unlimited' },
];

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
  teams_limit_type: LimitType;
  teams_count: string;
  coaches_limit_type: LimitType | '';
  coaches_count: string;
  players_limit_type: LimitType;
  players_count: string;
  historical_records_duration: HistoricalRecordsDuration;
  include_offline_sync: boolean;
  featuresText: string;
}

const defaultFormState = (currency = 'USD'): FormState => ({
  name: '',
  price_amount: '',
  currency,
  billing_frequency: 'monthly',
  description: '',
  is_active: true,
  teams_limit_type: 'unlimited',
  teams_count: '',
  coaches_limit_type: '',
  coaches_count: '',
  players_limit_type: 'unlimited',
  players_count: '',
  historical_records_duration: 'unlimited',
  include_offline_sync: false,
  featuresText: '',
});

function planToFormState(plan: SubscriptionPlanItem): FormState {
  return {
    name: plan.name,
    price_amount: plan.price_amount,
    currency: plan.currency,
    billing_frequency: plan.billing_frequency,
    description: plan.description ?? '',
    is_active: plan.is_active,
    teams_limit_type: plan.teams_limit_type,
    teams_count: plan.teams_count == null ? '' : String(plan.teams_count),
    coaches_limit_type: plan.coaches_limit_type ?? '',
    coaches_count: plan.coaches_count == null ? '' : String(plan.coaches_count),
    players_limit_type: plan.players_limit_type,
    players_count: plan.players_count == null ? '' : String(plan.players_count),
    historical_records_duration: plan.historical_records_duration,
    include_offline_sync: plan.include_offline_sync,
    featuresText: plan.features.join('\n'),
  };
}

function parseFeatures(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseOptionalCount(
  limitType: LimitType | '',
  countValue: string,
): number | null | undefined {
  if (limitType !== 'limited') {
    return null;
  }
  const parsed = Number.parseInt(countValue, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function buildLimitFields(form: FormState, planRole: SubscriptionPlanRole) {
  const teams_count = parseOptionalCount(form.teams_limit_type, form.teams_count);
  const players_count = parseOptionalCount(form.players_limit_type, form.players_count);
  const coaches_limit_type =
    planRole === 'org_admin' && form.coaches_limit_type
      ? (form.coaches_limit_type as LimitType)
      : null;
  const coaches_count =
    coaches_limit_type === 'limited'
      ? parseOptionalCount('limited', form.coaches_count)
      : null;

  return {
    teams_limit_type: form.teams_limit_type,
    teams_count,
    coaches_limit_type,
    coaches_count,
    players_limit_type: form.players_limit_type,
    players_count,
    historical_records_duration: form.historical_records_duration,
    include_offline_sync: form.include_offline_sync,
    features: parseFeatures(form.featuresText),
  };
}

function buildCreatePayload(form: FormState, planRole: SubscriptionPlanRole): SubscriptionPlanCreateRequest {
  return {
    role: planRole,
    name: form.name.trim(),
    billing_frequency: form.billing_frequency,
    currency: form.currency,
    price_amount: form.price_amount.trim(),
    is_active: form.is_active,
    description: form.description.trim() || null,
    ...buildLimitFields(form, planRole),
  };
}

function buildUpdatePayload(form: FormState, planRole: SubscriptionPlanRole): SubscriptionPlanUpdateRequest {
  return {
    name: form.name.trim(),
    price_amount: form.price_amount.trim(),
    is_active: form.is_active,
    description: form.description.trim() || null,
    ...buildLimitFields(form, planRole),
  };
}

function validateLimitCount(
  errors: Record<string, string>,
  fieldKey: string,
  limitType: LimitType | '',
  countValue: string,
  label: string,
): void {
  if (limitType !== 'limited') return;
  if (!countValue.trim()) {
    errors[fieldKey] = label + ' is required when the limit type is limited.';
    return;
  }
  const parsed = Number.parseInt(countValue, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    errors[fieldKey] = 'Please enter a valid ' + label.toLowerCase() + '.';
  }
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

    validateLimitCount(errors, 'teams_count', form.teams_limit_type, form.teams_count, 'Teams count');
    validateLimitCount(
      errors,
      'players_count',
      form.players_limit_type,
      form.players_count,
      'Players count',
    );
    if (role === 'org_admin' && form.coaches_limit_type === 'limited') {
      validateLimitCount(
        errors,
        'coaches_count',
        form.coaches_limit_type,
        form.coaches_count,
        'Coaches count',
      );
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
        mode === 'create' ? buildCreatePayload(form, role) : buildUpdatePayload(form, role);
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
    <Dialog open={open} onOpenChange={onOpenChange} className="admin-form-dialog">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="admin-form-dialog__header border-0 px-6 py-5">
          <DialogTitle className="admin-form-dialog__title">{title}</DialogTitle>
          <DialogDescription className="admin-form-dialog__description">{description}</DialogDescription>
        </DialogHeader>
        <DialogContent className="admin-form-dialog__content max-h-[70vh] overflow-y-auto border-0 py-5">
          {formError ? (
            <p className="font-outfit text-body-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="admin-field-group">
            <Label htmlFor="plan-name" className="admin-field-label">
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
              className="admin-field-input"
            />
            {fieldErrors.name ? (
              <p id="plan-name-error" className="font-outfit text-body-sm text-destructive" role="alert">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="admin-form-grid admin-form-grid--split">
            <div className="admin-field-group">
              <Label htmlFor="plan-price" className="admin-field-label">
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
                className="admin-field-input"
              />
              {fieldErrors.price_amount ? (
                <p id="plan-price-error" className="font-outfit text-body-sm text-destructive" role="alert">
                  {fieldErrors.price_amount}
                </p>
              ) : null}
            </div>

            {mode === 'create' ? (
              <div className="admin-field-group">
                <Label htmlFor="plan-currency" className="admin-field-label">
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
                  className="admin-field-select"
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
              <div className="admin-field-group">
                <Label className="admin-field-label">Currency</Label>
                <p className="flex h-11 items-center font-outfit text-body-sm text-muted-foreground">
                  {form.currency}
                </p>
              </div>
            )}
          </div>

          <div className="admin-field-group">
            <Label htmlFor="plan-duration" className="admin-field-label">
              Billing frequency
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
                className="admin-field-select"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            ) : (
              <p className="flex h-11 items-center font-outfit text-body-sm text-muted-foreground">
                {form.billing_frequency === 'monthly' ? 'Monthly' : 'Yearly'}
              </p>
            )}
          </div>

          <div className="admin-form-grid admin-form-grid--split">
            <div className="admin-field-group">
              <Label htmlFor="plan-teams-limit-type" className="admin-field-label">
                Teams limit type
              </Label>
              <select
                id="plan-teams-limit-type"
                value={form.teams_limit_type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    teams_limit_type: event.target.value as LimitType,
                    teams_count: event.target.value === 'unlimited' ? '' : prev.teams_count,
                  }))
                }
                disabled={isSubmitting}
                className="admin-field-select"
              >
                <option value="limited">Limited</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            <div className="admin-field-group">
              <Label htmlFor="plan-teams-count" className="admin-field-label">
                Teams count
              </Label>
              <Input
                id="plan-teams-count"
                type="number"
                min="0"
                step="1"
                value={form.teams_count}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, teams_count: event.target.value }))
                }
                disabled={isSubmitting || form.teams_limit_type !== 'limited'}
                aria-invalid={Boolean(fieldErrors.teams_count)}
                aria-describedby={fieldErrors.teams_count ? 'plan-teams-count-error' : undefined}
                className="admin-field-input"
              />
              {fieldErrors.teams_count ? (
                <p
                  id="plan-teams-count-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.teams_count}
                </p>
              ) : null}
            </div>
          </div>

          {role === 'org_admin' ? (
            <div className="admin-form-grid admin-form-grid--split">
              <div className="admin-field-group">
                <Label htmlFor="plan-coaches-limit-type" className="admin-field-label">
                  Coaches limit type
                </Label>
                <select
                  id="plan-coaches-limit-type"
                  value={form.coaches_limit_type}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      coaches_limit_type: event.target.value as LimitType | '',
                      coaches_count:
                        event.target.value !== 'limited' ? '' : prev.coaches_count,
                    }))
                  }
                  disabled={isSubmitting}
                  className="admin-field-select"
                >
                  <option value="">Not set</option>
                  <option value="limited">Limited</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
              <div className="admin-field-group">
                <Label htmlFor="plan-coaches-count" className="admin-field-label">
                  Coaches count
                </Label>
                <Input
                  id="plan-coaches-count"
                  type="number"
                  min="0"
                  step="1"
                  value={form.coaches_count}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, coaches_count: event.target.value }))
                  }
                  disabled={isSubmitting || form.coaches_limit_type !== 'limited'}
                  aria-invalid={Boolean(fieldErrors.coaches_count)}
                  aria-describedby={
                    fieldErrors.coaches_count ? 'plan-coaches-count-error' : undefined
                  }
                  className="admin-field-input"
                />
                {fieldErrors.coaches_count ? (
                  <p
                    id="plan-coaches-count-error"
                    className="font-outfit text-body-sm text-destructive"
                    role="alert"
                  >
                    {fieldErrors.coaches_count}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="admin-form-grid admin-form-grid--split">
            <div className="admin-field-group">
              <Label htmlFor="plan-players-limit-type" className="admin-field-label">
                Players limit type
              </Label>
              <select
                id="plan-players-limit-type"
                value={form.players_limit_type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    players_limit_type: event.target.value as LimitType,
                    players_count: event.target.value === 'unlimited' ? '' : prev.players_count,
                  }))
                }
                disabled={isSubmitting}
                className="admin-field-select"
              >
                <option value="limited">Limited</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
            <div className="admin-field-group">
              <Label htmlFor="plan-players-count" className="admin-field-label">
                Players count
              </Label>
              <Input
                id="plan-players-count"
                type="number"
                min="0"
                step="1"
                value={form.players_count}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, players_count: event.target.value }))
                }
                disabled={isSubmitting || form.players_limit_type !== 'limited'}
                aria-invalid={Boolean(fieldErrors.players_count)}
                aria-describedby={
                  fieldErrors.players_count ? 'plan-players-count-error' : undefined
                }
                className="admin-field-input"
              />
              {fieldErrors.players_count ? (
                <p
                  id="plan-players-count-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldErrors.players_count}
                </p>
              ) : null}
            </div>
          </div>

          <div className="admin-field-group">
            <Label htmlFor="plan-historical-duration" className="admin-field-label">
              Historical records duration
            </Label>
            <select
              id="plan-historical-duration"
              value={form.historical_records_duration}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  historical_records_duration: event.target.value as HistoricalRecordsDuration,
                }))
              }
              disabled={isSubmitting}
              className="admin-field-select"
            >
              {HISTORICAL_DURATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field-group">
            <Label htmlFor="plan-description" className="admin-field-label">
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
              className="admin-field-textarea"
            />
          </div>

          <div className="admin-field-group">
            <Label htmlFor="plan-features" className="admin-field-label">
              Features
            </Label>
            <Textarea
              id="plan-features"
              value={form.featuresText}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, featuresText: event.target.value }))
              }
              disabled={isSubmitting}
              placeholder="One feature per line"
              rows={4}
              className="admin-field-textarea"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                id="plan-offline-sync"
                type="checkbox"
                checked={form.include_offline_sync}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, include_offline_sync: event.target.checked }))
                }
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-figma-border accent-figma-brand focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Label htmlFor="plan-offline-sync" className="admin-field-label">
                Include offline sync
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="plan-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_active: event.target.checked }))
                }
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-figma-border accent-figma-brand focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Label htmlFor="plan-active" className="admin-field-label">
                Plan is active
              </Label>
            </div>
          </div>
        </DialogContent>
        <DialogFooter className="admin-form-dialog__footer border-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="admin-outline-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="admin-primary-btn"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
