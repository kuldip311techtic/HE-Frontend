import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiFieldErrors } from "@/lib/api/client";
import type {
  BillingFrequency,
  HistoricalRecordsDuration,
  LimitType,
  SubscriptionPlan,
  SubscriptionPlanRole,
} from "@/types/api";

const limitTypeOptions: { value: LimitType; label: string }[] = [
  { value: "limited", label: "Limited" },
  { value: "unlimited", label: "Unlimited" },
];

const billingOptions: { value: BillingFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const durationOptions: { value: HistoricalRecordsDuration; label: string }[] = [
  { value: "1_month", label: "1 month" },
  { value: "3_months", label: "3 months" },
  { value: "6_months", label: "6 months" },
  { value: "1_year", label: "1 year" },
  { value: "unlimited", label: "Unlimited" },
];

const baseFormSchema = z.object({
  name: z.string().min(1, "Plan name is required."),
  billing_frequency: z.enum(["monthly", "yearly"], {
    required_error: "Please select a billing frequency.",
  }),
  currency: z.string().length(3, "Currency must be a 3-letter code."),
  price_amount: z
    .string()
    .min(1, "Price is required.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Please enter a valid price.",
    }),
  teams_limit_type: z.enum(["limited", "unlimited"]),
  teams_count: z.string().optional(),
  coaches_limit_type: z.enum(["limited", "unlimited"]),
  coaches_count: z.string().optional(),
  players_limit_type: z.enum(["limited", "unlimited"]),
  players_count: z.string().optional(),
  historical_records_duration: z.enum([
    "1_month",
    "3_months",
    "6_months",
    "1_year",
    "unlimited",
  ]),
  description: z.string().optional(),
  features: z.string().optional(),
  is_active: z.enum(["true", "false"]),
  include_offline_sync: z.enum(["true", "false"]),
});

function buildFormSchema(role: SubscriptionPlanRole) {
  return baseFormSchema.superRefine((data, ctx) => {
    if (data.teams_limit_type === "limited") {
      const count = Number(data.teams_count);
      if (!data.teams_count || Number.isNaN(count) || count < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Teams count is required when limited.",
          path: ["teams_count"],
        });
      }
    }
    if (role === "org_admin" && data.coaches_limit_type === "limited") {
      const count = Number(data.coaches_count);
      if (!data.coaches_count || Number.isNaN(count) || count < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Coaches count is required when limited.",
          path: ["coaches_count"],
        });
      }
    }
    if (data.players_limit_type === "limited") {
      const count = Number(data.players_count);
      if (!data.players_count || Number.isNaN(count) || count < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Players count is required when limited.",
          path: ["players_count"],
        });
      }
    }
  });
}

export type SubscriptionPlanFormValues = z.infer<typeof baseFormSchema>;

interface SubscriptionPlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlan | null;
  isLoading?: boolean;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
}

