import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control } from "react-hook-form";
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
import type { Organization, OrganizationUpdateRequest } from "@/types/api";
import { cn } from "@/lib/utils";

const organizationCreateSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required."),
  contact_email: z
    .string()
    .trim()
    .min(1, "Contact email is required.")
    .email("Please enter a valid email address."),
  phone_number: z.string().trim().min(1, "Phone number is required."),
  address: z.string().trim().min(1, "Address is required."),
});

const organizationEditSchema = z.object({
  name: z.string().trim().min(1, "Organization name is required."),
  contact_email: z
    .string()
    .trim()
    .min(1, "Contact email is required.")
    .email("Please enter a valid email address."),
  phone_number: z.string().trim(),
  address: z.string().trim(),
});

type OrganizationCreateFormValues = z.infer<typeof organizationCreateSchema>;
type OrganizationEditFormValues = z.infer<typeof organizationEditSchema>;

export function toOrganizationUpdatePayload(
  values: OrganizationEditFormValues,
  original: Organization,
): OrganizationUpdateRequest {
  const payload: OrganizationUpdateRequest = {};
  const name = values.name?.trim();
  const contactEmail = values.contact_email?.trim();
  const phoneNumber = values.phone_number?.trim();
  const address = values.address?.trim();

  if (name && name !== original.name) payload.name = name;
  if (contactEmail && contactEmail !== original.contact_email) {
    payload.contact_email = contactEmail;
  }
  if (phoneNumber && phoneNumber !== original.phone_number) {
    payload.phone_number = phoneNumber;
  }
  if (address && address !== original.address) payload.address = address;

  return payload;
}

interface OrganizationFormFieldsProps {
  control: Control<OrganizationCreateFormValues | OrganizationEditFormValues>;
  isLoading: boolean;
}

function OrganizationFormFields({
  control,
  isLoading,
}: OrganizationFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
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
                {...field}
              />
            </FormControl>
            <FormMessage className={adminFormMessageClass} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contact_email"
        render={({ field }) => (
          <FormItem className="gap-[10px]">
            <FormLabel className={adminFormLabelClass}>Contact email</FormLabel>
            <FormControl>
              <Input
                type="email"
                disabled={isLoading}
                className={adminFormInputClass}
                autoComplete="email"
                {...field}
              />
            </FormControl>
            <FormMessage className={adminFormMessageClass} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone_number"
        render={({ field }) => (
          <FormItem className="gap-[10px]">
            <FormLabel className={adminFormLabelClass}>Phone number</FormLabel>
            <FormControl>
              <Input
                type="tel"
                disabled={isLoading}
                className={adminFormInputClass}
                autoComplete="tel"
                {...field}
              />
            </FormControl>
            <FormMessage className={adminFormMessageClass} />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="gap-[10px]">
            <FormLabel className={adminFormLabelClass}>Address</FormLabel>
            <FormControl>
              <Input
                disabled={isLoading}
                className={adminFormInputClass}
                autoComplete="street-address"
                {...field}
              />
            </FormControl>
            <FormMessage className={adminFormMessageClass} />
          </FormItem>
        )}
      />
    </>
  );
}

interface OrganizationFormFooterProps {
  isLoading: boolean;
  submitLabel: string;
  onOpenChange: (open: boolean) => void;
}

function OrganizationFormFooter({
  isLoading,
  submitLabel,
  onOpenChange,
}: OrganizationFormFooterProps) {
  return (
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
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}

interface OrganizationCreateFormContentProps {
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSubmit: (values: OrganizationCreateFormValues) => void;
}

function OrganizationCreateFormContent({
  isLoading,
  onOpenChange,
  onCreateSubmit,
}: OrganizationCreateFormContentProps) {
  const form = useForm<OrganizationCreateFormValues>({
    resolver: zodResolver(organizationCreateSchema),
    defaultValues: {
      name: "",
      contact_email: "",
      phone_number: "",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onCreateSubmit)}
        className="flex flex-col gap-[16px]"
      >
        <OrganizationFormFields control={form.control} isLoading={isLoading} />
        <OrganizationFormFooter
          isLoading={isLoading}
          submitLabel={isLoading ? "Saving…" : "Create"}
          onOpenChange={onOpenChange}
        />
      </form>
    </Form>
  );
}

interface OrganizationEditFormContentProps {
  organization: Organization;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onEditSubmit: (values: OrganizationEditFormValues) => void;
}

function OrganizationEditFormContent({
  organization,
  isLoading,
  onOpenChange,
  onEditSubmit,
}: OrganizationEditFormContentProps) {
  const form = useForm<OrganizationEditFormValues>({
    resolver: zodResolver(organizationEditSchema),
    defaultValues: {
      name: organization.name,
      contact_email: organization.contact_email,
      phone_number: organization.phone_number ?? "",
      address: organization.address ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: organization.name,
      contact_email: organization.contact_email,
      phone_number: organization.phone_number ?? "",
      address: organization.address ?? "",
    });
  }, [organization, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (form.formState.errors.root) {
        form.clearErrors("root");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (values: OrganizationEditFormValues) => {
    const payload = toOrganizationUpdatePayload(values, organization);
    if (Object.keys(payload).length === 0) {
      form.setError("root", {
        type: "manual",
        message: "No changes to save.",
      });
      return;
    }

    form.clearErrors("root");
    onEditSubmit(values);
  };

  const rootError = form.formState.errors.root?.message;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-[16px]"
      >
        <OrganizationFormFields control={form.control} isLoading={isLoading} />
        {rootError ? (
          <p role="alert" className={adminFormMessageClass}>
            {rootError}
          </p>
        ) : null}
        <OrganizationFormFooter
          isLoading={isLoading}
          submitLabel={isLoading ? "Saving…" : "Save changes"}
          onOpenChange={onOpenChange}
        />
      </form>
    </Form>
  );
}

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  isLoading?: boolean;
  onCreateSubmit: (values: OrganizationCreateFormValues) => void;
  onEditSubmit: (values: OrganizationEditFormValues) => void;
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  organization,
  isLoading = false,
  onCreateSubmit,
  onEditSubmit,
}: OrganizationFormDialogProps) {
  const isEdit = Boolean(organization);

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

        {open && organization ? (
          <OrganizationEditFormContent
            key={organization.id}
            organization={organization}
            isLoading={isLoading}
            onOpenChange={onOpenChange}
            onEditSubmit={onEditSubmit}
          />
        ) : open ? (
          <OrganizationCreateFormContent
            key="create"
            isLoading={isLoading}
            onOpenChange={onOpenChange}
            onCreateSubmit={onCreateSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { OrganizationCreateFormValues, OrganizationEditFormValues };
