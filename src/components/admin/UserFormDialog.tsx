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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminFormInputClass,
  adminFormLabelClass,
  adminFormMessageClass,
  adminFormPrimaryButtonClass,
  adminFormSelectTriggerClass,
} from "@/lib/adminFormStyles";
import type { AdminUserItem, RoleOption } from "@/types/api";
import { cn } from "@/lib/utils";

function buildUserSchema(isEdit: boolean) {
  return z.object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    role: z.string().min(1, "Please select a role."),
    password: isEdit
      ? z
          .string()
          .optional()
          .refine(
            (val) => !val || val.length >= 8,
            "Password must be at least 8 characters.",
          )
      : z.string().min(8, "Password must be at least 8 characters."),
  });
}

type UserFormValues = z.infer<ReturnType<typeof buildUserSchema>>;

interface UserFormContentProps {
  user?: AdminUserItem | null;
  roleOptions: RoleOption[];
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
}

function UserFormContent({
  user,
  roleOptions,
  isLoading,
  onOpenChange,
  onSubmit,
}: UserFormContentProps) {
  const isEdit = Boolean(user);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(buildUserSchema(isEdit)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? roleOptions[0]?.value ?? "",
      password: "",
    });
  }, [user, roleOptions, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[16px]"
      >
        <div className="grid gap-[16px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="gap-[10px]">
                <FormLabel className={adminFormLabelClass}>First name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className={adminFormInputClass}
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={adminFormMessageClass} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="gap-[10px]">
                <FormLabel className={adminFormLabelClass}>Last name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    className={adminFormInputClass}
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className={adminFormMessageClass} />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-[10px]">
              <FormLabel className={adminFormLabelClass}>Email</FormLabel>
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
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="gap-[10px]">
              <FormLabel className={adminFormLabelClass}>Role</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className={adminFormSelectTriggerClass}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-figma-border bg-figma-surface font-outfit">
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={adminFormMessageClass} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="gap-[10px]">
              <FormLabel className={adminFormLabelClass}>
                {isEdit ? "New password (optional)" : "Password"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className={adminFormInputClass}
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
  );
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUserItem | null;
  roleOptions: RoleOption[];
  isLoading?: boolean;
  onSubmit: (values: UserFormValues) => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  roleOptions,
  isLoading = false,
  onSubmit,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-lg overflow-y-auto rounded-[10px] border-figma-border bg-figma-background font-outfit",
        )}
      >
        <DialogHeader className="gap-[12px]">
          <DialogTitle className="font-outfit text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white">
            {isEdit ? "Edit user" : "Add user"}
          </DialogTitle>
          <DialogDescription className="font-outfit text-[16px] font-normal leading-[22px] text-figma-muted">
            {isEdit
              ? "Update user details. Leave password blank to keep the current password."
              : "Create a new coach or player account."}
          </DialogDescription>
        </DialogHeader>

        {open ? (
          <UserFormContent
            key={user?.id ?? "create"}
            user={user}
            roleOptions={roleOptions}
            isLoading={isLoading}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { UserFormValues };
