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
import type { UserRoleOption } from "@/hooks/useUsers";
import { splitFullName } from "@/lib/utils";
import type { SuperAdminUser } from "@/types/super-admin";

const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(255, "Name must be 255 characters or fewer."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  role: z.string().min(1, "Role is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

const editUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(255, "Name must be 255 characters or fewer."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  role: z.string().min(1, "Role is required."),
  password: z
    .string()
    .max(72, "Password must be 72 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export type UserFormValues = z.infer<typeof createUserSchema>;

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: SuperAdminUser;
  roleOptions: UserRoleOption[];
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export function UserForm({
  mode,
  initialData,
  roleOptions,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError,
}: UserFormProps) {
  const schema = mode === "create" ? createUserSchema : editUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      role: initialData?.role?.toLowerCase() ?? "coach",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role.toLowerCase(),
        password: "",
      });
    }
  }, [initialData, form]);

  useEffect(() => {
    if (serverError?.toLowerCase().includes("email")) {
      form.setError("email", { message: serverError });
    }
  }, [serverError, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4"
        aria-label={mode === "create" ? "Add user form" : "Edit user form"}
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. John Doe"
                  disabled={isSubmitting}
                  aria-required="true"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  disabled={isSubmitting}
                  aria-required="true"
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger aria-label="User role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((option) => (
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

        {mode === "create" ? (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    disabled={isSubmitting}
                    aria-required="true"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {serverError && !serverError.toLowerCase().includes("email") && (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}

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
            ) : mode === "create" ? (
              "Add User"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function buildCreateUserPayload(values: UserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  return {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  };
}

export function buildUpdateUserPayload(values: UserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  const payload: {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    role: string;
    password?: string;
  } = {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    role: values.role,
  };
  if (values.password?.trim()) {
    payload.password = values.password.trim();
  }
  return payload;
}
