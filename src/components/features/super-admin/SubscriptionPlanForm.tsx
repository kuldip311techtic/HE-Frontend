import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import type { SubscriptionPlan, SubscriptionPlanRole } from "@/types/api";

const createSchema = z.object({
  name: z.string().min(1, "Plan name is required."),
  price_amount: z
    .string()
    .min(1, "Price is required.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Please enter a valid price.",
    }),
  currency: z.string().min(3, "Currency is required.").max(3),
  billing_frequency: z.enum(["monthly", "yearly"], {
    required_error: "Please select a duration.",
  }),
  description: z.string().optional(),
});

const editSchema = createSchema;

export type SubscriptionPlanFormValues = z.infer<typeof createSchema>;

interface SubscriptionPlanFormProps {
  mode: "create" | "edit";
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlan | null;
  onSubmit: (values: SubscriptionPlanFormValues) => void;
  formId: string;
}

export function SubscriptionPlanForm({
  mode,
  role,
  plan,
  onSubmit,
  formId,
}: SubscriptionPlanFormProps) {
  const schema = mode === "create" ? createSchema : editSchema;

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price_amount: "",
      currency: "USD",
      billing_frequency: "monthly",
      description: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && plan) {
      form.reset({
        name: plan.name,
        price_amount: plan.price_amount,
        currency: plan.currency,
        billing_frequency: plan.billing_frequency,
        description: plan.description ?? "",
      });
    }
  }, [form, mode, plan]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-[16px]"
      >
        <input type="hidden" name="role" value={role} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription name</FormLabel>
              <FormControl>
                <Input placeholder="Pro Plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-[16px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="29.99" {...field} />
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
                  <Input placeholder="USD" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="billing_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional plan description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
