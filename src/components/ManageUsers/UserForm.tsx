import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UserFormValues, UserRoleOption } from "@/types/users";
import { ApiClientError } from "@/types/api";

const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  role: z.string().min(1, "Role is required"),
  org_id: z.string().optional(),
});

const editUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z
    .string()
    .max(72, "Password must be at most 72 characters")
    .refine((val) => val === "" || val.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
  role: z.string().min(1, "Role is required"),
  org_id: z.string().optional(),
});

interface UserFormProps {
  mode: "create" | "edit";
  user?: User;
  roles: UserRoleOption[];
  loading?: boolean;
  serverError?: ApiClientError | null;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
}

export function UserForm({
  mode,
  user,
  roles,
  loading = false,
  serverError,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const schema = mode === "create" ? createUserSchema : editUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? roles[0]?.value ?? "",
      org_id: user?.org_id ?? undefined,
    },
  });

  const { setError } = form;

  useEffect(() => {
    if (!serverError) return;

    const fieldMap: Record<string, keyof UserFormValues> = {
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
      password: "password",
      role: "role",
      org_id: "org_id",
    };

    for (const detail of serverError.details) {
      const field = fieldMap[detail.field];
      if (field) {
        setError(field, { type: "server", message: detail.message });
      }
    }
  }, [serverError, setError]);

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  const showBanner = Boolean(serverError?.message);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        aria-label={mode === "create" ? "Create user form" : "Edit user form"}
        noValidate
      >
        {showBanner && serverError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              <p>{serverError.message}</p>
              {serverError.details.length > 0 && (
                <ul className="list-inside list-disc space-y-0.5">
                  {serverError.details.map((detail) => (
                    <li key={`${detail.field}-${detail.message}`}>
                      {detail.field}: {detail.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    disabled={loading}
                    aria-label="First name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    disabled={loading}
                    aria-label="Last name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  disabled={loading}
                  aria-label="Email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {mode === "create" ? "Password" : "New password (optional)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    mode === "create" ? "Minimum 8 characters" : "Leave blank to keep current"
                  }
                  disabled={loading}
                  aria-label="Password"
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
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger aria-label="User role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {mode === "create" ? "Create user" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
