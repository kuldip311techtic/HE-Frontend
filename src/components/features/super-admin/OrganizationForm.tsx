import { useEffect } from "react";
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
import { getApiFieldErrors } from "@/lib/api/client";
import type { Organization } from "@/types/api";

const createSchema = z.object({
  name: z.string().min(1, "Organization name is required."),
  contact_email: z
    .string()
    .min(1, "Contact email is required.")
    .email("Please enter a valid email address."),
  phone_number: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
});

const editSchema = z.object({
  name: z.string().min(1, "Organization name is required.").optional(),
  contact_email: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  phone_number: z
    .string()
    .min(1, "Phone number is required.")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(1, "Address is required.")
    .optional()
    .or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof createSchema>;

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  isLoading?: boolean;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
}

interface OrganizationFormContentProps {
  open: boolean;
  organization?: Organization | null;
  isLoading: boolean;
  onSubmit: (values: OrganizationFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

function OrganizationFormContent({
  open,
  organization,
  isLoading,
  onSubmit,
  onOpenChange,
}: OrganizationFormContentProps) {
  const isEdit = Boolean(organization);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: organization?.name ?? "",
        contact_email: organization?.contact_email ?? "",
        phone_number: organization?.phone_number ?? "",
        address: organization?.address ?? "",
      });
    }
  }, [open, organization, form]);

  const handleSubmit = async (values: OrganizationFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);
      for (const [field, message] of Object.entries(fieldErrors)) {
        if (field in values) {
          form.setError(field as keyof OrganizationFormValues, { message });
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
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Sports Club" disabled={isLoading} {...field} />
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
              <FormLabel>Contact email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@example.com"
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
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="+1 555 0100" disabled={isLoading} {...field} />
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
                <Input placeholder="123 Main St" disabled={isLoading} {...field} />
              </FormControl>
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
                : "Create organization"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function OrganizationForm({
  open,
  onOpenChange,
  organization,
  isLoading = false,
  onSubmit,
}: OrganizationFormProps) {
  const isEdit = Boolean(organization);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-outfit text-body-25">
            {isEdit ? "Edit organization" : "Add organization"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update organization details. Changes apply immediately."
              : "Create a new organization on the platform."}
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <OrganizationFormContent
            key={organization?.id ?? "create"}
            open={open}
            organization={organization}
            isLoading={isLoading}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
