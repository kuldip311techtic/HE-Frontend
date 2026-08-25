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
import { organizationToFormValues } from "@/lib/organization-helpers";
import { ApiClientError } from "@/services/api-client";
import type { Organization, OrganizationFormValues } from "@/types/organization";

const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(255, "Organization name must be 255 characters or less"),
  contact_email: z
    .string()
    .min(1, "Contact email is required")
    .email("Please enter a valid email address")
    .max(255, "Contact email must be 255 characters or less"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .max(32, "Phone number must be 32 characters or less"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(500, "Address must be 500 characters or less"),
});

interface OrganizationFormProps {
  mode: "create" | "edit";
  organization?: Organization;
  onSubmit: (values: OrganizationFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

function getDefaultValues(organization?: Organization): OrganizationFormValues {
  if (organization) {
    return organizationToFormValues(organization);
  }

  return {
    name: "",
    contact_email: "",
    phone_number: "",
    address: "",
  };
}

export function OrganizationForm({
  mode,
  organization,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: getDefaultValues(organization),
  });

  useEffect(() => {
    form.reset(getDefaultValues(organization));
  }, [organization, form]);

  const apiErrorMessage =
    error instanceof ApiClientError ? error.message : error?.message;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label={
          mode === "create"
            ? "Add organization form"
            : "Edit organization form"
        }
        noValidate
      >
        {apiErrorMessage && <ErrorMessage message={apiErrorMessage} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Sports Club"
                  autoComplete="organization"
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
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@example.com"
                  autoComplete="email"
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
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="555-123-4567"
                  autoComplete="tel"
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St, City, State"
                  autoComplete="street-address"
                  disabled={isLoading}
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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="min-h-11"
          >
            {isLoading ? (
              <>
                <LoadingSpinner
                  label={
                    mode === "create"
                      ? "Saving organization"
                      : "Saving changes"
                  }
                />
                <span>{mode === "create" ? "Saving…" : "Saving…"}</span>
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
