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
import { ApiClientError } from "@/services/api-client";
import type { User, UserFormValues, UserRole } from "@/types/user";

const USER_ROLES: UserRole[] = ["Coach", "Player"];

const createUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or less"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be 100 characters or less"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(1024, "Password must be 1024 characters or less"),
  role: z.enum(["Coach", "Player"], {
    required_error: "Role is required",
  }),
});

const editUserSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or less"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be 100 characters or less"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .max(1024, "Password must be 1024 characters or less")
    .refine((value) => value === "" || value.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
  role: z.enum(["Coach", "Player"], {
    required_error: "Role is required",
  }),
});

interface UserFormProps {
  mode: "create" | "edit";
  user?: User;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

function getDefaultValues(user?: User): UserFormValues {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    password: "",
    role: (user?.role === "Coach" || user?.role === "Player"
      ? user.role
      : "Coach") as UserRole,
  };
}

export function UserForm({
  mode,
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: UserFormProps) {
  const schema = mode === "create" ? createUserSchema : editUserSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(user),
  });

  useEffect(() => {
    form.reset(getDefaultValues(user));
  }, [user, form]);

  const apiErrorMessage =
    error instanceof ApiClientError ? error.message : error?.message;

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        aria-label={mode === "create" ? "Add user form" : "Edit user form"}
        noValidate
      >
        {apiErrorMessage && <ErrorMessage message={apiErrorMessage} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jane"
                    autoComplete="given-name"
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    autoComplete="family-name"
                    disabled={isLoading}
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
                  placeholder="jane.doe@example.com"
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger aria-label="Select user role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
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
                    mode === "create"
                      ? "Enter a secure password"
                      : "Leave blank to keep current password"
                  }
                  autoComplete={mode === "create" ? "new-password" : "off"}
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
                  label={mode === "create" ? "Adding user" : "Saving changes"}
                />
                <span>{mode === "create" ? "Adding…" : "Saving…"}</span>
              </>
            ) : mode === "create" ? (
              "Add user"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
