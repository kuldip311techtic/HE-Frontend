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
import {
  adminFormInputClass,
  adminFormLabelClass,
  adminFormMessageClass,
  adminFormPrimaryButtonClass,
} from "@/lib/adminFormStyles";
import type { Organization } from "@/types/api";
import { cn } from "@/lib/utils";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required."),
  contact_email: z
    .string()
    .min(1, "Contact email is required.")
    .email("Please enter a valid email address."),
  phone_number: z.string().min(1, "Phone number is required."),
  address: z.string().min(1, "Address is required."),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  isLoading?: boolean;
  onSubmit: (values: OrganizationFormValues) => void;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  isLoading = false,
  onSubmit,
}: OrganizationFormDialogProps) {
  const isEdit = Boolean(organization);

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
    if (open) {
      form.reset({
        name: organization?.name ?? "",
        contact_email: organization?.contact_email ?? "",
        phone_number: organization?.phone_number ?? "",
        address: organization?.address ?? "",
      });
    }
  }, [open, organization, form]);

  const handleSubmit = (values: OrganizationFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-lg overflow-y-auto rounded-[10px] border-figma-border bg-figma-background font-outfit",
        )}
      >
        <DialogHeader className="gap-[12px]">
          <DialogTitle className="font-outfit text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white">
            {isEdit ? "Edit organization" : "Add organization"}
          </DialogTitle>
          <DialogDescription className="font-outfit text-[16px] font-normal leading-[22px] text-figma-muted">
            {isEdit
              ? "Update organization contact details. Changes apply immediately."
              : "Create a new organization on the platform."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-[16px]"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>
                    Organization name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className={adminFormInputClass}
                      aria-label="Organization name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>
                    Contact email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isLoading}
                      className={adminFormInputClass}
                      autoComplete="email"
                      aria-label="Contact email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      disabled={isLoading}
                      className={adminFormInputClass}
                      autoComplete="tel"
                      aria-label="Phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className={adminFormInputClass}
                      autoComplete="street-address"
                      aria-label="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-[12px] pt-[4px] sm:gap-[12px]">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className={cn(
                  "rounded-[10px] border-figma-border bg-transparent font-outfit text-[16px] font-medium leading-[20.16px] text-white",
                  "hover:bg-figma-accent/30 hover:text-white",
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className={adminFormPrimaryButtonClass}
                aria-busy={isLoading}
              >
                {isLoading ? "Saving…" : isEdit ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export type { OrganizationFormValues };
