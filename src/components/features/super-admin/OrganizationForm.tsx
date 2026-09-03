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
import type { Organization } from "@/types/api";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required."),
  contact_email: z
    .string()
    .min(1, "Contact email is required.")
    .email("Please enter a valid email address."),
  phone_number: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormProps {
  mode: "create" | "edit";
  organization?: Organization | null;
  onSubmit: (values: OrganizationFormValues) => void;
  formId: string;
}

export function OrganizationForm({
  mode,
  organization,
  onSubmit,
  formId,
}: OrganizationFormProps) {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && organization) {
      form.reset({
        name: organization.name,
        contact_email: organization.contact_email,
        phone_number: organization.phone_number,
        address: organization.address,
      });
    } else if (mode === "create") {
      form.reset({
        name: "",
        contact_email: "",
        phone_number: "",
        address: "",
      });
    }
  }, [form, mode, organization]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-[16px]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Basketball Club" {...field} />
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
                  placeholder="contact@organization.com"
                  autoComplete="email"
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
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
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
                <Input placeholder="123 Main St, City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