interface SubscriptionPlanFormContentProps {
  open: boolean;
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlan | null;
  isLoading: boolean;
  onSubmit: (values: SubscriptionPlanFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

function SubscriptionPlanFormContent({
  open,
  role,
  plan,
  isLoading,
  onSubmit,
  onOpenChange,
}: SubscriptionPlanFormContentProps) {
  const isEdit = Boolean(plan);
  const formSchema = useMemo(() => buildFormSchema(role), [role]);

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      billing_frequency: "monthly",
      currency: "USD",
      price_amount: "",
      teams_limit_type: "unlimited",
      teams_count: "",
      coaches_limit_type: "unlimited",
      coaches_count: "",
      players_limit_type: "unlimited",
      players_count: "",
      historical_records_duration: "1_year",
      description: "",
      features: "",
      is_active: "true",
      include_offline_sync: "false",
    },
  });

  const teamsLimitType = form.watch("teams_limit_type");
  const coachesLimitType = form.watch("coaches_limit_type");
  const playersLimitType = form.watch("players_limit_type");

  useEffect(() => {
    if (open) {
      form.reset({
        name: plan?.name ?? "",
        billing_frequency: plan?.billing_frequency ?? "monthly",
        currency: plan?.currency ?? "USD",
        price_amount: plan?.price_amount ?? "",
        teams_limit_type: plan?.teams_limit_type ?? "unlimited",
        teams_count:
          plan?.teams_count != null ? String(plan.teams_count) : "",
        coaches_limit_type: plan?.coaches_limit_type ?? "unlimited",
        coaches_count:
          plan?.coaches_count != null ? String(plan.coaches_count) : "",
        players_limit_type: plan?.players_limit_type ?? "unlimited",
        players_count:
          plan?.players_count != null ? String(plan.players_count) : "",
        historical_records_duration:
          plan?.historical_records_duration ?? "1_year",
        description: plan?.description ?? "",
        features: plan?.features?.join(", ") ?? "",
        is_active: plan?.is_active === false ? "false" : "true",
        include_offline_sync: plan?.include_offline_sync ? "true" : "false",
      });
    }
  }, [open, plan, form]);

  const handleSubmit = async (values: SubscriptionPlanFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field in values) {
          form.setError(field as keyof SubscriptionPlanFormValues, { message });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        noValidate
      >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="billing_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing frequency</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billingOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                      {...field}
                    />
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
                    <FormLabel>Teams limit</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {limitTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {teamsLimitType === "limited" && (
                <FormField
                  control={form.control}
                  name="teams_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teams count</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {role === "org_admin" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="coaches_limit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coaches limit</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {limitTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {coachesLimitType === "limited" && (
                  <FormField
                    control={form.control}
                    name="coaches_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coaches count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="players_limit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Players limit</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {limitTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {playersLimitType === "limited" && (
                <FormField
                  control={form.control}
                  name="players_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Players count</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="historical_records_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical records duration</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
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
                  <FormLabel>
                    Description{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Features{" "}
                    <span className="font-normal text-muted-foreground">
                      (comma-separated, optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Feature 1, Feature 2"
                      disabled={isLoading}
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
                  <FormLabel>Offline sync</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Included</SelectItem>
                      <SelectItem value="false">Not included</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                {isLoading
                  ? isEdit
                    ? "Saving…"
                    : "Creating…"
                  : isEdit
                    ? "Save changes"
                    : "Create plan"}
              </Button>
            </DialogFooter>
      </form>
    </Form>
  );
}

export function SubscriptionPlanForm({
  open,
  onOpenChange,
  role,
  plan,
  isLoading = false,
  onSubmit,
}: SubscriptionPlanFormProps) {
  const isEdit = Boolean(plan);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-outfit text-body-25">
            {isEdit ? "Edit subscription plan" : "Add subscription plan"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update plan details for ${role === "org_admin" ? "organization admins" : "coaches"}.`
              : `Create a new plan for ${role === "org_admin" ? "organization admins" : "coaches"}.`}
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <SubscriptionPlanFormContent
            key={`${role}-${plan?.id ?? "create"}`}
            open={open}
            role={role}
            plan={plan}
            isLoading={isLoading}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function mapSubscriptionPlanFormToCreateRequest(
  values: SubscriptionPlanFormValues,
  role: SubscriptionPlanRole,
) {
  const features = values.features
    ? values.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  return {
    role,
    name: values.name,
    billing_frequency: values.billing_frequency,
    currency: values.currency,
    price_amount: values.price_amount,
    teams_limit_type: values.teams_limit_type,
    teams_count:
      values.teams_limit_type === "limited"
        ? Number(values.teams_count)
        : null,
    coaches_limit_type:
      role === "org_admin" ? values.coaches_limit_type : null,
    coaches_count:
      role === "org_admin" && values.coaches_limit_type === "limited"
        ? Number(values.coaches_count)
        : null,
    players_limit_type: values.players_limit_type,
    players_count:
      values.players_limit_type === "limited"
        ? Number(values.players_count)
        : null,
    historical_records_duration: values.historical_records_duration,
    is_active: values.is_active === "true",
    include_offline_sync: values.include_offline_sync === "true",
    description: values.description || null,
    features: features.length > 0 ? features : undefined,
  };
}

export function mapSubscriptionPlanFormToUpdateRequest(
  values: SubscriptionPlanFormValues,
  role: SubscriptionPlanRole,
) {
  const features = values.features
    ? values.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
    : null;

  return {
    name: values.name,
    billing_frequency: values.billing_frequency,
    currency: values.currency,
    price_amount: values.price_amount,
    teams_limit_type: values.teams_limit_type,
    teams_count:
      values.teams_limit_type === "limited"
        ? Number(values.teams_count)
        : null,
    coaches_limit_type:
      role === "org_admin" ? values.coaches_limit_type : null,
    coaches_count:
      role === "org_admin" && values.coaches_limit_type === "limited"
        ? Number(values.coaches_count)
        : null,
    players_limit_type: values.players_limit_type,
    players_count:
      values.players_limit_type === "limited"
        ? Number(values.players_count)
        : null,
    historical_records_duration: values.historical_records_duration,
    is_active: values.is_active === "true",
    include_offline_sync: values.include_offline_sync === "true",
    description: values.description || null,
    features,
  };
}
