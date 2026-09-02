import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types/super-admin";

const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Subscription name is required.")
    .max(255, "Name must be 255 characters or fewer."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number." })
    .min(0, "Price must be zero or greater."),
  duration: z
    .string()
    .min(1, "Duration is required.")
    .max(100, "Duration must be 100 characters or fewer."),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or fewer.")
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  mode: "create" | "edit";
  initialData?: SubscriptionPlan;
  onSubmit: (values: SubscriptionFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SubscriptionForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData?.price ?? 0,
      duration: initialData?.duration ?? "",
      description: initialData?.description ?? "",
      status:
        initialData?.status?.toLowerCase() === "inactive" ? "inactive" : "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        price: initialData.price,
        duration: initialData.duration,
        description: initialData.description ?? "",
        status:
          initialData.status?.toLowerCase() === "inactive"
            ? "inactive"
            : "active",
      });
    }
  }, [initialData, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4"
        aria-label={
          mode === "create"
            ? "Add subscription plan form"
            : "Edit subscription plan form"
        }
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Pro Plan"
                  disabled={isSubmitting}
                  aria-required="true"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    disabled={isSubmitting}
                    aria-required="true"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 12 months"
                    disabled={isSubmitting}
                    aria-required="true"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className={cn(
                    "flex min-h-[80px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Describe the subscription plan benefits…"
                  disabled={isSubmitting}
                  aria-label="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger aria-label="Subscription status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Saving…</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
