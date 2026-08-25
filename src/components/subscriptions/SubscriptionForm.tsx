import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
import { subscriptionToFormValues } from "@/lib/subscription-helpers";
import { ApiClientError } from "@/services/api-client";
import {
  SUBSCRIPTION_DURATIONS,
  type Subscription,
  type SubscriptionFormValues,
} from "@/types/subscription";

const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Subscription name is required")
    .max(255, "Subscription name must be 255 characters or less"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
      "Please enter a valid price",
    ),
  duration: z.string().min(1, "Duration is required"),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less"),
});

interface SubscriptionFormProps {
  mode: "create" | "edit";
  subscription?: Subscription;
  onSubmit: (values: SubscriptionFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

function getDefaultValues(subscription?: Subscription): SubscriptionFormValues {
  if (subscription) {
    return subscriptionToFormValues(subscription);
  }

  return {
    name: "",
    price: "",
    duration: "",
    description: "",
  };
}

export function SubscriptionForm({
  mode,
  subscription,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: getDefaultValues(subscription),
  });

  useEffect(() => {
    form.reset(getDefaultValues(subscription));
  }, [subscription, form]);

  const apiErrorMessage =
    error instanceof ApiClientError ? error.message : error?.message;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label={
          mode === "create"
            ? "Add subscription plan form"
            : "Edit subscription plan form"
        }
        noValidate
      >
        {apiErrorMessage && <ErrorMessage message={apiErrorMessage} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Pro Plan"
                  autoComplete="off"
                  disabled={isLoading}
                  aria-label="Subscription name"
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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="99.99"
                  disabled={isLoading}
                  aria-label="Subscription price"
                  {...field}
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger aria-label="Subscription duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBSCRIPTION_DURATIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of the plan"
                  disabled={isLoading}
                  aria-label="Subscription description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-11"
            aria-label="Cancel subscription form"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="min-h-11"
            aria-label={
              mode === "create" ? "Save subscription plan" : "Save changes"
            }
          >
            {isLoading ? (
              <>
                <LoadingSpinner
                  label={
                    mode === "create"
                      ? "Saving subscription plan"
                      : "Saving changes"
                  }
                />
                <span>Saving…</span>
              </>
            ) : mode === "create" ? (
              "Save"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
