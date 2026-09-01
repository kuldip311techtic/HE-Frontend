import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
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
import { cn, isValidEmail, isValidPhone } from "@/lib/utils";
import type { SuperAdminOrganization } from "@/types/super-admin";

const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required.")
    .max(255, "Name must be 255 characters or fewer."),
  contact_email: z
    .string()
    .min(1, "Contact email is required.")
    .refine(isValidEmail, "Please enter a valid email address."),
  phone_number: z
    .string()
    .min(1, "Phone number is required.")
    .refine(isValidPhone, "Please enter a valid phone number."),
  address: z
    .string()
    .min(1, "Address is required.")
    .max(500, "Address must be 500 characters or fewer."),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  mode: "create" | "edit";
  initialData?: SuperAdminOrganization;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function OrganizationForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      contact_email: initialData?.contact_email ?? "",
      phone_number: initialData?.phone_number ?? "",
      address: initialData?.address ?? "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        contact_email: initialData.contact_email ?? "",
        phone_number: initialData.phone_number ?? "",
        address: initialData.address ?? "",
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
            ? "Add organization form"
            : "Edit organization form"
        }
        noValidate
      >
        {serverError && <ErrorMessage message={serverError} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Hoops Academy"
                  disabled={isSubmitting}
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="contact@example.com"
                  disabled={isSubmitting}
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. +1 (555) 123-4567"
                  disabled={isSubmitting}
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <textarea
                  className={cn(
                    "flex min-h-[80px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Street address, city, state, zip"
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-label="Address"
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
